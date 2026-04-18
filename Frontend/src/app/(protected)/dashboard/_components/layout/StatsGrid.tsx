import { Card, CardContent } from "@/components/ui/card";

import { StatsGridProps } from "@/types";

export function StatsGrid({ stats }: StatsGridProps) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-2">
      {stats.map((stat, index) => (
        <Card
          key={stat.label}
          className="animate-scale-in overflow-hidden border-border/80 bg-card/95"
          style={{ animationDelay: `${index * 75}ms` }}
        >
          <CardContent className="flex items-start gap-3 p-4">
            <div className={`rounded-2xl border border-border/75 bg-muted/55 p-3.5 ${stat.color}`}>
              <stat.icon className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    Snapshot
                  </p>
                  <p className="mt-2 text-[2rem] font-semibold leading-none text-foreground">
                    {stat.value}
                  </p>
                </div>
                <div className="hidden rounded-full border border-border/70 bg-background px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground md:block">
                  Live
                </div>
              </div>
              <p className="mt-2 text-sm font-medium text-muted-foreground">{stat.label}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
