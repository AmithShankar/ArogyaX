import { fetchAuditLogs } from "@/lib/server-api";
import { getUser } from "@/lib/server-auth";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Audit Log | ArogyaX",
};

import { UNAUTHORIZED_ROUTE } from "@/lib/app-config";
import { redirect } from "next/navigation";
import { AuditLogClient } from "./_components/AuditLogClient";

export default async function AuditLogPage() {
  const user = await getUser();
  if (!user || !user.permissions.canViewAuditLog) {
    redirect(UNAUTHORIZED_ROUTE);
  }

  const initialData = await fetchAuditLogs();
  return <AuditLogClient initialData={initialData} />;
}
