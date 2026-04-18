import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
  compact?: boolean;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  className,
  compact = false,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-[calc(var(--radius)+2px)] border border-dashed border-border/80 bg-[radial-gradient(circle_at_top,hsl(var(--primary)/0.08),transparent_48%),hsl(var(--muted)/0.35)] text-center",
        compact ? "min-h-40 px-5 py-8" : "min-h-56 px-6 py-10",
        className,
      )}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-border/70 bg-background/90 text-primary shadow-sm">
        <Icon className="h-5 w-5" />
      </div>
      <div className="mt-4 max-w-md space-y-1.5">
        <p className="text-base font-semibold tracking-tight text-foreground">{title}</p>
        <p className="text-sm leading-6 text-muted-foreground">{description}</p>
      </div>
      {actionLabel && onAction && (
        <Button variant="outline" className="mt-5" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
