import { useEffect, useState, useMemo } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { Header } from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Video, Calendar, Clock, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CountdownTimer } from '@/components/CountdownTimer';

interface Booking {
    _id: string;
    bookingId: string;
    serviceType: string;
    serviceLabel: string;
    meetLink?: string;
    date: string;
    status: string;
}

export default function UserDashboard() {
    const { user } = useAuth();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [now, setNow] = useState(Date.now());

    // Update 'now' every minute to trigger re-filtering
    useEffect(() => {
        const interval = setInterval(() => setNow(Date.now()), 1000);
        return () => clearInterval(interval);
    }, []);

    const fetchBookings = () => {
        if (!user?._id) return;
        fetch(`/api/user/bookings/${user._id}`)
            .then(res => res.json())
            .then(data => {
                if (data.success && Array.isArray(data.bookings)) {
                    setBookings(data.bookings);
                }
            })
            .catch(() => setBookings([]))
            .finally(() => setLoading(false));
    }

    useEffect(() => {
        if (!user?._id) {
            setLoading(false);
            return;
        }
        fetchBookings();
    }, [user?._id]);

    const activeBookings = useMemo(() => {
        return bookings.filter(booking => {
            const expiry = new Date(booking.date).getTime() + 60 * 60 * 1000; // 1 hour duration
            return expiry > now;
        });
    }, [bookings, now]);

    if (!user) {
        return (
            <div className="min-h-screen flex flex-col bg-background">
                <Header />
                <main className="flex-1 flex items-center justify-center p-8">
                    <p className="text-muted-foreground">Please sign in to view your dashboard.</p>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Header />
            <main className="flex-1 container mx-auto p-6 space-y-8">
                <div className="mb-6">
                    <Button variant="ghost" asChild className="pl-0 hover:bg-transparent hover:text-primary">
                        <Link to="/" className="flex items-center gap-2">
                            <ArrowLeft className="w-4 h-4" />
                            Back to Home
                        </Link>
                    </Button>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold">My Dashboard</h1>
                        <p className="text-muted-foreground">Welcome back, {user.name}!</p>
                    </div>
                    {activeBookings.length > 0 && (
                        <div className="bg-primary/5 border border-primary/10 rounded-full px-4 py-1 text-xs font-medium text-primary">
                            {activeBookings.length} Active {activeBookings.length === 1 ? 'Session' : 'Sessions'}
                        </div>
                    )}
                </div>

                <section>
                    <h2 className="text-xl font-semibold mb-4">Upcoming Sessions</h2>
                    {loading ? (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {[1, 2, 3].map(i => (
                                <Card key={i} className="animate-pulse">
                                    <div className="h-48 bg-muted rounded-lg" />
                                </Card>
                            ))}
                        </div>
                    ) : activeBookings.length === 0 ? (
                        <Card className="border-dashed">
                            <CardContent className="pt-10 pb-10 flex flex-col items-center text-center">
                                <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-4">
                                    <Calendar className="w-6 h-6 text-muted-foreground" />
                                </div>
                                <h3 className="text-lg font-medium">No active sessions</h3>
                                <p className="text-muted-foreground max-w-xs mx-auto mt-2">
                                    Your upcoming sessions will appear here. They expire 1 hour after the booking time.
                                </p>
                                <Button className="mt-6" asChild>
                                    <Link to="/">Browse Professionals</Link>
                                </Button>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {activeBookings.map(booking => (
                                <Card key={booking._id} className="overflow-hidden border-primary/20 hover:border-primary/50 transition-colors">
                                    <CardHeader className="pb-3">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <CardTitle className="text-lg">{booking.serviceLabel}</CardTitle>
                                                <CardDescription className="capitalize">{booking.serviceType}</CardDescription>
                                            </div>
                                            <CountdownTimer startDate={booking.date} durationMinutes={60} />
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="flex flex-col gap-2">
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <Calendar className="w-4 h-4" />
                                                <span>{new Date(booking.date).toLocaleDateString()}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <Clock className="w-4 h-4" />
                                                <span>{new Date(booking.date).toLocaleTimeString()}</span>
                                            </div>
                                        </div>

                                        {booking.meetLink && (
                                            <Button className="w-full mt-2 group" asChild>
                                                <Link to={`/meet/${booking.meetLink.split('/').pop()}`}>
                                                    <Video className="w-4 h-4 mr-2 group-hover:animate-pulse" />
                                                    Join Video Call
                                                </Link>
                                            </Button>
                                        )}
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
}
