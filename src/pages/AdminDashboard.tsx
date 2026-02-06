import { useEffect, useState } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { ArrowLeft, Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

export default function AdminDashboard() {
    const { user } = useAuth();
    const { toast } = useToast();
    const [stats, setStats] = useState<{ users: any[], bookings: any[] }>({ users: [], bookings: [] });
    const [loading, setLoading] = useState(true);

    // Form state
    const [isaddOpen, setIsAddOpen] = useState(false);
    const [newPro, setNewPro] = useState({ name: '', email: '', title: '', bio: '', photo: '' });

    const handleAddProvider = async () => {
        try {
            const res = await fetch('/api/professionals', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newPro)
            });
            const data = await res.json();
            if (data.success) {
                toast({ title: "Success", description: "Provider added successfully" });
                setIsAddOpen(false);
                setNewPro({ name: '', email: '', title: '', bio: '', photo: '' });
                // We might want to refresh stats or redirect, but for now just close
            } else {
                toast({ title: "Error", description: data.message, variant: "destructive" });
            }
        } catch (e) {
            toast({ title: "Error", description: "Failed to add provider", variant: "destructive" });
        }
    };

    const handleRoleChange = async (userId: string, newRole: string) => {
        try {
            const res = await fetch(`/api/admin/users/${userId}/role`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ role: newRole })
            });
            const data = await res.json();
            if (data.success) {
                toast({ title: "Success", description: `User role updated to ${newRole}` });
                // Refresh stats
                const statsRes = await fetch('/api/admin/stats');
                const statsData = await statsRes.json();
                if (statsData.success) setStats(statsData);
            } else {
                toast({ title: "Error", description: data.message, variant: "destructive" });
            }
        } catch (e) {
            toast({ title: "Error", description: "Failed to update role", variant: "destructive" });
        }
    };

    const handleBanToggle = async (userId: string) => {
        try {
            const res = await fetch(`/api/admin/users/${userId}/ban`, {
                method: 'PATCH',
            });
            const data = await res.json();
            if (data.success) {
                toast({
                    title: "Success",
                    description: data.banned ? "User banned" : "User unbanned"
                });
                // Refresh stats
                const statsRes = await fetch('/api/admin/stats');
                const statsData = await statsRes.json();
                if (statsData.success) setStats(statsData);
            } else {
                toast({ title: "Error", description: data.message, variant: "destructive" });
            }
        } catch (e) {
            toast({ title: "Error", description: "Failed to update ban status", variant: "destructive" });
        }
    };

    useEffect(() => {
        // Only fetch if admin. For simplicity, we fetch and show empty/error if not authorized by backend (though backend doesn't check role yet, we guard via UI)
        if (user?.role === 'admin') {
            fetch('/api/admin/stats')
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        setStats(data);
                    }
                })
                .finally(() => setLoading(false));
        }
    }, [user]);

    if (!user || user.role !== 'admin') {
        return (
            <div className="min-h-screen flex flex-col bg-background">
                <Header />
                <main className="flex-1 flex items-center justify-center p-8">
                    <p className="text-muted-foreground">Access denied. Admins only.</p>
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

            <h1 className="text-3xl font-bold">Admin Dashboard</h1>

            <Dialog open={isaddOpen} onOpenChange={setIsAddOpen}>
                <DialogTrigger asChild>
                    <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Provider
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add New Provider</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">Name</Label>
                            <Input id="name" value={newPro.name} onChange={e => setNewPro({ ...newPro, name: e.target.value })} className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="title" className="text-right">Title</Label>
                            <Input id="title" value={newPro.title} onChange={e => setNewPro({ ...newPro, title: e.target.value })} className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="email" className="text-right">Email</Label>
                            <Input id="email" value={newPro.email} onChange={e => setNewPro({ ...newPro, email: e.target.value })} className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="photo" className="text-right">Photo URL</Label>
                            <Input id="photo" value={newPro.photo} onChange={e => setNewPro({ ...newPro, photo: e.target.value })} className="col-span-3" placeholder="https://..." />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="bio" className="text-right">Bio</Label>
                            <Textarea id="bio" value={newPro.bio} onChange={e => setNewPro({ ...newPro, bio: e.target.value })} className="col-span-3" />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button onClick={handleAddProvider}>Save Provider</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Total Users</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-4xl font-bold">{stats.users.length}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Total Bookings</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-4xl font-bold">{stats.bookings.length}</p>
                    </CardContent>
                </Card>
            </div >

            <section className="space-y-4">
                <h2 className="text-xl font-semibold">User List</h2>
                <Card>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>User</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Joined</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {stats.users.map((u: any) => (
                                <TableRow key={u._id}>
                                    <TableCell className="flex items-center gap-2">
                                        <Avatar className="h-6 w-6">
                                            <AvatarImage src={u.picture} />
                                            <AvatarFallback>{u.name?.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        {u.name}
                                    </TableCell>
                                    <TableCell>{u.email}</TableCell>
                                    <TableCell>
                                        <span className={`px-2 py-1 rounded text-xs font-medium ${u.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                                                u.role === 'provider' ? 'bg-blue-100 text-blue-800' :
                                                    'bg-gray-100 text-gray-800'
                                            }`}>
                                            {u.role}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        {u.banned ? (
                                            <span className="px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-800">Banned</span>
                                        ) : (
                                            <span className="px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">Active</span>
                                        )}
                                    </TableCell>
                                    <TableCell>{new Date(u.createdAt).toLocaleDateString()}</TableCell>
                                    <TableCell>
                                        <div className="flex gap-1">
                                            {u.role !== 'admin' && (
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => handleRoleChange(u._id, 'admin')}
                                                    disabled={u._id === user._id}
                                                >
                                                    Make Admin
                                                </Button>
                                            )}
                                            {u.role !== 'provider' && (
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => handleRoleChange(u._id, 'provider')}
                                                    disabled={u._id === user._id}
                                                >
                                                    Make Provider
                                                </Button>
                                            )}
                                            {u.role !== 'user' && (
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => handleRoleChange(u._id, 'user')}
                                                    disabled={u._id === user._id}
                                                >
                                                    Demote
                                                </Button>
                                            )}
                                            <Button
                                                size="sm"
                                                variant={u.banned ? "default" : "destructive"}
                                                onClick={() => handleBanToggle(u._id)}
                                                disabled={u._id === user._id}
                                            >
                                                {u.banned ? 'Unban' : 'Ban'}
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Card>
            </section>

            <section className="space-y-4">
                <h2 className="text-xl font-semibold">Recent Bookings</h2>
                <Card>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>ID</TableHead>
                                <TableHead>Service</TableHead>
                                <TableHead>User</TableHead>
                                <TableHead>Link</TableHead>
                                <TableHead>Date</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {stats.bookings.map((b: any) => (
                                <TableRow key={b._id}>
                                    <TableCell className="font-mono text-xs">{b.bookingId.slice(0, 8)}...</TableCell>
                                    <TableCell>{b.serviceLabel} ({b.serviceType})</TableCell>
                                    <TableCell>{b.userId?.email || 'Unknown'}</TableCell>
                                    <TableCell>{b.meetLink ? 'Yes' : 'No'}</TableCell>
                                    <TableCell>{new Date(b.date).toLocaleDateString()}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Card>
            </section>
            </main>
        </div>
    );
}
