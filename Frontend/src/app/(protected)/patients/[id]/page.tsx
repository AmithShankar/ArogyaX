import {
    fetchPatient,
    fetchPatientCharts,
    fetchPatientInvoices,
    fetchPatientPrescriptions,
    fetchPatientSummary
} from "@/lib/server-api";
import { getUser } from "@/lib/server-auth";
import type { Metadata } from "next";
import { PatientProfileClient } from "./_components/PatientProfileClient";

import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  try {
    const patient = await fetchPatient(id);
    if (!patient) return { title: "Patient Record | ArogyaX" };
    return { title: `${patient.name} | ArogyaX` };
  } catch {
    return { title: "Patient Record | ArogyaX" };
  }
}

export default async function PatientProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getUser();
  const permissions = user?.permissions ?? null;
  const patient = await fetchPatient(id);
  if (!patient) return notFound();

  // Fetch additional data in parallel but with individual error handling to prevent 500 from crashing the whole page
  const [charts, prescriptions, invoices] = await Promise.all([
    permissions?.canViewCharting
      ? fetchPatientCharts(id).catch((err) => {
          console.error("Error fetching charts:", err);
          return [];
        })
      : Promise.resolve([]),
    permissions?.canViewPrescriptions
      ? fetchPatientPrescriptions(id).catch((err) => {
          console.error("Error fetching prescriptions:", err);
          return [];
        })
      : Promise.resolve([]),
    permissions?.canViewBilling
      ? fetchPatientInvoices(id).catch((err) => {
          console.error("Error fetching invoices:", err);
          return [];
        })
      : Promise.resolve([]),
  ]);

  return (
    <PatientProfileClient
      id={id}
      user={user}
      permissions={permissions}
      patient={patient}
      initialCharts={charts}
      initialPrescriptions={prescriptions}
      initialInvoices={invoices}
      initialSummary={null}
    />
  );
}
