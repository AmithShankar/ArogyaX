import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div className="page-shell animate-in fade-in duration-300">
      <section className="page-hero">
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
          <div className="min-w-0">
            <div className="space-y-2">
              <Skeleton className="h-4 w-[140px] rounded-full opacity-30" />
              <Skeleton className="h-10 w-[380px] rounded-xl" />
              <Skeleton className="h-4 w-[480px] rounded-lg opacity-40 max-w-full" />
            </div>
            
            <div className="mt-6 flex flex-wrap gap-2.5">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-7 w-[130px] rounded-full opacity-20" />
              ))}
            </div>

            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-[108px] w-full rounded-2xl border border-border/40 bg-muted/10 animate-pulse" />
              ))}
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
            <Skeleton key={i} className="h-[300px] w-full rounded-2xl shadow-sm border border-border/40" />
          ))}
        </div>
      </div>
    </div>
  );
}
