"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { PatientSummaryProps } from "@/types";
import { 
  Activity, 
  ClipboardCheck, 
  History, 
  Sparkles, 
  Stethoscope,
  TrendingUp
} from "lucide-react";

export function PatientSummary({ summary, summaryLoading }: PatientSummaryProps) {
  if (!summary && !summaryLoading) return null;

  const sections = [
    {
      title: "Chief Complaint",
      content: summary?.chiefComplaint,
      icon: <Stethoscope className="h-4 w-4 text-rose-500" />,
      gradient: "from-rose-500/10 to-rose-500/0"
    },
    {
      title: "Past Medical History",
      content: summary?.pastMedicalHistory,
      icon: <History className="h-4 w-4 text-blue-500" />,
      gradient: "from-blue-500/10 to-blue-500/0"
    },
    {
      title: "Recent Developments",
      content: summary?.recentDevelopments,
      icon: <TrendingUp className="h-4 w-4 text-emerald-500" />,
      gradient: "from-emerald-500/10 to-emerald-500/0"
    },
    {
      title: "Current Assessment",
      content: summary?.currentAssessment,
      icon: <ClipboardCheck className="h-4 w-4 text-amber-500" />,
      gradient: "from-amber-500/10 to-amber-500/0"
    }
  ];

  return (
    <Card className="overflow-hidden border-none bg-gradient-to-br from-card/30 via-card/50 to-card/20 shadow-2xl backdrop-blur-xl">
      <div className="absolute inset-0 bg-grid-white/[0.02] [mask-image:radial-gradient(white,transparent)]" />
      
      <div className="relative border-b border-border/40 bg-muted/20 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold tracking-tight text-foreground">AI Clinical Synthesis</h3>
              <p className="text-xs text-muted-foreground">Real-time narrative generated from unified patient data</p>
            </div>
          </div>
          <Badge variant="secondary" className="bg-primary/5 text-primary ring-1 ring-primary/10">
            Current State
          </Badge>
        </div>
      </div>

      <CardContent className="relative p-6">
        {summaryLoading ? (
          <div className="grid gap-4 md:grid-cols-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="relative overflow-hidden rounded-2xl border border-border/40 bg-muted/20 p-5"
              >
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 animate-pulse rounded-lg bg-muted/40" />
                  <div className="h-4 w-32 animate-pulse rounded bg-muted/40" />
                </div>
                <div className="mt-4 space-y-2">
                  <div className="h-3 w-full animate-pulse rounded bg-muted/20" />
                  <div className="h-3 w-5/6 animate-pulse rounded bg-muted/20" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {sections.map((section, i) => (
              <div
                key={i}
                className={`group relative overflow-hidden rounded-2xl border border-border/40 bg-gradient-to-br ${section.gradient} p-5 transition-all hover:border-primary/20 hover:shadow-lg`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-background/50 shadow-sm ring-1 ring-border/50 group-hover:scale-110 transition-transform">
                      {section.icon}
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                      {section.title}
                    </span>
                  </div>
                </div>
                
                <div className="mt-4">
                  <p className="text-sm font-medium leading-relaxed text-foreground/90">
                    {section.content || <span className="italic text-muted-foreground/50">Data not provided for this synthesis...</span>}
                  </p>
                </div>
                
                <div className="absolute -bottom-6 -right-6 h-20 w-20 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
                  {section.icon}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
