"use client";

import { DashboardHeroProps } from "@/types";
import { StatsGrid } from "./StatsGrid";

export function DashboardHero({ highlights, stats }: DashboardHeroProps) {
  return (
    <div className="min-w-0">
      <p className="page-kicker">Daily Command Center</p>
      <h2 className="section-title mt-2">Clinical operations at a glance</h2>
      <p className="section-subtitle mt-2 max-w-2xl">
        A single command surface for patient flow, live chart activity,
        medication status, and care coordination.
      </p>

      <div className="mt-4 flex flex-wrap gap-2.5">
        {highlights.map((item) => (
          <span
            key={item}
            className="rounded-full border border-border/80 bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground"
          >
            {item}
          </span>
        ))}
      </div>

      <div className="mt-4">
        <StatsGrid stats={stats} />
      </div>
    </div>
  );
}
