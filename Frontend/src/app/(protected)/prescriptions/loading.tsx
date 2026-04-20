"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function PrescriptionsLoading() {
  return (
    <div className="page-shell animate-in fade-in duration-500">
      <section className="page-hero">
        <div className="space-y-4">
          <Skeleton className="h-6 w-[140px] rounded-full opacity-20" />
          <div className="space-y-2">
            <Skeleton className="h-10 w-[280px]" />
            <Skeleton className="h-4 w-[450px] max-w-full" />
          </div>
        </div>
      </section>

      <section className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
        <Skeleton className="h-10 w-full max-w-md rounded-xl" />
        <div className="flex gap-2">
          <Skeleton className="h-10 w-[120px] rounded-xl" />
          <Skeleton className="h-10 w-[120px] rounded-xl" />
        </div>
      </section>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="flex flex-col gap-4 rounded-2xl border bg-card p-5">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <Skeleton className="h-5 w-[180px]" />
                <Skeleton className="h-4 w-[120px] opacity-60" />
              </div>
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
            <div className="flex gap-4 border-t pt-4">
              <Skeleton className="h-4 w-[100px]" />
              <Skeleton className="h-4 w-[100px]" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
