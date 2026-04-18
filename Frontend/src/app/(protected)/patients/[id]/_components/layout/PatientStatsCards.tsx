"use client";

import { Card, CardContent } from "@/components/ui/card";
import { PatientStatsCardsProps } from "@/types";
import { Activity, FileText, Receipt } from "lucide-react";

export function PatientStatsCards({
  charts,
  prescriptions,
  invoices,
}: PatientStatsCardsProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-3">
      <Card>
        <CardContent className="flex items-center gap-3 p-4">
          <div className="rounded-full bg-primary/12 p-3 text-primary">
            <Activity className="h-5 w-5" />
          </div>
          <div>
            <p className="field-label">Timeline Entries</p>
            <p className="text-2xl font-semibold text-foreground leading-none">
              {charts.length}
            </p>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="flex items-center gap-3 p-4">
          <div className="rounded-full bg-emerald-500/15 p-3 text-emerald-600 dark:text-emerald-400">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <p className="field-label">Active Prescriptions</p>
            <p className="text-2xl font-semibold text-foreground leading-none">
              {prescriptions.filter((p) => p.status === "active").length}
            </p>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="flex items-center gap-3 p-4">
          <div className="rounded-full bg-primary/10 p-3 text-primary">
            <Receipt className="h-5 w-5" />
          </div>
          <div>
            <p className="field-label">Invoices</p>
            <p className="text-2xl font-semibold text-foreground leading-none">
              {invoices.length}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
