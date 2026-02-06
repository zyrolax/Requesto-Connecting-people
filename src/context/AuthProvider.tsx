import { createContext, useContext, useState, ReactNode } from 'react';
import { useGoogleLogin, googleLogout } from '@react-oauth/google';

export interface User {
    _id: string;
    name: string;
    email: string;
    picture: string;
    role: 'user' | 'admin' | 'provider';
    banned?: boolean;
}

interface AuthContextType {
    user: User | null;
    login: () => void;
    logout: () => void;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(false);

    const login = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            setLoading(true);
            try {
                // Send the token to your backend for verification
                const res = await fetch('/api/auth/google', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        accessToken: tokenResponse.access_token,
                    }),
                });

                const data = await res.json();

                if (!res.ok || !data.success) {
                    // Handle banned users or other auth failures
                    if (res.status === 403) {
                        alert(data.message || 'Your account has been banned.');
                    } else {
                        throw new Error('Backend verification failed');
                    }
                    return;
                }

                setUser(data.user);

            } catch (error) {
                console.error('Login failed', error);
                alert('Login failed. Please try again.');
            } finally {
                setLoading(false);
            }
        },
        onError: error => console.log('Login Failed:', error)
    });

    const logout = () => {
        googleLogout();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
