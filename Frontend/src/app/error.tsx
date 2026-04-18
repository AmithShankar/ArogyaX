"use client";

import { Button } from "@/components/ui/button";
import { APP_NAME } from "@/lib/app-config";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-background p-8 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-[1.5rem] border border-border bg-card shadow-lg">
        <AlertTriangle className="h-10 w-10 text-destructive" />
      </div>

      <p className="mb-2 text-[11px] font-black uppercase tracking-[0.2em] text-primary/70">
        {APP_NAME} · System Error
      </p>
      <h1 className="mb-3 text-3xl font-black tracking-tight text-foreground">
        Something went wrong
      </h1>
      <p className="mb-8 max-w-sm text-sm text-muted-foreground">
        An unexpected error occurred. Our team has been notified. You can try
        again or return to the dashboard.
      </p>

      <div className="flex gap-3">
        <Button onClick={reset} className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Try again
        </Button>
        <Button variant="outline" asChild>
          <a href="/dashboard">Return to Dashboard</a>
        </Button>
      </div>
    </div>
  );
}
