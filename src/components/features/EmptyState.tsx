import { Search } from "lucide-react";

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
        <Search className="w-7 h-7 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-medium text-foreground">No professionals found</h3>
      <p className="mt-2 text-muted-foreground max-w-sm">
        Try adjusting your filters or search terms to find what you're looking for.
      </p>
    </div>
  );
}
