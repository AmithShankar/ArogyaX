import { Skeleton } from "@/components/ui/skeleton";

export default function ChangePasswordLoading() {
  return (
    <div className="relative min-h-screen overflow-hidden px-4 py-6 md:px-6 md:py-10">
      <div className="relative mx-auto flex min-h-[calc(100vh-3rem)] max-w-3xl items-center">
        <div className="w-full rounded-[var(--radius-lg)] border bg-card shadow-xl overflow-hidden p-8">
          <div className="space-y-4 mb-8">
            <Skeleton className="h-6 w-40 rounded-full opacity-20" />
            <div className="flex items-center gap-4">
              <Skeleton className="h-12 w-12 rounded-2xl" />
              <div className="space-y-2">
                <Skeleton className="h-8 w-[240px]" />
                <Skeleton className="h-4 w-[400px] opacity-60" />
              </div>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 mb-8">
            <div className="space-y-3">
              <Skeleton className="h-4 w-24 opacity-60" />
              <Skeleton className="h-11 w-full rounded-xl" />
            </div>
            <div className="space-y-3">
              <Skeleton className="h-4 w-32 opacity-60" />
              <Skeleton className="h-11 w-full rounded-xl" />
            </div>
          </div>

          <div className="rounded-2xl border bg-muted/20 p-6 space-y-4 mb-8">
            <div className="flex items-center gap-3">
              <Skeleton className="h-4 w-4 rounded-full" />
              <Skeleton className="h-4 w-32" />
            </div>
            <Skeleton className="h-4 w-full opacity-40" />
          </div>

          <Skeleton className="h-12 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}
