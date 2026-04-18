"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PatientSummaryProps } from "@/types";

export function PatientSummary({ summary, summaryLoading }: PatientSummaryProps) {
  if (!summary && !summaryLoading) return null;

  return (
    <Card>
      <CardHeader className="space-y-2">
        <CardTitle className="text-2xl">Clinical summary</CardTitle>
        <CardDescription>
          A quick view of the patient narrative and current assessment.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {summaryLoading ? (
          <div className="grid gap-3 md:grid-cols-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="rounded-[var(--radius-md)] border border-border/70 bg-muted/30 p-4"
              >
                <div className="h-3 w-28 rounded bg-muted" />
                <div className="mt-3 h-4 w-full rounded bg-muted" />
                <div className="mt-2 h-4 w-5/6 rounded bg-muted" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            <div className="rounded-[var(--radius-md)] border border-border/70 bg-muted/24 p-4">
              <p className="field-label">Chief Complaint</p>
              <p className="mt-2 text-sm leading-6 text-foreground">
                {summary?.chiefComplaint}
              </p>
            </div>
            <div className="rounded-[var(--radius-md)] border border-border/70 bg-muted/24 p-4">
              <p className="field-label">Past Medical History</p>
              <p className="mt-2 text-sm leading-6 text-foreground">
                {summary?.pastMedicalHistory}
              </p>
            </div>
            <div className="rounded-[var(--radius-md)] border border-border/70 bg-muted/24 p-4">
              <p className="field-label">Recent Developments</p>
              <p className="mt-2 text-sm leading-6 text-foreground">
                {summary?.recentDevelopments}
              </p>
            </div>
            <div className="rounded-[var(--radius-md)] border border-border/70 bg-muted/24 p-4">
              <p className="field-label">Current Assessment</p>
              <p className="mt-2 text-sm leading-6 text-foreground">
                {summary?.currentAssessment}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
