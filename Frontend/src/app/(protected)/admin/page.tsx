import { fetchAdminDashboardData, fetchPatients } from "@/lib/server-api";
import type { Metadata } from "next";
import { AdminCharts } from "./_components/AdminCharts";
import { getAdminStatConfig } from "./_constants/admin-stats";

export const metadata: Metadata = {
  title: "Admin Overview | ArogyaX",
};

import { getUser } from "@/lib/server-auth";

import { UNAUTHORIZED_ROUTE } from "@/lib/app-config";
import { cn } from "@/lib/utils";
import { redirect } from "next/navigation";

export default async function AdminDashboardPage() {
  const user = await getUser();
  if (!user || !user.permissions.canViewAdminDashboard) {
    redirect(UNAUTHORIZED_ROUTE);
  }

  const patients = await fetchPatients();
  const {
    stats,
    monthlyVisits,
    revenue,
    diagnosisDistribution,
    patientFrequency,
  } = await fetchAdminDashboardData(patients);

  const adminStats = getAdminStatConfig(stats);

  return (
    <div className="page-shell animate-fade-in pb-12">
      <header className="mb-8 p-4">
        <p className="text-primary font-bold tracking-widest uppercase text-[10px] mb-2">
          Administrative intelligence
        </p>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
          Clinic Performance Overview
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Operational insights, revenue throughput, and clinical engagement metrics.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 px-4">
        {adminStats.map((item, i) => (
          <div 
            key={i}
            className="rounded-[calc(var(--radius)+2px)] border border-border/80 bg-card p-5 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">{item.label}</span>
              <div className={cn("rounded-2xl bg-muted/50 p-2.5", item.color)}>
                <item.icon className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-2xl font-bold tracking-tight text-foreground">
                {item.value}
              </p>
              <p className="text-[10px] text-muted-foreground mt-1 font-semibold uppercase tracking-wider opacity-70">
                {item.sub}
              </p>
            </div>
          </div>
        ))}
      </section>

      <div className="mt-12 px-4">
        <div className="flex items-center gap-3 mb-8">
          <div className="h-4 w-1 rounded-full bg-primary" />
          <h2 className="text-lg font-bold tracking-tight">Analytical Trends</h2>
        </div>
        <AdminCharts
          initialMonthlyVisits={monthlyVisits}
          initialRevenueData={revenue}
          initialDiagnosisData={diagnosisDistribution}
          initialPatientFrequency={patientFrequency}
        />
      </div>
    </div>
  );
}
