"use client";

import { EmptyState } from "@/components/ui/empty-state";
import { QuickActionButton } from "@/components/ui/QuickActionButton";
import { timeAgo } from "@/lib/utils/date";
import { NurseExtraProps } from "@/types";
import { Activity, FlaskConical, Pill, UserPlus, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { PatientRegisterDialog } from "../../../patients/_components/PatientRegisterDialog";
import { SectionHeader } from "../layout/SectionHeader";

export function NurseExtra({ vitals, patients }: NurseExtraProps) {
  const router = useRouter();

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <div className="lg:col-span-2 flex flex-col rounded-2xl border border-border bg-card p-5 shadow-sm">
        <SectionHeader
          title="Recent Vitals Recorded"
          linkLabel="All Patients"
          href="/patients"
          router={router}
        />
        {vitals.length === 0 ? (
          <EmptyState
            icon={Activity}
            title="No vitals recorded yet"
            description="Once bedside observations are entered, the latest vitals timeline will show up in this panel."
            actionLabel="Open patients"
            onAction={() => router.push("/patients")}
            compact
            className="mt-2"
          />
        ) : (
          <div className="space-y-1.5">
            {vitals.map((entry) => {
              const patient = patients.find((p) => p.id === entry.patientId);
              return (
                <button
                  key={entry.id}
                  onClick={() => router.push(`/patients/${entry.patientId}`)}
                  className="group/row flex w-full items-start gap-3 rounded-xl border border-transparent px-3 py-2.5 text-left transition-colors hover:border-border/50 hover:bg-muted/50"
                >
                  <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-rose-500/10 text-rose-500">
                    <Activity className="h-3.5 w-3.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="truncate text-sm font-medium text-foreground">
                        {patient?.name ?? entry.patientId}
                      </span>
                      <span className="shrink-0 rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                        {timeAgo(entry.createdDt)}
                      </span>
                    </div>
                    <p className="mt-0.5 truncate text-xs text-muted-foreground">{entry.comments}</p>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-3">
        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
          <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
            Quick Actions
          </p>
          <div className="space-y-2">
            <PatientRegisterDialog
              trigger={
                <QuickActionButton
                  icon={UserPlus}
                  label="Register Patient"
                  description="Add a new patient to the system"
                  onClick={() => {}}
                  color="text-rose-500"
                  bg="bg-rose-500/10"
                />
              }
            />
            <QuickActionButton
              icon={Users}
              label="Patient Directory"
              description="Browse all patient records"
              onClick={() => router.push("/patients")}
              color="text-primary"
              bg="bg-primary/10"
            />
            <QuickActionButton
              icon={Pill}
              label="Medications"
              description="Check active medication orders"
              onClick={() => router.push("/prescriptions")}
              color="text-emerald-600"
              bg="bg-emerald-500/10"
            />
            <QuickActionButton
              icon={FlaskConical}
              label="Lab Results"
              description="View and upload diagnostics"
              onClick={() => router.push("/labs")}
              color="text-violet-600"
              bg="bg-violet-500/10"
            />
          </div>
        </div>

        <div className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-4">
          <p className="text-sm font-semibold text-rose-700 dark:text-rose-400">
            {vitals.length} vitals recorded
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Latest bedside observations from the live chart feed
          </p>
        </div>
      </div>
    </div>
  );
}
