"use client";

import { EmptyState } from "@/components/ui/empty-state";
import { QuickActionButton } from "@/components/ui/QuickActionButton";
import { AdminExtraProps } from "@/types";
import { ClipboardList, IndianRupee, TrendingUp, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { SectionHeader } from "../layout/SectionHeader";

export function AdminExtra({
  recentInvoices,
  totalRevenue,
  monthRevenue,
}: AdminExtraProps) {
  const router = useRouter();

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <div className="lg:col-span-2 flex flex-col rounded-2xl border border-border bg-card p-5 shadow-sm">
        <SectionHeader
          title="Recent Invoices"
          linkLabel="Billing Dashboard"
          href="/admin"
          router={router}
        />
        {recentInvoices.length === 0 ? (
          <EmptyState
            icon={IndianRupee}
            title="No invoices created yet"
            description="Billing activity will appear here as soon as patient invoices start coming in from the backend."
            actionLabel="Open admin dashboard"
            onAction={() => router.push("/admin")}
            compact
            className="mt-2"
          />
        ) : (
          <div className="space-y-1.5">
            {recentInvoices.map((invoice) => (
              <div
                key={invoice.id}
                className="flex items-center gap-3 rounded-xl border border-transparent px-3 py-2.5 transition-colors hover:border-border/50 hover:bg-muted/50"
              >
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600">
                  <IndianRupee className="h-3.5 w-3.5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate text-sm font-medium text-foreground">
                      {invoice.patientName}
                    </span>
                    <span className="shrink-0 rounded-md bg-muted px-2 py-0.5 text-sm font-semibold text-foreground">
                      ₹{Number(invoice.amount).toLocaleString()}
                    </span>
                  </div>
                  <div className="mt-0.5 flex items-center gap-2">
                    <span className="rounded bg-secondary/50 px-1.5 py-0.5 text-xs text-muted-foreground">
                      {invoice.date}
                    </span>
                    <p className="truncate text-xs text-muted-foreground">{invoice.name}</p>
                  </div>
                </div>
              </div>
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
              icon={TrendingUp}
              label="Analytics & Billing"
              description="Financial overview and reports"
              onClick={() => router.push("/admin")}
              color="text-primary"
              bg="bg-primary/10"
            />
            <QuickActionButton
              icon={Users}
              label="Staff Management"
              description="Manage staff accounts and roles"
              onClick={() => router.push("/users")}
              color="text-emerald-600"
              bg="bg-emerald-500/10"
            />
            <QuickActionButton
              icon={ClipboardList}
              label="Audit Log"
              description="Review governance and activity trail"
              onClick={() => router.push("/audit-log")}
              color="text-violet-600"
              bg="bg-violet-500/10"
            />
          </div>
        </div>

        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4">
          <div className="space-y-2">
            <div>
              <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                All-time Revenue
              </p>
              <p className="mt-0.5 text-xl font-bold text-foreground">
                ₹{Number(totalRevenue).toLocaleString()}
              </p>
            </div>
            <div className="border-t border-emerald-500/15 pt-2">
              <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                This Month
              </p>
              <p className="mt-0.5 text-lg font-semibold text-emerald-700 dark:text-emerald-400">
                ₹{Number(monthRevenue).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
