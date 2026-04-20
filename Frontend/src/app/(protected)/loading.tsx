"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function GenericLoading() {
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
      </section>

      <section className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
        <Skeleton className="h-10 w-full max-w-md rounded-xl" />
        <Skeleton className="h-10 w-[120px] rounded-xl" />
      </section>

      <div className="mt-6 flex flex-col gap-4">
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-32 w-full rounded-2xl" />
            ))}
         </div>
         <div className="overflow-hidden rounded-2xl border bg-card/50">
            <div className="h-64 flex items-center justify-center">
               <div className="flex flex-col items-center gap-4">
                  <div className="h-12 w-12 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
                  <Skeleton className="h-4 w-32 opacity-40" />
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
