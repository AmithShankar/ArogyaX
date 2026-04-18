import { AuditLogResponse } from "@/types";
import { serverApi } from "./base";

export async function fetchAuditLogs(page = 1, limit = 20) {
  const query = `?page=${page}&limit=${limit}`;
  return serverApi<AuditLogResponse>(`/audit-log${query}`);
}
