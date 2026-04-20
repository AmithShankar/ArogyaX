"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function PatientsLoading() {
  return (
    <div className="page-shell animate-in fade-in duration-500">
      <section className="page-hero">
        <div className="space-y-4">
          <Skeleton className="h-6 w-[120px] rounded-full opacity-20" />
          <div className="space-y-2">
            <Skeleton className="h-10 w-[240px]" />
            <Skeleton className="h-4 w-[400px] max-w-full" />
          </div>
        </div>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Skeleton className="h-6 w-[80px] rounded-full" />
          <Skeleton className="h-10 w-[140px] rounded-xl" />
        </div>
      </section>

      <section className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
        <Skeleton className="h-10 w-full max-w-md rounded-xl" />
        <Skeleton className="h-10 w-[130px] rounded-xl" />
      </section>

      <div className="mt-4 overflow-hidden rounded-2xl border bg-card/50">
        <div className="h-12 border-b bg-muted/30 px-8 flex items-center gap-4">
           {[...Array(6)].map((_, i) => (
             <Skeleton key={i} className="h-4 flex-1" />
           ))}
        </div>
        <div className="divide-y">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-[72px] px-8 flex items-center gap-4">
               <Skeleton className="h-8 w-8 rounded-full" />
               <Skeleton className="h-4 flex-1" />
               <Skeleton className="h-4 flex-1" />
               <Skeleton className="h-4 flex-[0.5]" />
               <Skeleton className="h-4 flex-[1.5]" />
               <Skeleton className="h-4 flex-1" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
