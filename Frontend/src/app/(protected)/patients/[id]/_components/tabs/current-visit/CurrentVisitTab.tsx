"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { CurrentVisitTabProps } from "@/types";
import { Activity } from "lucide-react";
import { typeBadgeVariant } from "../../../_utils/patient-constants";

export function CurrentVisitTab({ charts }: CurrentVisitTabProps) {
  const sortedCharts = [...charts].sort(
    (left, right) => new Date(right.createdDt).getTime() - new Date(left.createdDt).getTime()
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Current visit</CardTitle>
        <CardDescription>
          The latest documented notes and observations for this patient.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0 md:p-0">
        {sortedCharts.length > 0 ? (
          <div className="space-y-0">
            {sortedCharts.slice(0, 3).map((entry) => (
              <div
                key={entry.id}
                className="border-b border-border/70 bg-muted/10 p-4 last:border-0"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-medium text-foreground">
                    {entry.userName}
                  </p>
                  <Badge variant={typeBadgeVariant(entry.type) as never}>
                    {entry.type}
                  </Badge>
                </div>
                <p className="mt-3 text-sm leading-6 text-foreground">
                  {entry.comments}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Activity}
            title="No current visit data"
            description="The latest clinical note or observation will appear here after the next documented encounter."
            compact
            className="min-h-40 border-0 bg-transparent"
          />
        )}
      </CardContent>
    </Card>
  );
}
