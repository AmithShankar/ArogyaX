"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function AdminLoading() {
  return (
    <div className="page-shell animate-in fade-in duration-500">
      <section className="page-hero">
        <div className="space-y-4">
          <Skeleton className="h-6 w-[120px] rounded-full opacity-20" />
          <div className="space-y-2">
            <Skeleton className="h-10 w-[300px]" />
            <Skeleton className="h-4 w-[500px] max-w-full" />
          </div>
        </div>
      </section>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-28 w-full rounded-2xl" />
        ))}
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[1fr_400px]">
        <div className="space-y-6">
           <Skeleton className="h-[400px] w-full rounded-2xl" />
           <Skeleton className="h-[300px] w-full rounded-2xl" />
        </div>
        <div className="space-y-6">
           <Skeleton className="h-[250px] w-full rounded-2xl" />
           <Skeleton className="h-[450px] w-full rounded-2xl" />
        </div>
      </div>
    </div>
  );
}
