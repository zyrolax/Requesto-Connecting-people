import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface FilterBarProps {
  showVerifiedOnly: boolean;
  showAvailableOnly: boolean;
  onVerifiedToggle: () => void;
  onAvailableToggle: () => void;
}

export function FilterBar({
  showVerifiedOnly,
  showAvailableOnly,
  onVerifiedToggle,
  onAvailableToggle,
}: FilterBarProps) {
  return (
    <div className="flex items-center gap-2 px-4 py-3 overflow-x-auto scrollbar-hide">
      <span className="text-sm text-muted-foreground shrink-0">Filter:</span>
      <button
        onClick={onVerifiedToggle}
        className={cn(
          "px-4 py-2 rounded-full text-sm font-medium transition-colors shrink-0",
          showVerifiedOnly
            ? "bg-primary text-primary-foreground"
            : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
        )}
      >
        Verified only
      </button>
      <button
        onClick={onAvailableToggle}
        className={cn(
          "px-4 py-2 rounded-full text-sm font-medium transition-colors shrink-0",
          showAvailableOnly
            ? "bg-primary text-primary-foreground"
            : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
        )}
      >
        Available now
      </button>
    </div>
  );
}
