import { Skeleton } from "@/components/ui/skeleton";

export default function GenericLoading() {
  return (
    <div className="page-shell animate-in fade-in duration-300">
      <section className="page-hero">
        <div className="space-y-4">
          <Skeleton className="h-6 w-[120px] rounded-full opacity-20" />
          <div className="space-y-2">
            <Skeleton className="h-10 w-[240px]" />
            <Skeleton className="h-4 w-[400px] max-w-full opacity-60" />
          </div>
        </div>
      </section>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-32 w-full rounded-2xl" />
        ))}
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-border/50 bg-card/50">
        <div className="h-12 border-b bg-muted/30 px-8 flex items-center gap-4">
           {[...Array(5)].map((_, i) => (
             <Skeleton key={i} className="h-4 flex-1" />
           ))}
        </div>
        <div className="divide-y divide-border/40">
          {[...Array(6)].map((_, i) => (
             <div key={i} className="h-[72px] px-8 flex items-center gap-4">
                {[...Array(5)].map((_, j) => (
                  <Skeleton key={j} className="h-4 flex-1" />
                ))}
             </div>
          ))}
        </div>
      </div>
    </div>
  );
}
