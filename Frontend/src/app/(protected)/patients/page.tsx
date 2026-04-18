import { fetchPatients } from "@/lib/server-api";
import { getUser } from "@/lib/server-auth";
import type { Metadata } from "next";
import { PatientListClient } from "./_components/PatientListClient";

export const metadata: Metadata = {
  title: "Patient Directory | ArogyaX",
};

export default async function PatientListPage() {
  const user = await getUser();
  const permissions = user?.permissions ?? null;
  const data = await fetchPatients();

  return <PatientListClient permissions={permissions} initialPatients={data} />;
}
