"use client";

import { Skeleton } from "@/components/ui/skeleton";

interface TablePageSkeletonProps {
  heroTitle?: boolean;
  heroSubtitle?: boolean;
  heroBadges?: number;
  searchBar?: boolean;
  filters?: number;
  rows?: number;
  columns?: number;
}

export function TablePageSkeleton({
  heroTitle = true,
  heroSubtitle = true,
  heroBadges = 1,
  searchBar = true,
  filters = 2,
  rows = 8,
  columns = 5,
}: TablePageSkeletonProps) {
  return (
    <div className="page-shell">
      <section className="page-hero">
        <div className="space-y-4">
          {heroBadges > 0 && (
            <div className="flex gap-2">
              {[...Array(heroBadges)].map((_, i) => (
                <Skeleton key={i} className="h-6 w-[120px] rounded-full opacity-20" />
              ))}
            </div>
          )}
          
          <div className="space-y-2">
            {heroTitle && <Skeleton className="h-10 w-[30%] min-w-[240px]" />}
            {heroSubtitle && <Skeleton className="h-4 w-[50%] min-w-[320px] opacity-60" />}
          </div>
        </div>
        
        <div className="mt-6">
          <Skeleton className="h-6 w-[100px] rounded-full opacity-40" />
        </div>
      </section>

      <section className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
        {searchBar && <Skeleton className="h-10 w-full max-w-md rounded-xl" />}
        <div className="flex gap-2">
          {[...Array(filters)].map((_, i) => (
            <Skeleton key={i} className="h-10 w-[140px] rounded-xl" />
          ))}
        </div>
      </section>

      <div className="mt-6 overflow-hidden rounded-2xl border border-border/50 bg-card/50">
        <div className="h-12 border-b bg-muted/30 px-8 flex items-center gap-4">
           {[...Array(columns)].map((_, i) => (
             <Skeleton key={i} className="h-4 flex-1" />
           ))}
        </div>
        
        <div className="divide-y divide-border/40">
          {[...Array(rows)].map((_, i) => (
            <div key={i} className="h-[72px] px-8 flex items-center gap-4">
               {[...Array(columns)].map((_, j) => (
                <Skeleton key={j} className={`h-4 ${j === 0 ? "flex-[1.2]" : "flex-1"}`} />
               ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
