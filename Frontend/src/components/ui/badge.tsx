import { cva, type VariantProps } from "class-variance-authority"
import * as React from "react"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary/12 text-primary hover:bg-primary/18",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive/12 text-destructive hover:bg-destructive/18",
        outline: "border-border bg-background/80 text-foreground",
        warning:
          "border-transparent bg-[hsl(var(--warning)/0.18)] text-[hsl(var(--warning-foreground))]",
        info: "border-transparent bg-[hsl(var(--info)/0.14)] text-[hsl(var(--info-foreground))]",
        success:
          "border-transparent bg-[hsl(var(--success)/0.14)] text-[hsl(var(--success-foreground))]",
        premium:
          "border-transparent bg-primary/15 text-primary font-black",
        indigo:
          "border-transparent bg-indigo-500/15 text-indigo-500 font-bold",
        neutral:
          "border-transparent bg-muted text-muted-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
