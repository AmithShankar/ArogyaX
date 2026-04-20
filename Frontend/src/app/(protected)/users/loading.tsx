"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function UsersLoading() {
  return (
    <div className="page-shell animate-in fade-in duration-500">
      <section className="page-hero">
        <div className="space-y-4">
          <Skeleton className="h-6 w-[120px] rounded-full opacity-20" />
          <div className="space-y-2">
            <Skeleton className="h-10 w-[260px]" />
            <Skeleton className="h-4 w-[420px] max-w-full" />
          </div>
        </div>
      </section>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="flex flex-col items-center gap-4 rounded-2xl border bg-card p-6 text-center">
            <Skeleton className="h-20 w-20 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-5 w-[140px] mx-auto" />
              <Skeleton className="h-4 w-[100px] mx-auto opacity-60" />
            </div>
            <div className="flex gap-2 mt-2">
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
