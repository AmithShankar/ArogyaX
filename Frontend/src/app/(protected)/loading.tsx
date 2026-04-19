import { HeartPulse } from "lucide-react";

export default function GlobalProtectedLoading() {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background/80 backdrop-blur-xl">
      <div className="relative">
        <div className="absolute inset-0 -m-8 animate-[ping_3s_linear_infinite] rounded-full border-2 border-primary/20" />
        <div className="absolute inset-0 -m-4 animate-[ping_2s_linear_infinite] rounded-full border-2 border-primary/30" />
        
        <div className="relative flex h-24 w-24 items-center justify-center rounded-3xl bg-primary text-primary-foreground shadow-[0_0_50px_-12px_rgba(var(--primary),0.5)]">
          <HeartPulse className="h-12 w-12 animate-pulse" />
        </div>
      </div>

      <div className="mt-12 flex flex-col items-center gap-3">
        <h2 className="text-xl font-bold tracking-tight text-foreground">
          Initializing Clinical Command Center
        </h2>
        <div className="flex items-center gap-1.5 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
          <span className="flex h-1 w-1 rounded-full bg-primary/40" />
          Synchronizing Secure Data
          <span className="flex items-center gap-0.5 ml-1">
            <span className="h-1 w-1 animate-[bounce_1s_infinite_100ms] rounded-full bg-primary" />
            <span className="h-1 w-1 animate-[bounce_1s_infinite_200ms] rounded-full bg-primary" />
            <span className="h-1 w-1 animate-[bounce_1s_infinite_300ms] rounded-full bg-primary" />
          </span>
        </div>
      </div>

      <div className="absolute bottom-12 flex items-center gap-2 rounded-full border border-border/50 bg-secondary/50 px-4 py-1.5 transition-all hover:bg-secondary/80">
        <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
          End-to-End Encrypted Session
        </span>
      </div>
    </div>
  );
}
