"use client";

import { EmptyState } from "@/components/ui/empty-state";
import { QuickActionButton } from "@/components/ui/QuickActionButton";
import { timeAgo } from "@/lib/utils/date";
import { LabTechExtraProps } from "@/types";
import { ChevronRight, FlaskConical, Stethoscope, TestTube, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { SectionHeader } from "../layout/SectionHeader";

export function LabTechExtra({ labs, patients }: LabTechExtraProps) {
  const router = useRouter();
  const latestLab = labs[0] ?? null;

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <div className="lg:col-span-2 flex flex-col rounded-2xl border border-border bg-card p-5 shadow-sm">
        <SectionHeader title="Recent Lab Results" linkLabel="All Labs" href="/labs" router={router} />
        {labs.length === 0 ? (
          <EmptyState
            icon={TestTube}
            title="No lab activity yet"
            description="This space will surface uploaded diagnostics and lab-linked chart entries once the first result is added."
            actionLabel="Open labs"
            onAction={() => router.push("/labs")}
            compact
            className="mt-2"
          />
        ) : (
          <div className="space-y-1.5">
            {labs.map((entry) => {
              const patient = patients.find((p) => p.id === entry.patientId);
              return (
                <button
                  key={entry.id}
                  onClick={() => router.push(`/patients/${entry.patientId}`)}
                  className="group/row flex w-full items-start gap-3 rounded-xl border border-transparent px-3 py-2.5 text-left transition-colors hover:border-border/50 hover:bg-muted/50"
                >
                  <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-violet-500/10 text-violet-500">
                    <TestTube className="h-3.5 w-3.5" />
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
                    <p className="mt-0.5 truncate text-xs text-muted-foreground">
                      {entry.comments}
                    </p>
                    {entry.upload && (
                      <span className="font-mono text-xs text-violet-500">{entry.upload}</span>
                    )}
                  </div>
                  <ChevronRight className="mt-1 h-3.5 w-3.5 shrink-0 text-muted-foreground/30 transition-all group-hover/row:text-primary" />
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
              icon={FlaskConical}
              label="Upload Lab Result"
              description="Add new diagnostics to the system"
              onClick={() => router.push("/labs")}
              color="text-violet-600"
              bg="bg-violet-500/10"
            />
            <QuickActionButton
              icon={Stethoscope}
              label="Patient Clinical Notes"
              description="Browse chart history and records"
              onClick={() => router.push("/patients")}
              color="text-primary"
              bg="bg-primary/10"
            />
            <QuickActionButton
              icon={User}
              label="Latest Lab Patient"
              description={latestLab ? "Open most recently processed patient" : "No lab results yet"}
              onClick={() => latestLab && router.push(`/patients/${latestLab.patientId}`)}
              disabled={!latestLab}
              color="text-emerald-600"
              bg="bg-emerald-500/10"
            />
          </div>
        </div>

        <div className="rounded-2xl border border-violet-500/20 bg-violet-500/5 p-4">
          <p className="text-sm font-semibold text-violet-700 dark:text-violet-400">
            {labs.length} lab results available
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Most recent uploads and diagnostic notes from the backend feed
          </p>
        </div>
      </div>
    </div>
  );
}
