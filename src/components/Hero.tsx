import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface HeroProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export function Hero({ searchQuery, onSearchChange }: HeroProps) {
  return (
    <section className="px-4 pt-8 pb-6 md:pt-16 md:pb-10">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground tracking-tight text-balance">
          Find trusted professionals, instantly
        </h1>
        <p className="mt-4 text-base md:text-lg text-muted-foreground max-w-lg mx-auto">
          Connect with verified experts. Book appointments, call, or chat — all in one place.
        </p>
        
        <div className="mt-8 relative max-w-md mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search by name or specialty..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-12 pr-4 h-12 text-base bg-card border-border rounded-xl shadow-sm focus-visible:ring-primary/20 focus-visible:ring-offset-0"
          />
        </div>
      </div>
    </section>
  );
}
