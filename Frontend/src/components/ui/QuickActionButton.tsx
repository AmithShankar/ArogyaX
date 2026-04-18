"use client";

import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";

export function QuickActionButton({
  icon: Icon,
  label,
  description,
  onClick,
  color = "text-primary",
  bg = "bg-primary/10",
  disabled = false,
  className,
}: {
  icon: React.ElementType;
  label: string;
  description?: string;
  onClick: () => void;
  color?: string;
  bg?: string;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "group flex w-full items-center gap-3 rounded-xl border border-border/60 bg-muted/20 px-3.5 py-2.5 text-left",
        "transition-all hover:border-border hover:bg-muted/50 hover:shadow-sm",
        "disabled:pointer-events-none disabled:opacity-40",
        className,
      )}
    >
      <div
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-transform group-hover:scale-105",
          bg,
          color,
        )}
      >
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold leading-tight text-foreground">{label}</p>
        {description && (
          <p className="mt-0.5 truncate text-xs text-muted-foreground">{description}</p>
        )}
      </div>
      <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground/30 transition-all group-hover:translate-x-0.5 group-hover:text-muted-foreground/60" />
    </button>
  );
}
