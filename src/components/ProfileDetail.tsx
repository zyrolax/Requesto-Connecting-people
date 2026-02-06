import { BadgeCheck, Star, Phone, MessageCircle, Mail, X, Globe, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { Professional, ServicePricing } from "@/lib/data";
import { formatPrice } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { useAuth } from "@/components/AuthProvider";

interface ProfileDetailProps {
  professional: Professional | null;
  open: boolean;
  onClose: () => void;
}

function ServiceIcon({ type }: { type: ServicePricing["type"] }) {
  switch (type) {
    case "call":
      return <Phone className="w-5 h-5" />;
    case "chat":
      return <MessageCircle className="w-5 h-5" />;
    case "email":
      return <Mail className="w-5 h-5" />;
  }
}

function ServiceCard({ service, professionalName, professionalId }: { service: ServicePricing, professionalName: string, professionalId: string }) {
  const isFree = service.price === null;
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const { user, login } = useAuth();

  const handleBook = async () => {
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to book a session.",
        variant: "destructive",
      });
      login();
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/book-service', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          professionalId,
          serviceType: service.type,
          serviceLabel: service.label,
          userId: user._id
        }),
      });

      const data = await response.json();

      if (data.details?.link) {
        toast({
          title: "Booking Confirmed!",
          description: `Meeting Link: ${data.details.link}`,
          action: (
            <a
              href={data.details.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium ring-offset-background transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 group-[.toast]:bg-primary group-[.toast]:text-primary-foreground group-[.toast]:hover:bg-primary/90"
            >
              Join
            </a>
          ),
        });
      } else {
        toast({
          title: "Booking Confirmed!",
          description: `You have successfully booked a ${service.label} with ${professionalName}.`,
        });
      }
    } catch (error) {
      toast({
        title: "Booking Failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleBook}
      disabled={loading}
      className="w-full p-4 rounded-xl border border-border bg-card hover:border-primary/40 hover:bg-accent/50 transition-all text-left group disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <div className="flex items-start gap-4">
        <div className={cn(
          "w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-colors",
          isFree
            ? "bg-success/10 text-success group-hover:bg-success/20"
            : "bg-primary/10 text-primary group-hover:bg-primary/20"
        )}>
          <ServiceIcon type={service.type} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h4 className="font-medium text-foreground">{service.label}</h4>
            <span className={cn(
              "text-sm font-semibold shrink-0",
              isFree ? "text-success" : "text-foreground"
            )}>
              {formatPrice(service.price)}
            </span>
          </div>
          {service.duration && (
            <p className="mt-1 text-sm text-muted-foreground flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {service.duration}
            </p>
          )}
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-border">
        <span className="text-sm font-medium text-primary group-hover:underline">
          {loading ? 'Booking...' : 'Book this service →'}
        </span>
      </div>
    </button>
  );
}

export function ProfileDetail({ professional, open, onClose }: ProfileDetailProps) {
  if (!professional) return null;

  return (
    <Sheet open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto p-0">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-card border-b border-border p-4 flex items-center justify-between">
          <SheetTitle className="sr-only">{professional.name} Profile</SheetTitle>
          <span className="text-sm font-medium text-muted-foreground">Profile</span>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="p-6">
          {/* Profile Header */}
          <div className="flex flex-col items-center text-center">
            <div className="relative">
              <img
                src={professional.photo}
                alt={professional.name}
                className="w-24 h-24 rounded-2xl object-cover ring-4 ring-background shadow-lg"
              />
              {professional.verified && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="absolute -bottom-2 -right-2 bg-primary rounded-full p-1.5 shadow-md">
                      <BadgeCheck className="w-5 h-5 text-primary-foreground" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-sm">Identity and credentials verified</p>
                  </TooltipContent>
                </Tooltip>
              )}
            </div>

            <h2 className="mt-4 text-xl font-semibold text-foreground">
              {professional.name}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {professional.title}
            </p>

            <div className="mt-3 flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-primary fill-primary" />
                <span className="text-sm font-medium">{professional.rating}</span>
                <span className="text-sm text-muted-foreground">
                  ({professional.reviewCount} reviews)
                </span>
              </div>

              <span
                className={cn(
                  "text-xs font-medium px-2.5 py-1 rounded-full",
                  professional.available
                    ? "bg-success/10 text-success"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {professional.availabilityText}
              </span>
            </div>
          </div>

          {/* Bio */}
          <div className="mt-6">
            <h3 className="text-sm font-medium text-foreground mb-2">About</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {professional.bio}
            </p>
          </div>

          {/* Specialties */}
          <div className="mt-6">
            <h3 className="text-sm font-medium text-foreground mb-2">Specialties</h3>
            <div className="flex flex-wrap gap-2">
              {professional.specialties.map((specialty) => (
                <span
                  key={specialty}
                  className="text-sm px-3 py-1.5 bg-accent text-accent-foreground rounded-lg"
                >
                  {specialty}
                </span>
              ))}
            </div>
          </div>

          {/* Languages */}
          <div className="mt-6">
            <h3 className="text-sm font-medium text-foreground mb-2">Languages</h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Globe className="w-4 h-4" />
              {professional.languages.join(", ")}
            </div>
          </div>

          {/* Services */}
          <div className="mt-8">
            <h3 className="text-sm font-medium text-foreground mb-3">
              Book a Service
            </h3>
            <div className="space-y-3">
              {professional.services.map((service) => (
                <ServiceCard
                  key={service.type}
                  service={service}
                  professionalName={professional.name}
                  professionalId={professional.id}
                />
              ))}
            </div>
          </div>

          {/* Trust indicator */}
          <div className="mt-8 p-4 bg-muted/50 rounded-xl">
            <p className="text-xs text-muted-foreground text-center">
              {professional.verified
                ? "✓ This professional has been verified by our team. Their identity and credentials have been confirmed."
                : "This professional's verification is pending. Exercise due diligence before booking."}
            </p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
