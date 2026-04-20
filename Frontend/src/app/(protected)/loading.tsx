"use client";

import { HeartPulse } from "lucide-react";

export default function ProtectedLoading() {
  return (
    <div className="flex min-h-[60vh] w-full flex-col items-center justify-center animate-in fade-in duration-500">
      <div className="relative flex h-16 w-16 items-center justify-center">
        <div className="absolute inset-0 animate-ping rounded-full bg-primary/20" />
        <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg">
          <HeartPulse className="h-6 w-6 animate-pulse" />
        </div>
      </div>
      <p className="mt-4 text-xs font-bold uppercase tracking-[0.3em] text-primary/60">
        Loading clinical data
      </p>
    </div>
  );
}
