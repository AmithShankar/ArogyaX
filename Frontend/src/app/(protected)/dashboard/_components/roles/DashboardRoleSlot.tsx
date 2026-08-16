"use client";

import dynamic from "next/dynamic";
import type {
  AuditLogEntry,
  ChartEntry,
  InvoiceWithPatient,
  Patient,
  PrescriptionWithPatientName,
  UserRole,
} from "@/types";

// Dynamically import each role component — only the active role's chunk is downloaded
const DoctorExtra = dynamic(() =>
  import("./DoctorExtra").then((m) => m.DoctorExtra)
);
const NurseExtra = dynamic(() =>
  import("./NurseExtra").then((m) => m.NurseExtra)
);
const ReceptionExtra = dynamic(() =>
  import("./ReceptionExtra").then((m) => m.ReceptionExtra)
);
const PharmacyExtra = dynamic(() =>
  import("./PharmacyExtra").then((m) => m.PharmacyExtra)
);
const LabTechExtra = dynamic(() =>
  import("./LabTechExtra").then((m) => m.LabTechExtra)
);
const AdminExtra = dynamic(() =>
  import("./AdminExtra").then((m) => m.AdminExtra)
);
const OwnerExtra = dynamic(() =>
  import("./OwnerExtra").then((m) => m.OwnerExtra)
);
const AuditorExtra = dynamic(() =>
  import("./AuditorExtra").then((m) => m.AuditorExtra)
);

export interface DashboardRoleSlotProps {
  role: UserRole;
  // doctor / nurse / lab_tech
  recentCharts: ChartEntry[];
  patients: Patient[];
  // nurse specific
  recentVitals: ChartEntry[];
  // reception specific
  recentPatients: Patient[];
  // pharmacy specific
  prescriptions: PrescriptionWithPatientName[];
  // lab_tech specific
  recentLabs: ChartEntry[];
  // admin specific
  recentInvoices: InvoiceWithPatient[];
  totalRevenue: number;
  currentMonthRevenue: number;
  // owner / auditor specific
  auditLogs: AuditLogEntry[];
}

export function DashboardRoleSlot({
  role,
  recentCharts,
  patients,
  recentVitals,
  recentPatients,
  prescriptions,
  recentLabs,
  recentInvoices,
  totalRevenue,
  currentMonthRevenue,
  auditLogs,
}: DashboardRoleSlotProps) {
  switch (role) {
    case "doctor":
      return <DoctorExtra recentCharts={recentCharts} patients={patients} />;
    case "nurse":
      return <NurseExtra vitals={recentVitals} patients={patients} />;
    case "reception":
      return <ReceptionExtra recentPatients={recentPatients} />;
    case "pharmacy":
      return <PharmacyExtra prescriptions={prescriptions} />;
    case "lab_tech":
      return <LabTechExtra labs={recentLabs} patients={patients} />;
    case "hospital_admin":
      return (
        <AdminExtra
          recentInvoices={recentInvoices}
          totalRevenue={totalRevenue}
          monthRevenue={currentMonthRevenue}
        />
      );
    case "owner":
      return <OwnerExtra logs={auditLogs} />;
    case "auditor":
      return <AuditorExtra logs={auditLogs} />;
    default:
      return null;
  }
}
