"use client";

import { WorkflowPulseProps } from "@/types";


export function WorkflowPulse({ chartsCount, labsCount, revenue }: WorkflowPulseProps) {
  return (
    <div className="rounded-[calc(var(--radius)+2px)] border border-border/85 bg-background/70 p-3 shadow-sm">
      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-primary/80">
        Workflow Pulse
      </p>
      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
        <div className="rounded-2xl border border-border/75 bg-card px-3 py-3">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            Charts
          </p>
          <p className="mt-2 text-xl font-semibold text-foreground">
            {chartsCount}
          </p>
        </div>
        <div className="rounded-2xl border border-border/75 bg-card px-3 py-3">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            Labs
          </p>
          <p className="mt-2 text-xl font-semibold text-foreground">
            {labsCount}
          </p>
        </div>
        {revenue !== undefined && (
          <div className="rounded-2xl border border-border/75 bg-card px-3 py-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              Revenue
            </p>
            <p className="mt-2 text-xl font-semibold text-foreground">
              {revenue}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
