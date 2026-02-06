import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/AuthProvider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, LayoutDashboard, Shield, Briefcase } from "lucide-react";
import { Link } from "react-router-dom";

export function Header() {
  return (
    <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">R</span>
          </div>
          <span className="font-semibold text-foreground">Requesto</span>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="hidden md:inline-flex" asChild>
            <Link to="/how-it-works">How it works</Link>
          </Button>

          <AuthButtons />
        </div>
      </div>
    </header>
  );
}
const AuthButtons = () => {
  const { user, login, logout, loading } = useAuth();

  if (user) {
    return (
      <div className="flex items-center gap-4">
        {user.role === 'admin' && (
          <Button variant="ghost" size="sm" asChild>
            <Link to="/admin">
              <Shield className="w-4 h-4 mr-2" />
              Admin
            </Link>
          </Button>
        )}
        {user.role === 'provider' && (
          <Button variant="ghost" size="sm" asChild>
            <Link to="/provider">
              <Briefcase className="w-4 h-4 mr-2" />
              Provider
            </Link>
          </Button>
        )}
        <Button variant="ghost" size="sm" asChild>
          <Link to="/dashboard">
            <LayoutDashboard className="w-4 h-4 mr-2" />
            Dashboard
          </Link>
        </Button>

        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.picture} alt={user.name} />
            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="hidden md:block text-xs">
            <p className="font-medium">{user.name}</p>
            <p className="text-muted-foreground">{user.email}</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={logout} title="Sign out">
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <>
      <Button variant="ghost" size="sm" onClick={() => login()} disabled={loading}>
        {loading ? 'Signing in...' : 'Sign in'}
      </Button>
      <Button size="sm" className="rounded-full" onClick={() => login()} disabled={loading}>
        Get started
      </Button>
    </>
  );
};
