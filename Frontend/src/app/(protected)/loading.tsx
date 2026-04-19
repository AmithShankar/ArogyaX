import { HeartPulse } from "lucide-react";

export default function ProtectedLoading() {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background px-6 backdrop-blur-md">
      <div className="relative mb-12 flex h-24 w-24 items-center justify-center">
        <div className="absolute inset-0 animate-ping rounded-full bg-primary/20" />
        <div className="absolute inset-0 -m-4 animate-ping rounded-full bg-primary/10 duration-1000" />
        <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl bg-primary text-primary-foreground shadow-[0_0_50px_-12px_rgba(var(--primary),0.5)]">
          <HeartPulse className="h-10 w-10 animate-pulse" />
        </div>
      </div>
      
      <div className="space-y-4 text-center max-w-sm animate-in fade-in zoom-in duration-500">
        <h2 className="text-3xl font-black tracking-tight text-foreground">
          Initializing Session
        </h2>
        <div className="flex flex-col items-center gap-2">
           <div className="flex items-center gap-1.5 font-mono text-xs uppercase tracking-[0.3em] text-primary">
              Establishing Secure Link
              <span className="flex items-center gap-0.5 ml-1">
                <span className="h-1 w-1 animate-bounce rounded-full bg-primary" />
                <span className="h-1 w-1 animate-bounce rounded-full bg-primary [animation-delay:0.2s]" />
                <span className="h-1 w-1 animate-bounce rounded-full bg-primary [animation-delay:0.4s]" />
              </span>
           </div>
           <p className="text-sm text-muted-foreground font-medium">
             Synchronizing clinical secure storage...
           </p>
        </div>
      </div>
    </div>
  );
}
