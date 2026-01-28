import { BadgeCheck, Star, ChevronRight } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { Professional } from "@/lib/data";
import { formatPrice } from "@/lib/data";

interface ProfileCardProps {
  professional: Professional;
  onSelect: (professional: Professional) => void;
}

export function ProfileCard({ professional, onSelect }: ProfileCardProps) {
  const lowestPrice = professional.services.reduce((min, service) => {
    if (service.price === null) return min === Infinity ? 0 : min;
    return Math.min(min, service.price);
  }, Infinity);

  const priceDisplay = lowestPrice === 0 ? "Free options" : lowestPrice === Infinity ? "Contact for pricing" : `From $${lowestPrice}`;

  return (
    <article 
      className="bg-card rounded-2xl border border-border p-5 transition-all duration-200 hover:shadow-lg hover:shadow-primary/5 hover:border-primary/30 group cursor-pointer relative overflow-hidden"
      onClick={() => onSelect(professional)}
    >
      {/* Subtle hover indicator */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
      
      <div className="relative flex items-start gap-4">
        <div className="relative shrink-0">
          <img
            src={professional.photo}
            alt={professional.name}
            className="w-16 h-16 md:w-20 md:h-20 rounded-2xl object-cover ring-2 ring-border group-hover:ring-primary/30 transition-all"
          />
          {professional.verified && (
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="absolute -bottom-1 -right-1 bg-primary rounded-full p-1 shadow-sm">
                  <BadgeCheck className="w-4 h-4 text-primary-foreground" />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-sm">Identity and credentials verified</p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-foreground truncate">
              {professional.name}
            </h3>
          </div>
          
          <p className="mt-1 text-sm text-muted-foreground line-clamp-1">
            {professional.title}
          </p>
          
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-primary fill-primary" />
              <span className="text-sm font-medium">{professional.rating}</span>
              <span className="text-sm text-muted-foreground">
                ({professional.reviewCount})
              </span>
            </div>
            
            <span className="text-muted-foreground">·</span>
            
            <span
              className={cn(
                "text-xs font-medium px-2 py-1 rounded-full",
                professional.available
                  ? "bg-success/10 text-success"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {professional.availabilityText}
            </span>
          </div>
        </div>
      </div>
      
      {/* Specialties */}
      <div className="relative mt-4 flex flex-wrap gap-1.5">
        {professional.specialties.slice(0, 3).map((specialty) => (
          <span 
            key={specialty}
            className="text-xs px-2 py-1 bg-accent text-accent-foreground rounded-md"
          >
            {specialty}
          </span>
        ))}
        {professional.specialties.length > 3 && (
          <span className="text-xs px-2 py-1 text-muted-foreground">
            +{professional.specialties.length - 3} more
          </span>
        )}
      </div>
      
      {/* Price & CTA */}
      <div className="relative mt-4 pt-4 border-t border-border flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-foreground">{priceDisplay}</p>
          <p className="text-xs text-muted-foreground">
            {professional.services.length} service{professional.services.length > 1 ? "s" : ""} available
          </p>
        </div>
        
        <div className="flex items-center gap-1 text-primary font-medium text-sm group-hover:gap-2 transition-all">
          View profile
          <ChevronRight className="w-4 h-4" />
        </div>
      </div>
    </article>
  );
}
