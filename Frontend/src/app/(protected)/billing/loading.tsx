"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function BillingLoading() {
  return (
    <div className="page-shell animate-in fade-in duration-500">
      <section className="page-hero">
        <div className="space-y-4">
          <Skeleton className="h-6 w-[100px] rounded-full opacity-20" />
          <div className="space-y-2">
            <Skeleton className="h-10 w-[240px]" />
            <Skeleton className="h-4 w-[380px] max-w-full" />
          </div>
        </div>
      </section>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-24 w-full rounded-2xl" />
        ))}
      </div>

      <div className="mt-8 overflow-hidden rounded-2xl border bg-card/50">
        <div className="h-12 border-b bg-muted/30 px-8 flex items-center gap-4">
           {[...Array(5)].map((_, i) => (
             <Skeleton key={i} className="h-4 flex-1" />
           ))}
        </div>
        <div className="divide-y">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-[72px] px-8 flex items-center gap-4">
               <Skeleton className="h-4 flex-1" />
               <Skeleton className="h-4 flex-1" />
               <Skeleton className="h-6 w-20 rounded-full" />
               <Skeleton className="h-4 flex-1" />
               <Skeleton className="h-4 w-12" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
