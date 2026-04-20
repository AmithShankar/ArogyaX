import { Skeleton } from "@/components/ui/skeleton";

export default function UnauthorizedLoading() {
  return (
    <div className="fixed inset-0 w-full h-full bg-background flex flex-col items-center justify-center p-6 overflow-hidden">
      <div className="w-full max-w-2xl relative z-10 flex flex-col items-center text-center px-4">
        
        <div className="relative mb-8">
           <Skeleton className="h-32 w-32 rounded-[2.5rem]" />
           <div className="absolute -top-3 -right-3">
             <Skeleton className="h-10 w-10 rounded-xl" />
           </div>
        </div>

        <div className="space-y-6 mb-12 max-w-lg flex flex-col items-center">
           <div className="space-y-3 flex flex-col items-center">
             <Skeleton className="h-8 w-[180px] rounded-full opacity-20" />
             <Skeleton className="h-6 w-[140px] rounded-lg opacity-10" />
           </div>
           
           <Skeleton className="h-12 w-[320px]" />
           <Skeleton className="h-6 w-[280px] opacity-40" />
        </div>

        <div className="w-full max-w-md rounded-3xl border bg-card p-6 mb-10 flex gap-4 items-start">
           <Skeleton className="h-12 w-12 rounded-2xl shrink-0" />
           <div className="space-y-3 flex-1">
             <Skeleton className="h-3 w-32 opacity-40" />
             <div className="space-y-2">
               <Skeleton className="h-4 w-full" />
               <Skeleton className="h-4 w-[80%] opacity-60" />
             </div>
           </div>
        </div>

        <div className="flex gap-4">
          <Skeleton className="h-14 w-[160px] rounded-xl" />
          <Skeleton className="h-14 w-[160px] rounded-xl" />
        </div>
      </div>
    </div>
  );
}
