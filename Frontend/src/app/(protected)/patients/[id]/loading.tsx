"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function PatientProfileLoading() {
  return (
    <div className="page-shell animate-in fade-in duration-500">
      <section className="page-hero">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <Skeleton className="h-20 w-20 rounded-2xl" />
            <div className="space-y-2">
              <Skeleton className="h-8 w-[200px]" />
              <div className="flex gap-2">
                <Skeleton className="h-5 w-[80px] rounded-full" />
                <Skeleton className="h-5 w-[120px] rounded-full" />
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-10 w-10 rounded-xl" />
            <Skeleton className="h-10 w-[140px] rounded-xl" />
          </div>
        </div>
      </section>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
        {/* Summary + Tabs Area */}
        <div className="space-y-6">
          {/* Summary Skeleton */}
          <div className="rounded-2xl border border-border/50 bg-card/30 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-8 w-8 rounded-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-full opacity-60" />
              <Skeleton className="h-4 w-[90%] opacity-60" />
              <Skeleton className="h-4 w-[70%] opacity-40" />
            </div>
          </div>

          {/* Tabs Skeleton */}
          <div className="space-y-6">
            <div className="flex gap-4 border-b pb-px">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-10 w-24" />
              ))}
            </div>

            <div className="space-y-4">
              {[...Array(2)].map((_, i) => (
                <Skeleton key={i} className="h-[200px] w-full rounded-2xl border border-border/40" />
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Stats Area */}
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex h-24 items-center justify-between rounded-2xl border border-border/50 bg-card/10 p-5">
              <div className="flex items-center gap-4">
                <Skeleton className="h-12 w-12 rounded-2xl" />
                <div className="space-y-2">
                  <Skeleton className="h-3 w-16 opacity-40" />
                  <Skeleton className="h-6 w-12" />
                </div>
              </div>
              <Skeleton className="h-6 w-16 rounded-full opacity-20" />
            </div>
          ))}
          <div className="rounded-2xl border border-dashed border-border/60 bg-muted/5 p-4">
             <Skeleton className="h-3 w-32 opacity-30" />
          </div>
        </div>
      </div>
    </div>
  );
}
