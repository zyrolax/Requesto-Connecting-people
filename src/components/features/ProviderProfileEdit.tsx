import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import type { Professional, ServicePricing } from "@/lib/data";

interface ProviderProfileEditProps {
  profile: Professional | null;
  userId: string; // logged-in provider's user _id for PATCH
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
}

const SERVICE_TYPES: ServicePricing["type"][] = ["call", "chat", "email"];
const DEFAULT_LABELS: Record<ServicePricing["type"], string> = {
  call: "Video Call",
  chat: "Chat",
  email: "Email",
};

export function ProviderProfileEdit({ profile, userId, open, onClose, onSaved }: ProviderProfileEditProps) {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    title: "",
    bio: "",
    photo: "",
    available: true,
    availabilityText: "Available",
    specialties: "" as string,
    languages: "" as string,
    services: [] as ServicePricing[],
  });

  useEffect(() => {
    if (!profile) return;
    setForm({
      name: profile.name ?? "",
      title: profile.title ?? "",
      bio: profile.bio ?? "",
      photo: profile.photo ?? "",
      available: profile.available ?? true,
      availabilityText: profile.availabilityText ?? "Available",
      specialties: (profile.specialties ?? []).join(", "),
      languages: (profile.languages ?? []).join(", "),
      services: Array.isArray(profile.services) && profile.services.length
        ? profile.services.map((s) => ({
          type: s.type,
          label: s.label ?? DEFAULT_LABELS[s.type],
          price: s.price ?? null,
          duration: s.duration ?? "",
        }))
        : [
          { type: "call" as const, label: "Video Call", price: null, duration: "60 min" },
          { type: "chat" as const, label: "Chat", price: null, duration: "30 min" },
          { type: "email" as const, label: "Email", price: null, duration: "24h" },
        ],
    });
  }, [profile, open]);

  const handleSave = async () => {
    if (!userId) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/provider/profile/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim() || undefined,
          title: form.title.trim() || undefined,
          bio: form.bio.trim() || undefined,
          photo: form.photo.trim() || undefined,
          available: form.available,
          availabilityText: form.availabilityText.trim() || "Available",
          specialties: form.specialties
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
          languages: form.languages
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
          services: form.services,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to save");
      }
      toast({ title: "Profile updated", description: "Your provider profile has been saved." });
      onSaved();
      onClose();
    } catch (e) {
      toast({
        title: "Save failed",
        description: e instanceof Error ? e.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const updateService = (index: number, field: keyof ServicePricing, value: string | number | null) => {
    const next = [...form.services];
    if (!next[index]) return;
    (next[index] as Record<string, unknown>)[field] = value;
    setForm({ ...form, services: next });
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit provider profile</DialogTitle>
          <DialogDescription>
            This is how clients see you on the homepage. Keep your bio and services up to date.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Display name</Label>
            <Input
              id="name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Your name"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="title">Title / tagline</Label>
            <Input
              id="title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. Career Coach · 10 years experience"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              placeholder="A short intro for clients"
              rows={3}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="photo">Photo URL</Label>
            <Input
              id="photo"
              type="url"
              value={form.photo}
              onChange={(e) => setForm({ ...form, photo: e.target.value })}
              placeholder="https://..."
            />
          </div>

          <div className="flex items-center justify-between rounded-lg border p-4">
            <div>
              <Label htmlFor="available">Available for sessions</Label>
              <p className="text-xs text-muted-foreground">When off, you won’t appear as available to clients.</p>
            </div>
            <Switch
              id="available"
              checked={form.available}
              onCheckedChange={(v) => setForm({ ...form, available: v })}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="availabilityText">Availability text</Label>
            <Input
              id="availabilityText"
              value={form.availabilityText}
              onChange={(e) => setForm({ ...form, availabilityText: e.target.value })}
              placeholder="e.g. Available today / Next slot 2pm"
            />
          </div>

          <div className="grid gap-2">
            <Label>Specialties (comma-separated)</Label>
            <Input
              value={form.specialties}
              onChange={(e) => setForm({ ...form, specialties: e.target.value })}
              placeholder="e.g. Anxiety, CBT, Career"
            />
          </div>
          <div className="grid gap-2">
            <Label>Languages (comma-separated)</Label>
            <Input
              value={form.languages}
              onChange={(e) => setForm({ ...form, languages: e.target.value })}
              placeholder="e.g. English, Hindi"
            />
          </div>

          <div className="space-y-2">
            <Label>Services & pricing</Label>
            {form.services.map((svc, i) => (
              <div key={i} className="flex flex-wrap items-center gap-2 rounded border p-2">
                <Input
                  className="flex-1 min-w-[100px]"
                  placeholder="Label"
                  value={svc.label}
                  onChange={(e) => updateService(i, "label", e.target.value)}
                />
                <Input
                  className="w-24"
                  type="number"
                  placeholder="₹ or 0"
                  value={svc.price ?? ""}
                  onChange={(e) =>
                    updateService(i, "price", e.target.value === "" ? null : Number(e.target.value))
                  }
                />
                <Input
                  className="w-28"
                  placeholder="Duration"
                  value={svc.duration ?? ""}
                  onChange={(e) => updateService(i, "duration", e.target.value)}
                />
              </div>
            ))}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Saving…" : "Save profile"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
