"use client";

import { EmptyState } from "@/components/ui/empty-state";
import { QuickActionButton } from "@/components/ui/QuickActionButton";
import { timeAgo } from "@/lib/utils/date";
import { ReceptionExtraProps } from "@/types";
import { ChevronRight, UserCheck, UserPlus, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { PatientRegisterDialog } from "../../../patients/_components/PatientRegisterDialog";
import { SectionHeader } from "../layout/SectionHeader";

export function ReceptionExtra({ recentPatients }: ReceptionExtraProps) {
  const router = useRouter();
  const latestPatient = recentPatients[0] ?? null;

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <div className="lg:col-span-2 flex flex-col rounded-2xl border border-border bg-card p-5 shadow-sm">
        <SectionHeader title="Recently Registered Patients" linkLabel="All Patients" href="/patients" router={router} />
        {recentPatients.length === 0 ? (
          <EmptyState
            icon={Users}
            title="No recent registrations"
            description="Newly created patient records will show here to help the front desk track the latest arrivals."
            actionLabel="Open patients"
            onAction={() => router.push("/patients")}
            compact
            className="mt-2"
          />
        ) : (
          <div className="space-y-1.5">
            {recentPatients.map((patient) => (
              <button
                key={patient.id}
                onClick={() => router.push(`/patients/${patient.id}`)}
                className="group/row flex w-full items-center gap-3 rounded-xl border border-transparent px-3 py-2.5 text-left transition-colors hover:border-border/50 hover:bg-muted/50"
              >
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-primary/20 bg-gradient-to-br from-primary/20 to-primary/5">
                  <span className="text-xs font-semibold text-primary">
                    {patient.name
                      .split(" ")
                      .map((s) => s[0])
                      .join("")
                      .slice(0, 2)}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate text-sm font-medium text-foreground">{patient.name}</span>
                    <span className="shrink-0 rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                      {timeAgo(patient.createdTimestamp)}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {patient.phone} · Age {patient.age}
                  </p>
                </div>
                <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground/30 transition-all group-hover/row:text-primary" />
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
            <PatientRegisterDialog
              trigger={
                <QuickActionButton
                  icon={UserPlus}
                  label="Register Patient"
                  description="Add a new patient to the system"
                  onClick={() => {}}
                  color="text-primary"
                  bg="bg-primary/10"
                />
              }
            />
            <QuickActionButton
              icon={Users}
              label="Patient Directory"
              description="Browse and search all patients"
              onClick={() => router.push("/patients")}
              color="text-emerald-600"
              bg="bg-emerald-500/10"
            />
            <QuickActionButton
              icon={UserCheck}
              label="Last Registered"
              description={latestPatient ? `Open ${latestPatient.name}` : "No patients registered yet"}
              onClick={() => latestPatient && router.push(`/patients/${latestPatient.id}`)}
              disabled={!latestPatient}
              color="text-violet-600"
              bg="bg-violet-500/10"
            />
          </div>
        </div>

        <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4">
          <p className="text-sm font-semibold text-primary">
            {recentPatients.length} recent registrations
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Newly added patients from the live directory
          </p>
        </div>
      </div>
    </div>
  );
}
