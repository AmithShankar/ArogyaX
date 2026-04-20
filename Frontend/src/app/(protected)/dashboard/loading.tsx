"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div className="page-shell animate-in fade-in duration-700">
      <section className="page-hero">
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
          <div className="relative h-[280px] w-full rounded-2xl bg-card border overflow-hidden">
             <div className="p-6 space-y-4">
                <Skeleton className="h-4 w-[120px] opacity-20" />
                <Skeleton className="h-10 w-[300px]" />
                <div className="flex gap-2">
                   <Skeleton className="h-6 w-[100px] rounded-full" />
                   <Skeleton className="h-6 w-[100px] rounded-full" />
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
                   {[...Array(4)].map((_, i) => (
                     <Skeleton key={i} className="h-20 w-full rounded-xl" />
                   ))}
                </div>
             </div>
          </div>

          <div className="flex flex-col gap-3">
            <Skeleton className="h-[120px] w-full rounded-2xl" />
            <Skeleton className="h-[148px] w-full rounded-2xl" />
          </div>
        </div>
      </section>

      <div className="mt-6 space-y-6">
        <div className="flex items-center justify-between">
           <Skeleton className="h-8 w-[200px]" />
           <Skeleton className="h-8 w-[100px]" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-[300px] w-full rounded-2xl" />
          ))}
        </div>
      </div>
    </div>
  );
}
