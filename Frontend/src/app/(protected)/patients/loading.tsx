import { Skeleton } from "@/components/ui/skeleton";

export default function PatientsLoading() {
  return (
    <div className="page-shell">
      <div className="page-hero">
        <Skeleton className="h-5 w-28 mb-2" />
        <Skeleton className="h-8 w-56 mb-1" />
        <Skeleton className="h-4 w-72" />
      </div>

      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <Skeleton className="h-10 w-full md:w-72" />
        <Skeleton className="h-10 w-36" />
      </div>
      <div className="rounded-2xl border bg-card overflow-hidden">
        <div className="p-4 border-b">
          <Skeleton className="h-5 w-40" />
        </div>
        <div className="divide-y divide-border">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 px-4 py-3">
              <Skeleton className="h-9 w-9 rounded-full shrink-0" />
              <div className="flex-1 min-w-0">
                <Skeleton className="h-4 w-40 mb-1" />
                <Skeleton className="h-3 w-24" />
              </div>
              <Skeleton className="h-6 w-20 rounded-full shrink-0 hidden md:block" />
              <Skeleton className="h-4 w-24 shrink-0 hidden lg:block" />
              <Skeleton className="h-8 w-8 rounded-lg shrink-0" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
