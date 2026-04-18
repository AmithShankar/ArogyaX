"use client";

import { EmptyState } from "@/components/ui/empty-state";
import { QuickActionButton } from "@/components/ui/QuickActionButton";
import { getChartTypeColor, getChartTypeIcon } from "@/features/charts/chart.utils";
import { timeAgo } from "@/lib/utils/date";
import { DoctorExtraProps } from "@/types";
import { FileText, FlaskConical, Pill, UserPlus, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { PatientRegisterDialog } from "../../../patients/_components/PatientRegisterDialog";
import { SectionHeader } from "../layout/SectionHeader";

export function DoctorExtra({ recentCharts, patients }: DoctorExtraProps) {
  const router = useRouter();

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <div className="lg:col-span-2 flex flex-col rounded-2xl border border-border bg-card p-5 shadow-sm">
        <SectionHeader
          title="Recent Clinical Activity"
          linkLabel="All Patients"
          href="/patients"
          router={router}
        />
        {recentCharts.length === 0 ? (
          <EmptyState
            icon={FileText}
            title="No chart activity yet"
            description="Recent chart notes, visits, and vitals will appear here after the first patient records are documented."
            actionLabel="Open patients"
            onAction={() => router.push("/patients")}
            compact
            className="mt-2"
          />
        ) : (
          <div className="space-y-1.5">
            {recentCharts.map((entry) => {
              const Icon = getChartTypeIcon(entry.type);
              const patient = patients.find((p) => p.id === entry.patientId);
              return (
                <button
                  key={entry.id}
                  onClick={() => router.push(`/patients/${entry.patientId}`)}
                  className="group/row flex w-full items-start gap-3 rounded-xl border border-transparent px-3 py-2.5 text-left transition-colors hover:border-border/50 hover:bg-muted/50"
                >
                  <div className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${getChartTypeColor(entry.type)}`}>
                    <Icon className="h-3.5 w-3.5" />
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
              label="Prescriptions"
              description="View & write prescriptions"
              onClick={() => router.push("/prescriptions")}
              color="text-emerald-600"
              bg="bg-emerald-500/10"
            />
            <QuickActionButton
              icon={FlaskConical}
              label="Lab Results"
              description="Review diagnostic uploads"
              onClick={() => router.push("/labs")}
              color="text-violet-600"
              bg="bg-violet-500/10"
            />
            <PatientRegisterDialog
              trigger={
                <QuickActionButton
                  icon={UserPlus}
                  label="Admit Patient"
                  description="Register a new admission"
                  onClick={() => {}}
                  color="text-amber-600"
                  bg="bg-amber-500/10"
                />
              }
            />
          </div>
        </div>

        <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4">
          <p className="text-sm font-semibold text-amber-700 dark:text-amber-400">
            {recentCharts.length} chart entries
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Latest documentation from the live patient chart feed
          </p>
          <button
            onClick={() => router.push("/patients")}
            className="mt-2 text-xs font-medium text-amber-600 hover:underline"
          >
            Open patients →
          </button>
        </div>
      </div>
    </div>
  );
}
