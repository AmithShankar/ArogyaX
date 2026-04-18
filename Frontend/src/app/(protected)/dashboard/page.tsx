import {
    fetchAllPatientInvoices,
    fetchAllPatientPrescriptions,
    fetchAuditLogs, fetchPatientCharts, fetchPatients
} from "@/lib/server-api";
import { getUser } from "@/lib/server-auth";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { DashboardHero } from "./_components/layout/DashboardHero";
import { WorkflowPulse } from "./_components/layout/WorkflowPulse";
import { AdminExtra } from "./_components/roles/AdminExtra";
import { AuditorExtra } from "./_components/roles/AuditorExtra";
import { DoctorExtra } from "./_components/roles/DoctorExtra";
import { LabTechExtra } from "./_components/roles/LabTechExtra";
import { NurseExtra } from "./_components/roles/NurseExtra";
import { OwnerExtra } from "./_components/roles/OwnerExtra";
import { PharmacyExtra } from "./_components/roles/PharmacyExtra";
import { ReceptionExtra } from "./_components/roles/ReceptionExtra";
import { PatientSearch } from "./_components/search/PatientSearch";
import { processDashboardData } from "./_utils/dashboard-data";
import { getStatsConfig } from "./_utils/stats-config";

export const metadata: Metadata = {
  title: "Operations Dashboard | ArogyaX",
};

import { AuditLogResponse, InvoiceWithPatient } from "@/types";

export default async function DashboardPage() {
  const user = await getUser();
  if (!user) {
    redirect("/login");
  }

  const permissions = user.permissions;
  const patients = permissions.canViewPatients ? await fetchPatients() : [];

  const [allCharts, prescriptions, invoices, auditLogs] = await Promise.all([
    permissions.canViewCharting
      ? Promise.all(
          patients.map((patient) => fetchPatientCharts(patient.id)),
        ).then((groups) => groups.flat())
      : Promise.resolve([]),
    permissions.canViewPrescriptions
      ? fetchAllPatientPrescriptions(patients)
      : Promise.resolve([]),
    permissions.canViewBilling
      ? fetchAllPatientInvoices(patients)
      : (Promise.resolve([]) as Promise<InvoiceWithPatient[]>),
    permissions.canViewAuditLog ? fetchAuditLogs() : Promise.resolve({ items: [], total: 0, page: 1, limit: 10, pages: 1 } as AuditLogResponse),
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

  const extraMap = {
    doctor: <DoctorExtra recentCharts={recentCharts} patients={patients} />,
    nurse: <NurseExtra vitals={recentVitals} patients={patients} />,
    reception: <ReceptionExtra recentPatients={recentPatients} />,
    pharmacy: <PharmacyExtra prescriptions={prescriptions} />,
    lab_tech: <LabTechExtra labs={recentLabs} patients={patients} />,
    hospital_admin: (
      <AdminExtra
        recentInvoices={recentInvoices}
        totalRevenue={totalRevenue}
        monthRevenue={currentMonthRevenue}
      />
    ),
    owner: <OwnerExtra logs={auditData.items ?? []} />,
    auditor: <AuditorExtra logs={auditData.items ?? []} />,
  };

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

      {extraMap[user.role] ?? null}
    </div>
  );
}

