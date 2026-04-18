"use client";

import { EmptyState } from "@/components/ui/empty-state";
import { QuickActionButton } from "@/components/ui/QuickActionButton";
import { getActionColor } from "@/features/activity/activity.utils";
import { timeAgo } from "@/lib/utils/date";
import { OwnerExtraProps } from "@/types";
import { ClipboardList, TrendingUp, UserCog, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { SectionHeader } from "../layout/SectionHeader";

export function OwnerExtra({ logs }: OwnerExtraProps) {
  const router = useRouter();
  const recent = [...logs]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 8);

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <div className="lg:col-span-2 flex flex-col rounded-2xl border border-border bg-card p-5 shadow-sm">
        <SectionHeader
          title="Recent System Activity"
          linkLabel="Full Audit Log"
          href="/audit-log"
          router={router}
        />
        {recent.length === 0 ? (
          <EmptyState
            icon={ClipboardList}
            title="No system activity yet"
            description="Governance events, logins, and data changes will stream into this feed as the system is used."
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
            System Controls
          </p>
          <div className="space-y-2">
            <QuickActionButton
              icon={UserCog}
              label="User Management"
              description="Add, edit, and manage all staff"
              onClick={() => router.push("/users")}
              color="text-primary"
              bg="bg-primary/10"
            />
            <QuickActionButton
              icon={TrendingUp}
              label="Billing Overview"
              description="Financial reports and revenue data"
              onClick={() => router.push("/admin")}
              color="text-emerald-600"
              bg="bg-emerald-500/10"
            />
            <QuickActionButton
              icon={ClipboardList}
              label="Full Audit Log"
              description="Complete governance history"
              onClick={() => router.push("/audit-log")}
              color="text-amber-600"
              bg="bg-amber-500/10"
            />
            <QuickActionButton
              icon={Users}
              label="Patient Directory"
              description="Browse all clinical records"
              onClick={() => router.push("/patients")}
              color="text-violet-600"
              bg="bg-violet-500/10"
            />
          </div>
        </div>

        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-emerald-500" />
            <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
              {logs.length} system events tracked
            </p>
          </div>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Review governance activity in the live audit feed
          </p>
        </div>
      </div>
    </div>
  );
}
