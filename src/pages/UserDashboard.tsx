import { useEffect, useState } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { Header } from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Video, Calendar, Clock, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

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

    useEffect(() => {
        if (!user?._id) {
            setLoading(false);
            return;
        }
        fetch(`/api/user/bookings/${user._id}`)
            .then(res => res.json())
            .then(data => {
                if (data.success && Array.isArray(data.bookings)) {
                    setBookings(data.bookings);
                }
            })
            .catch(() => setBookings([]))
            .finally(() => setLoading(false));
    }, [user]);

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

            <div>
                <h1 className="text-3xl font-bold">My Dashboard</h1>
                <p className="text-muted-foreground">Welcome back, {user.name}!</p>
            </div>

            <section>
                <h2 className="text-xl font-semibold mb-4">Upcoming Sessions</h2>
                {loading ? (
                    <p>Loading bookings...</p>
                ) : bookings.length === 0 ? (
                    <Card>
                        <CardContent className="pt-6">
                            <p className="text-muted-foreground">You have no upcoming bookings.</p>
                            <Button className="mt-4" asChild>
                                <Link to="/">Browse Professionals</Link>
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {bookings.map(booking => (
                            <Card key={booking._id}>
                                <CardHeader>
                                    <CardTitle>{booking.serviceLabel}</CardTitle>
                                    <CardDescription className="capitalize">{booking.serviceType}</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Calendar className="w-4 h-4" />
                                        <span>{new Date(booking.date).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Clock className="w-4 h-4" />
                                        <span>{new Date(booking.date).toLocaleTimeString()}</span>
                                    </div>

                                    {booking.meetLink && (
                                        <Button className="w-full mt-2" asChild>
                                            {/* Extract UUID from meetLink (https://meet.jit.si/UUID) */}
                                            <Link to={`/meet/${booking.meetLink.split('/').pop()}`}>
                                                <Video className="w-4 h-4 mr-2" />
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
