import { useEffect, useState, useMemo } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { Header } from '@/components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { ProviderProfileEdit } from '@/components/ProviderProfileEdit';
import { ProfileCard } from '@/components/ProfileCard';
import { ProfileDetail } from '@/components/ProfileDetail';
import { CountdownTimer } from '@/components/CountdownTimer';
import {
  ArrowLeft,
  Briefcase,
  Calendar,
  Edit,
  ExternalLink,
  UserPlus,
  Video,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import type { Professional } from '@/lib/data';

interface ProviderBooking {
  _id: string;
  bookingId: string;
  serviceLabel: string;
  serviceType: string;
  meetLink?: string;
  date: string;
  userId?: { name?: string; email?: string };
}

/** Provider profile edit/create is only allowed when app is served from localhost:8080 */
const isProviderEditAllowed = () =>
  typeof window !== 'undefined' &&
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') &&
  window.location.port === '8080';

export default function ProviderDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<Professional | null>(null);
  const [bookings, setBookings] = useState<ProviderBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [previewProfessional, setPreviewProfessional] = useState<Professional | null>(null);
  const [now, setNow] = useState(Date.now());

  // Update 'now' every minute to trigger re-filtering
  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchProfile = async () => {
    if (!user?._id) return;
    try {
      const res = await fetch(`/api/provider/profile/${user._id}`);
      const data = await res.json();
      if (res.ok && data.id) setProfile(data);
      else setProfile(null);
    } catch {
      setProfile(null);
    }
  };

  const fetchBookings = async () => {
    if (!user?._id) return;
    try {
      const res = await fetch(`/api/provider/bookings/${user._id}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.bookings)) setBookings(data.bookings);
      else setBookings([]);
    } catch {
      setBookings([]);
    }
  };

  useEffect(() => {
    if (!user?._id) {
      setLoading(false);
      return;
    }
    setLoading(true);
    Promise.all([fetchProfile(), fetchBookings()]).finally(() => setLoading(false));
  }, [user?._id]);

  const activeBookings = useMemo(() => {
    return bookings.filter(booking => {
      const expiry = new Date(booking.date).getTime() + 60 * 60 * 1000; // 1 hour duration
      return expiry > now;
    });
  }, [bookings, now]);

  const createProfile = async () => {
    if (!user?._id) {
      toast({ title: 'Cannot create profile', description: 'Please sign in again.', variant: 'destructive' });
      return;
    }
    setCreating(true);
    try {
      const res = await fetch('/api/provider/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user._id }),
      });
      const data = await res.json();
      if (data.success && data.professional) {
        setProfile(data.professional);
        setEditOpen(true);
        toast({ title: 'Profile created', description: 'You can now edit your profile and set availability.' });
      } else if (data.professional) {
        setProfile(data.professional);
        toast({ title: 'Profile linked', description: 'Your existing profile is now linked to your account.' });
      } else {
        toast({
          title: 'Could not create profile',
          description: data.message || 'Something went wrong. Try again or contact support.',
          variant: 'destructive',
        });
      }
    } catch (err) {
      toast({
        title: 'Request failed',
        description: 'Check your connection and try again.',
        variant: 'destructive',
      });
    } finally {
      setCreating(false);
    }
  };

  const toggleAvailability = async (available: boolean) => {
    if (!user?._id || !profile) return;
    try {
      const res = await fetch(`/api/provider/profile/${user._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ available, availabilityText: available ? 'Available' : 'Unavailable' }),
      });
      const data = await res.json();
      if (data.success && data.professional) setProfile(data.professional);
    } catch {
      // revert optimistic update if needed
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center p-8">
          <p className="text-muted-foreground">Please sign in to view the provider dashboard.</p>
        </main>
      </div>
    );
  }

  if (user.role !== 'provider') {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center p-8">
          <Card className="max-w-md">
            <CardHeader>
              <CardTitle>Access restricted</CardTitle>
              <CardDescription>
                This page is for providers only. Contact an admin to get provider access.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <Link to="/">Back to Home</Link>
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container mx-auto p-6 space-y-8">
        <div className="flex items-center justify-between">
          <Button variant="ghost" asChild className="pl-0 hover:bg-transparent hover:text-primary">
            <Link to="/" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
          </Button>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <Briefcase className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Provider Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {user.name}.</p>
          </div>
        </div>

        {loading ? (
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-64 mt-2" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </CardContent>
          </Card>
        ) : !profile ? (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserPlus className="w-5 h-5" />
                Set up your provider profile
              </CardTitle>
              <CardDescription>
                Create your public profile so clients can find and book you. You can edit your bio, services, and availability anytime.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isProviderEditAllowed() ? (
                <Button onClick={createProfile} disabled={creating}>
                  {creating ? 'Creating…' : 'Create my provider profile'}
                </Button>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Profile creation is only available when using the app at <strong>http://localhost:8080</strong>.
                </p>
              )}
            </CardContent>
          </Card>
        ) : (
          <>
            {/* How you appear + Edit + Availability */}
            <Card>
              <CardHeader>
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <CardTitle>Your public profile</CardTitle>
                    <CardDescription>This is how clients see you on the homepage.</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link to="/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1">
                        <ExternalLink className="w-4 h-4" />
                        View on site
                      </Link>
                    </Button>
                    {isProviderEditAllowed() && (
                      <Button size="sm" onClick={() => setEditOpen(true)} className="inline-flex items-center gap-1">
                        <Edit className="w-4 h-4" />
                        Edit profile
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="max-w-md">
                  <ProfileCard
                    professional={profile}
                    onSelect={() => setPreviewProfessional(profile)}
                  />
                </div>
                <p className="text-xs text-muted-foreground">Click the card to open your full profile preview.</p>

                {isProviderEditAllowed() ? (
                  <div className="flex items-center justify-between rounded-lg border p-4">
                    <div>
                      <Label htmlFor="provider-available">Available for sessions</Label>
                      <p className="text-xs text-muted-foreground">Turn off when you’re not taking new sessions.</p>
                    </div>
                    <Switch
                      id="provider-available"
                      checked={profile.available}
                      onCheckedChange={toggleAvailability}
                    />
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Profile editing and availability are only available at <strong>http://localhost:8080</strong>.
                  </p>
                )}
                {profile.availabilityText && (
                  <p className="text-sm text-muted-foreground">
                    Status text: <span className="font-medium text-foreground">{profile.availabilityText}</span>
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Upcoming sessions */}
            <section>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Your sessions
                {activeBookings.length > 0 && (
                  <span className="ml-2 bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full">
                    {activeBookings.length} Active
                  </span>
                )}
              </h2>
              {activeBookings.length === 0 ? (
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-muted-foreground text-center py-4">No active sessions yet.</p>
                    <p className="text-sm text-muted-foreground text-center">
                      Current sessions will appear here and expire 1 hour after the booking time.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {activeBookings.map((b) => (
                    <Card key={b._id} className="border-primary/20">
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                          <div className="space-y-1">
                            <CardTitle className="text-base">{b.serviceLabel}</CardTitle>
                            <CardDescription className="capitalize">{b.serviceType}</CardDescription>
                          </div>
                          <CountdownTimer startDate={b.date} durationMinutes={60} />
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          {b.userId && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <span className="font-medium text-foreground">Client:</span>
                              <span>{b.userId.name ?? b.userId.email ?? '—'}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>{new Date(b.date).toLocaleDateString()} · {new Date(b.date).toLocaleTimeString()}</span>
                          </div>
                        </div>

                        {b.meetLink && (
                          <Button className="w-full mt-2 group" size="sm" asChild>
                            <Link to={`/meet/${b.meetLink.split('/').pop()}`}>
                              <Video className="w-4 h-4 mr-2 group-hover:animate-pulse" />
                              Join video call
                            </Link>
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </main>

      {isProviderEditAllowed() && (
        <ProviderProfileEdit
          profile={profile}
          userId={user._id}
          open={editOpen}
          onClose={() => setEditOpen(false)}
          onSaved={() => { fetchProfile(); fetchBookings(); }}
        />
      )}

      <ProfileDetail
        professional={previewProfessional}
        open={!!previewProfessional}
        onClose={() => setPreviewProfessional(null)}
      />
    </div>
  );
}
