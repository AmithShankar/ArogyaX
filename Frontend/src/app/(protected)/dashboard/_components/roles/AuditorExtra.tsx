"use client";

import { EmptyState } from "@/components/ui/empty-state";
import { QuickActionButton } from "@/components/ui/QuickActionButton";
import { getActionColor } from "@/features/activity/activity.utils";
import { timeAgo } from "@/lib/utils/date";
import { AuditorExtraProps } from "@/types";
import { ClipboardList, IndianRupee, ScrollText, UserCog, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { SectionHeader } from "../layout/SectionHeader";

export function AuditorExtra({ logs }: AuditorExtraProps) {
  const router = useRouter();
  const recent = [...logs]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 8);

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <div className="lg:col-span-2 flex flex-col rounded-2xl border border-border bg-card p-5 shadow-sm">
        <SectionHeader
          title="Recent Audit Events"
          linkLabel="Full Audit Log"
          href="/audit-log"
          router={router}
        />
        {recent.length === 0 ? (
          <EmptyState
            icon={ScrollText}
            title="No audit events yet"
            description="System actions, data changes, and access events will stream here as staff interact with the platform."
            actionLabel="Open audit log"
            onAction={() => router.push("/audit-log")}
            compact
            className="mt-2"
          />
        ) : (
          <div className="space-y-1.5">
            {recent.map((log) => (
              <div
                key={log.id}
                className="flex items-center gap-3 rounded-xl border border-transparent px-3 py-2 transition-colors hover:border-border/50 hover:bg-muted/40"
              >
                <div
                  className={`shrink-0 rounded-md border px-2 py-0.5 text-xs font-semibold capitalize ${getActionColor(log.action)}`}
                >
                  {log.action}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs text-foreground">
                    <span className="font-medium">{log.userName}</span>
                    {" · "}
                    <span className="text-muted-foreground">{log.details}</span>
                  </p>
                </div>
                <span className="shrink-0 rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                  {timeAgo(log.timestamp)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-3">
        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
          <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
            Review Areas
          </p>
          <div className="space-y-2">
            <QuickActionButton
              icon={ClipboardList}
              label="Audit Log"
              description="Browse full governance history"
              onClick={() => router.push("/audit-log")}
              color="text-primary"
              bg="bg-primary/10"
            />
            <QuickActionButton
              icon={Users}
              label="Patient Directory"
              description="Inspect clinical records"
              onClick={() => router.push("/patients")}
              color="text-emerald-600"
              bg="bg-emerald-500/10"
            />
            <QuickActionButton
              icon={UserCog}
              label="Staff Directory"
              description="Review all user accounts"
              onClick={() => router.push("/users")}
              color="text-violet-600"
              bg="bg-violet-500/10"
            />
            <QuickActionButton
              icon={IndianRupee}
              label="Financial Overview"
              description="Inspect billing and revenue data"
              onClick={() => router.push("/admin")}
              color="text-amber-600"
              bg="bg-amber-500/10"
            />
          </div>
        </div>

        <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4">
          <div className="flex items-center gap-2">
            <ScrollText className="h-3.5 w-3.5 text-primary" />
            <p className="text-sm font-semibold text-primary">
              {logs.length} events in scope
            </p>
          </div>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Compliance and governance feed from the live audit trail
          </p>
        </div>
      </div>
    </div>
  );
}
