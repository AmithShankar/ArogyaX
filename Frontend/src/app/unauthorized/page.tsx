"use client";

import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { DEFAULT_REDIRECT } from "@/lib/app-config";
import {
    Activity, ArrowLeft, ClipboardList, LayoutDashboard, Lock, ShieldAlert, Stethoscope
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { UnauthorizedBackground } from "./_components/UnauthorizedBackground";

export default function UnauthorizedPage() {
  const router = useRouter();
  const { user } = useAuth();

  return (
    <div className="fixed inset-0 w-full h-full bg-background flex flex-col items-center justify-center p-6 overflow-hidden font-outfit">
      
      <div className="absolute top-8 right-8 z-50">
        <ThemeToggle />
      </div>
      
      <UnauthorizedBackground />

      <div className="w-full max-w-2xl relative z-10 flex flex-col items-center text-center animate-fade-in px-4">
        
        <div className="relative mb-8 group">
          <div className="absolute -inset-10 bg-destructive/10 rounded-full blur-[60px] animate-pulse group-hover:bg-destructive/15 transition-all" />
          
          <div className="relative h-32 w-32 rounded-[2.5rem] bg-card border-2 border-destructive/20 shadow-2xl flex items-center justify-center rotate-3 group-hover:rotate-0 transition-transform duration-700">
            <ShieldAlert className="h-14 w-14 text-destructive" />
            
            <div className="absolute -top-3 -right-3 h-10 w-10 rounded-xl bg-destructive text-white flex items-center justify-center shadow-lg transform -rotate-12">
              <Lock className="h-5 w-5" />
            </div>
          </div>
        </div>

        <div className="space-y-6 mb-12 max-w-lg">
          <div className="flex flex-col items-center gap-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-destructive/10 dark:bg-destructive/20 text-destructive text-[11px] font-black tracking-[0.25em] uppercase border border-destructive/20 mx-auto">
              <Activity className="h-3 w-3" /> Security Alert: 403
            </div>
            
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-[hsl(var(--warning)/0.15)] text-[hsl(var(--warning-foreground))] text-[10px] font-bold uppercase tracking-widest border border-[hsl(var(--warning)/0.2)]">
              Threat Level: Moderate Restriction
            </div>
          </div>
          
          <h1 className="text-4xl font-black tracking-tight text-foreground sm:text-5xl">
            Restricted Ward.
          </h1>
          
          <p className="text-muted-foreground text-base sm:text-lg font-medium leading-relaxed max-w-md mx-auto">
            Your clearance (<span className="text-destructive font-black decoration-destructive/30 underline decoration-2 underline-offset-4">{user?.role || "GUEST"}</span>) does not match the protocols for this department.
          </p>
        </div>

        <div className="relative w-full flex items-center justify-center mb-10">
          <div className="absolute inset-0 flex items-center px-12 sm:px-24 leading-none"><div className="w-full border-t border-border"></div></div>
          <div className="relative px-6 bg-background text-border ring-8 ring-background">
            <ClipboardList className="h-8 w-8" />
          </div>
        </div>

        <div className="w-full max-w-md bg-card border border-border rounded-3xl p-6 mb-10 shadow-lg">
          <div className="flex items-start gap-5 text-left">
            <div className="h-12 w-12 rounded-2xl bg-destructive/5 flex items-center justify-center shrink-0 border border-destructive/10">
              <Stethoscope className="h-6 w-6 text-destructive" />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground mb-1.5">Security Protocol</p>
              <p className="text-sm font-medium leading-relaxed text-muted-foreground text-pretty">
                Unauthorized entry attempts are logged in the Central Audit Repository. For scope escalation, contact the Facility Chief.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-5 w-full sm:w-auto">
          <Button asChild size="lg" className="h-14 px-10 rounded-xl text-sm font-black shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95 group">
            <Link href={DEFAULT_REDIRECT}>
              <LayoutDashboard className="h-4 w-4 mr-2.5 group-hover:rotate-6 transition-transform" />
              Return to Post
            </Link>
          </Button>
          <Button variant="outline" size="lg" className="h-14 px-10 rounded-xl text-sm font-black transition-all hover:bg-card border-border text-muted-foreground shadow-sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2.5" />
            Retrace Steps
          </Button>
        </div>
      </div>
    </div>
  );
}

