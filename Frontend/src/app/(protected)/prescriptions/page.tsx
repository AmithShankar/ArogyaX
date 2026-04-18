import { fetchAllPatientPrescriptions, fetchPatients } from "@/lib/server-api";
import { getUser } from "@/lib/server-auth";
import type { Metadata } from "next";
import { PrescriptionsClient } from "./_components/PrescriptionsClient";

export const metadata: Metadata = {
  title: "Prescriptions | ArogyaX",
};

export default async function PrescriptionsPage() {
  const user = await getUser();
  const patients = await fetchPatients();
  const initialRx = await fetchAllPatientPrescriptions(patients);

  return <PrescriptionsClient user={user} initialRx={initialRx} />;
}
