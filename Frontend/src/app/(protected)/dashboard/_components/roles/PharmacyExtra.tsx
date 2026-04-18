"use client";

import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { QuickActionButton } from "@/components/ui/QuickActionButton";
import { PharmacyExtraProps } from "@/types";
import { Pill, User, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { SectionHeader } from "../layout/SectionHeader";

export function PharmacyExtra({ prescriptions }: PharmacyExtraProps) {
  const router = useRouter();
  const active = prescriptions.filter((item) => item.status === "active").slice(0, 6);
  const priorityPatient = active[0] ?? null;

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <div className="lg:col-span-2 flex flex-col rounded-2xl border border-border bg-card p-5 shadow-sm">
        <SectionHeader
          title="Active Prescriptions"
          linkLabel="All Prescriptions"
          href="/prescriptions"
          router={router}
        />
        {active.length === 0 ? (
          <EmptyState
            icon={Pill}
            title="No active prescriptions"
            description="Medication orders will appear here when clinicians start prescribing through the patient workflow."
            actionLabel="Open prescriptions"
            onAction={() => router.push("/prescriptions")}
            compact
            className="mt-2"
          />
        ) : (
          <div className="space-y-1.5">
            {active.map((prescription) => (
              <button
                key={prescription.id}
                onClick={() => router.push(`/patients/${prescription.patientId}`)}
                className="group/row flex w-full items-center gap-3 rounded-xl border border-transparent px-3 py-2.5 text-left transition-colors hover:border-border/50 hover:bg-muted/50"
              >
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600">
                  <Pill className="h-3.5 w-3.5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="truncate text-sm font-medium text-foreground">
                      {prescription.medication}
                    </span>
                    <span className="shrink-0 rounded bg-muted px-1.5 py-0.5 text-xs font-mono text-muted-foreground">
                      {prescription.dosage} · {prescription.frequency}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {prescription.patientName} · {prescription.prescribedBy}
                  </p>
                </div>
                <Badge
                  variant="outline"
                  className="shrink-0 border-emerald-500/30 bg-emerald-500/5 text-xs text-emerald-600"
                >
                  Active
                </Badge>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-3">
        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
          <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
            Quick Actions
          </p>
          <div className="space-y-2">
            <QuickActionButton
              icon={Pill}
              label="Prescription Queue"
              description="View all active medication orders"
              onClick={() => router.push("/prescriptions")}
              color="text-emerald-600"
              bg="bg-emerald-500/10"
            />
            <QuickActionButton
              icon={Users}
              label="Patient Lookup"
              description="Search and browse patient records"
              onClick={() => router.push("/patients")}
              color="text-primary"
              bg="bg-primary/10"
            />
            <QuickActionButton
              icon={User}
              label="Priority Patient"
              description={priorityPatient ? `Open ${priorityPatient.patientName}` : "No active prescriptions"}
              onClick={() => priorityPatient && router.push(`/patients/${priorityPatient.patientId}`)}
              disabled={!priorityPatient}
              color="text-violet-600"
              bg="bg-violet-500/10"
            />
          </div>
        </div>

        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4">
          <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
            {active.length} active prescriptions
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Medication queue pulled from live patient prescriptions
          </p>
        </div>
      </div>
    </div>
  );
}
