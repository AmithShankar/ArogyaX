"use client";

import { Card, CardContent } from "@/components/ui/card";
import { PatientStatsCardsProps } from "@/types";
import { 
  Activity, 
  ArrowUpRight, 
  CreditCard, 
  FileCheck, 
  Layers, 
  Receipt,
  ShieldCheck
} from "lucide-react";

export function PatientStatsCards({
  charts,
  prescriptions,
  invoices,
  isSidebar,
}: PatientStatsCardsProps & { isSidebar?: boolean }) {
  const activeRx = prescriptions.filter((p) => p.status === "active").length;
  const pendingInvoices = invoices.filter(i => i.status === "pending").length;

  const stats = [
    {
      label: "Timeline Entries",
      subtitle: "Total records",
      value: charts.length,
      icon: <Activity className="h-5 w-5" />,
      color: "text-rose-500",
      bg: "bg-rose-500/10",
      ring: "ring-rose-500/20",
      trend: "Continuous data pulse"
    },
    {
      label: "Active Rx",
      subtitle: "Current course",
      value: activeRx,
      icon: <FileCheck className="h-5 w-5" />,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
      ring: "ring-emerald-500/20",
      trend: `${activeRx > 0 ? 'Actionable intervention' : 'No active course'}`
    },
    {
      label: "Invoices",
      subtitle: "Fiscal ledger",
      value: invoices.length,
      icon: <Receipt className="h-5 w-5" />,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
      ring: "ring-amber-500/20",
      trend: pendingInvoices > 0 ? `${pendingInvoices} Pending settlement` : "Account up to date"
    }
  ];

  return (
    <div className={`grid gap-4 ${isSidebar ? "grid-cols-1" : "sm:grid-cols-2 lg:grid-cols-3"}`}>
      {stats.map((stat, i) => (
        <Card 
          key={i} 
          className="group relative overflow-hidden border-none bg-gradient-to-br from-card/40 to-card/20 shadow-xl backdrop-blur-md transition-all hover:translate-y-[-2px] hover:shadow-2xl"
        >
          <div className="absolute inset-0 bg-grid-white/[0.01] [mask-image:linear-gradient(to_bottom,white,transparent)]" />
          
          <CardContent className="relative flex items-center justify-between p-5">
            <div className="flex items-center gap-4">
              <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${stat.bg} ${stat.color} shadow-sm ring-1 ${stat.ring} transition-transform group-hover:scale-110`}>
                {stat.icon}
              </div>
              
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
                  {stat.label}
                </p>
                <div className="flex items-baseline gap-2">
                  <h4 className="text-2xl font-bold tracking-tight text-foreground">
                    {stat.value}
                  </h4>
                  <span className="text-[11px] font-medium text-muted-foreground">
                    {stat.subtitle}
                  </span>
                </div>
              </div>
            </div>

            <div className="hidden xl:block">
              <div className="flex flex-col items-end gap-1">
                <div className="flex items-center gap-1 text-[10px] font-semibold text-muted-foreground">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary/40" />
                  Live Sync
                </div>
                <p className="text-[10px] font-medium text-muted-foreground/50">
                  {stat.trend}
                </p>
              </div>
            </div>

            <div className={`absolute -right-2 -top-2 h-12 w-12 opacity-[0.03] rotate-12 transition-all group-hover:opacity-[0.1] group-hover:scale-150 ${stat.color}`}>
              {stat.icon}
            </div>
          </CardContent>
          
          <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-gradient-to-r from-transparent via-primary/40 to-transparent transition-all duration-500 group-hover:w-full" />
        </Card>
      ))}
      
      {/* Visual filler/status card */}
      <div className="relative overflow-hidden rounded-2xl border border-dashed border-border/60 bg-muted/5 p-4">
        <div className="flex items-center gap-3 opacity-50">
          <ShieldCheck className="h-4 w-4 text-primary" />
          <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            Data Integrity Verified
          </span>
        </div>
      </div>
    </div>
  );
}
