"use client";

import { Button } from "@/components/ui/button";
import { AlertTriangle, ArrowLeft, RefreshCw } from "lucide-react";
import { useEffect } from "react";

export default function ProtectedError({
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
    <div className="flex min-h-[60vh] flex-col items-center justify-center p-8 text-center animate-fade-in">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-destructive/20 bg-destructive/10 shadow-sm">
        <AlertTriangle className="h-8 w-8 text-destructive" />
      </div>

      <h2 className="mb-2 text-2xl font-bold tracking-tight text-foreground">
        Page failed to load
      </h2>
      <p className="mb-6 max-w-sm text-sm text-muted-foreground">
        An error occurred while rendering this section. Your data is safe - try
        refreshing or navigate back.
      </p>

      <div className="flex gap-3">
        <Button onClick={reset} size="sm" className="gap-2">
          <RefreshCw className="h-3.5 w-3.5" />
          Retry
        </Button>
        <Button variant="outline" size="sm" asChild>
          <a href="/dashboard">
            <ArrowLeft className="h-3.5 w-3.5 mr-1.5" />
            Dashboard
          </a>
        </Button>
      </div>
    </div>
  );
}
