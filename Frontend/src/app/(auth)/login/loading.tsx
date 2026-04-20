import { Skeleton } from "@/components/ui/skeleton";

export default function LoginLoading() {
  return (
    <div className="min-h-screen bg-background flex overflow-hidden">
      {/* Sidebar-like feature section (hidden on mobile) */}
      <div className="hidden lg:flex flex-1 relative bg-background p-16 flex-col justify-between overflow-hidden border-r border-border/40 font-outfit">
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-16">
            <div className="flex items-center gap-4">
              <Skeleton className="h-14 w-14 rounded-2xl" />
              <div className="space-y-2">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-2 w-32 opacity-40" />
              </div>
            </div>
            <Skeleton className="h-10 w-40 rounded-xl" />
          </div>

          <div className="space-y-8 max-w-xl">
             <Skeleton className="h-6 w-32 rounded-full opacity-20" />
             <div className="space-y-4">
               <Skeleton className="h-16 w-full" />
               <Skeleton className="h-16 w-[80%]" />
             </div>
             <Skeleton className="h-6 w-[60%] opacity-60" />
          </div>
        </div>

        <div className="relative z-10">
          <div className="grid grid-cols-2 gap-y-12 gap-x-12 mb-16">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex flex-col gap-3">
                <Skeleton className="h-12 w-12 rounded-2xl" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-32 opacity-40" />
                </div>
              </div>
            ))}
          </div>
          <Skeleton className="h-14 w-48 rounded-2xl" />
        </div>
      </div>

      {/* Login form area */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-background relative">
        <div className="w-full max-w-[420px] px-4 sm:px-0 space-y-10">
          <div className="lg:hidden flex flex-col items-center mb-10">
            <Skeleton className="h-16 w-16 rounded-2xl mb-4" />
            <Skeleton className="h-8 w-40" />
          </div>

          <div className="space-y-3 text-center lg:text-left">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-6 w-[80%] opacity-60" />
          </div>

          <div className="rounded-[2rem] border bg-card/80 p-8 space-y-8 shadow-xl">
            <Skeleton className="h-8 w-48 rounded-xl opacity-20" />
            <div className="space-y-6">
              <div className="space-y-3">
                <Skeleton className="h-3 w-24 opacity-40" />
                <Skeleton className="h-14 w-full rounded-2xl" />
              </div>
              <div className="space-y-3">
                <Skeleton className="h-3 w-24 opacity-40" />
                <Skeleton className="h-14 w-full rounded-2xl" />
              </div>
              <Skeleton className="h-14 w-full rounded-2xl mt-4" />
            </div>
          </div>

          <div className="mt-12 space-y-4">
             <div className="flex items-center gap-4">
               <div className="h-px w-full bg-border" />
               <Skeleton className="h-5 w-5 rounded-full shrink-0" />
               <div className="h-px w-full bg-border" />
             </div>
             <div className="flex justify-center flex-col items-center gap-4">
                <Skeleton className="h-3 w-40 opacity-40" />
                <Skeleton className="h-3 w-32 opacity-20" />
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
