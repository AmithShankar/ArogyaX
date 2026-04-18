import { fetchAllLabEntries, fetchPatients } from "@/lib/server-api";
import { getUser } from "@/lib/server-auth";
import type { Metadata } from "next";
import { LabsClient } from "./_components/LabsClient";

export const metadata: Metadata = {
  title: "Labs | ArogyaX",
};

export default async function LabsPage() {
  const user = await getUser();
  const permissions = user?.permissions ?? null;
  const patients = await fetchPatients();
  const initialLabs = await fetchAllLabEntries(patients);

  return <LabsClient permissions={permissions} initialLabs={initialLabs} />;
}
