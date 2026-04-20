"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function ProtectedLoading() {
  return (
    <div className="page-shell animate-in fade-in duration-500">
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
        <Skeleton className="h-[200px] w-full rounded-2xl" />
        <div className="flex flex-col gap-3">
          <Skeleton className="h-[100px] w-full rounded-2xl" />
          <Skeleton className="h-[80px] w-full rounded-2xl" />
        </div>
      </div>
      
      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-[120px] w-full rounded-2xl" />
        ))}
      </div>

      <div className="mt-8 space-y-4">
        <Skeleton className="h-10 w-[200px]" />
        <div className="grid gap-4 md:grid-cols-2">
          <Skeleton className="h-[300px] w-full rounded-2xl" />
          <Skeleton className="h-[300px] w-full rounded-2xl" />
        </div>
      </div>
    </div>
  );
}
