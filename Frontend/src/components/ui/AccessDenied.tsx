import { DEFAULT_REDIRECT, UNAUTHORIZED_ROUTE } from "@/lib/app-config";
import { ShieldX } from "lucide-react";
import Link from "next/link";
import { Button } from "./button";

// Lightweight inline fallback - used where a full-page redirect isn't possible.
// For full-page unauthorized access, redirect to UNAUTHORIZED_ROUTE instead.
export default function AccessDenied() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="bg-warning/10 p-4 rounded-2xl ring-1 ring-warning/20 mb-6">
        <ShieldX className="h-12 w-12 text-warning" />
      </div>
      <h1 className="text-2xl font-bold tracking-tight mb-2">
        Access Restricted
      </h1>
      <p className="text-muted-foreground text-sm mb-8 max-w-md">
        Your role doesn&apos;t include permission to view this section. Contact
        your Hospital Admin if you need access.
      </p>
      <div className="flex gap-3">
        <Button asChild>
          <Link href={DEFAULT_REDIRECT}>Back to Dashboard</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href={UNAUTHORIZED_ROUTE}>Learn More</Link>
        </Button>
      </div>
    </div>
  );
}
