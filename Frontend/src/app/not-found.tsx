"use client";

import { NotFoundBackground } from "@/components/layout/NotFoundBackground";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { Button } from "@/components/ui/button";
import {
    Activity, ArrowLeft, LayoutDashboard, Search,
    Stethoscope
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="fixed inset-0 w-full h-full bg-background flex flex-col items-center justify-center p-8 overflow-hidden font-outfit">
      <div className="absolute top-8 right-8 z-50">
        <ThemeToggle />
      </div>

      <NotFoundBackground />

      <div className="w-full max-w-2xl relative z-10 flex flex-col items-center text-center animate-fade-in px-4">
        <div className="relative mb-12 group">
          <div className="absolute -inset-12 bg-primary/10 rounded-full blur-[80px] animate-pulse group-hover:bg-primary/15 transition-all" />

          <div className="relative h-32 w-32 rounded-[2.5rem] bg-card border border-border shadow-2xl flex items-center justify-center -rotate-3 group-hover:rotate-0 transition-transform duration-700">
            <Search className="h-16 w-16 text-primary" />
          </div>
        </div>

        <div className="space-y-6 mb-12 max-w-xl">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-foreground/5 text-muted-foreground text-[11px] font-black tracking-[0.25em] uppercase border border-border">
            <Activity className="h-3.5 w-3.5" /> status: 404 - Record Missing
          </div>

          <h1 className="text-4xl font-black tracking-tight text-foreground sm:text-5xl">
            Room not found.
          </h1>

          <p className="text-muted-foreground text-base sm:text-lg font-medium max-w-md mx-auto leading-relaxed">
            The medical chart or ward you&apos;re looking for has been{" "}
            <span className="text-primary italic font-bold">vacated</span> from
            our active registry.
          </p>
        </div>

        <div className="relative w-full flex items-center justify-center mb-8">
          <div className="absolute inset-0 flex items-center px-12 sm:px-32 leading-none">
            <div className="w-full border-t border-border"></div>
          </div>
          <div className="relative px-6 bg-background text-border ring-8 ring-background">
            <Stethoscope className="h-6 w-6" />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-5 w-full sm:w-auto">
          <Button
            asChild
            size="lg"
            className="h-14 px-10 rounded-xl text-sm font-black shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95 group"
          >
            <Link href="/">
              <LayoutDashboard className="h-4 w-4 mr-2.5 group-hover:scale-110 transition-transform" />
              Return to Station
            </Link>
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="h-14 px-10 rounded-xl text-sm font-black transition-all hover:bg-card border-border text-muted-foreground shadow-sm"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4 mr-2.5" />
            Retrace Steps
          </Button>
        </div>

        <p className="mt-20 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground opacity-60 max-w-xs mx-auto leading-relaxed">
          Lost in the corridors? Report broken clinical links to Technical
          Logistics.
        </p>
      </div>
    </div>
  );
}
