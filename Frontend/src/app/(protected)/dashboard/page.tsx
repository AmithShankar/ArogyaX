import {
    fetchAllCharts,
    fetchAllPatientInvoices,
    fetchAllPatientPrescriptions,
    fetchAuditLogs,
    fetchPatients
} from "@/lib/server-api";
import { getUser } from "@/lib/server-auth";
import { AuditLogResponse, InvoiceWithPatient } from "@/types";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { DashboardHero } from "./_components/layout/DashboardHero";
import { WorkflowPulse } from "./_components/layout/WorkflowPulse";
import { DashboardRoleSlot } from "./_components/roles/DashboardRoleSlot";
import { PatientSearch } from "./_components/search/PatientSearch";
import { processDashboardData } from "./_utils/dashboard-data";
import { getStatsConfig } from "./_utils/stats-config";

export const metadata: Metadata = {
  title: "Operations Dashboard | ArogyaX",
};

export default async function DashboardPage() {
  const user = await getUser();
  if (!user) {
    redirect("/login");
  }

  const permissions = user.permissions;
  const patients = permissions.canViewPatients ? await fetchPatients() : [];

  const [allCharts, prescriptions, invoices, auditLogs] = await Promise.all([
    permissions.canViewCharting ? fetchAllCharts() : Promise.resolve([]),
    permissions.canViewPrescriptions
      ? fetchAllPatientPrescriptions(patients)
      : Promise.resolve([]),
    permissions.canViewBilling
      ? fetchAllPatientInvoices(patients)
      : (Promise.resolve([]) as Promise<InvoiceWithPatient[]>),
    permissions.canViewAuditLog
      ? fetchAuditLogs()
      : Promise.resolve({ items: [], total: 0, page: 1, limit: 10, pages: 1 } as AuditLogResponse),
  ]);

  const {
    recentCharts,
    recentVitals,
    recentLabs,
    recentPatients,
    recentInvoices,
    totalRevenue,
    currentMonthRevenue,
    activePrescriptionsCount,
  } = processDashboardData(patients, allCharts, prescriptions, invoices);

  const auditData = auditLogs;
  const stats = getStatsConfig({
    role: user.role,
    patientsCount: patients.length,
    recentChartsCount: recentCharts.length,
    activePrescriptionsCount,
    recentLabsCount: recentLabs.length,
    recentVitalsCount: recentVitals.length,
    recentPatientsCount: recentPatients.length,
    prescriptionsCount: prescriptions.length,
    allChartsCount: allCharts.length,
    totalRevenue,
    visitEntriesCount: allCharts.filter((e) => e.type === "visit").length,
    auditTotal: auditData.total ?? 0,
  });

  const overviewHighlights = [
    `${patients.length} active patients`,
    `${recentCharts.length} recent chart updates`,
    `${activePrescriptionsCount} active medication items`,
  ];

  return (
    <div className="page-shell animate-fade-in">
      <section className="page-hero">
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
          <DashboardHero highlights={overviewHighlights} stats={stats} />

          <div className="flex flex-col gap-3">
            <WorkflowPulse
              chartsCount={recentCharts.length}
              labsCount={recentLabs.length}
              revenue={permissions.canViewBilling ? `₹${currentMonthRevenue.toLocaleString()}` : undefined}
            />

            {permissions.canViewPatients && (
              <PatientSearch patients={patients} />
            )}
          </div>
        </div>
      </section>

      <DashboardRoleSlot
        role={user.role}
        recentCharts={recentCharts}
        patients={patients}
        recentVitals={recentVitals}
        recentPatients={recentPatients}
        prescriptions={prescriptions}
        recentLabs={recentLabs}
        recentInvoices={recentInvoices}
        totalRevenue={totalRevenue}
        currentMonthRevenue={currentMonthRevenue}
        auditLogs={auditData.items ?? []}
      />
    </div>
  );
}
