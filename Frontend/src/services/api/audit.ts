import { AuditLogFilters, AuditLogResponse } from "@/types";
import { buildRequestInit, buildUrl, clientApi, formatDetail } from "./base";
import { ApiRequestError } from "./error";

export const getAuditLogsApi = (params: {
  includeUserIds?: string[];
  excludeUserIds?: string[];
  includeResources?: string[];
  excludeResources?: string[];
  includeActions?: string[];
  excludeActions?: string[];
  startDate?: string | null;
  endDate?: string | null;
  page?: number;
  limit?: number;
  search?: string;
}) => {
  const query = new URLSearchParams();
  if (params.search) query.append("search", params.search);
  if (params.includeUserIds?.length)
    params.includeUserIds.forEach((id) => query.append("include_user_ids", id));
  if (params.excludeUserIds?.length)
    params.excludeUserIds.forEach((id) => query.append("exclude_user_ids", id));
  if (params.includeResources?.length)
    params.includeResources.forEach((r) => query.append("include_resources", r));
  if (params.excludeResources?.length)
    params.excludeResources.forEach((r) => query.append("exclude_resources", r));
  if (params.includeActions?.length)
    params.includeActions.forEach((a) => query.append("include_actions", a));
  if (params.excludeActions?.length)
    params.excludeActions.forEach((a) => query.append("exclude_actions", a));
  if (params.startDate) query.append("start_date", params.startDate);
  if (params.endDate) query.append("end_date", params.endDate);
  if (params.page) query.append("page", params.page.toString());
  if (params.limit) query.append("limit", params.limit.toString());

  return clientApi<AuditLogResponse>(`/audit-log?${query.toString()}`);
};

export const getAuditLogFiltersApi = () =>
  clientApi<AuditLogFilters>("/audit-log/filters");

export const exportAuditLogsApi = async (
  params: {
    includeUserIds?: string[];
    includeResources?: string[];
    includeActions?: string[];
    startDate?: string | null;
    endDate?: string | null;
    search?: string;
  },
  reason: string,
) => {
  const query = new URLSearchParams();
  query.append("reason", reason);
  if (params.search) query.append("search", params.search);
  if (params.includeUserIds?.length)
    params.includeUserIds.forEach((id) => query.append("include_user_ids", id));
  if (params.includeResources?.length)
    params.includeResources.forEach((r) => query.append("include_resources", r));
  if (params.includeActions?.length)
    params.includeActions.forEach((a) => query.append("include_actions", a));
  if (params.startDate) query.append("start_date", params.startDate);
  if (params.endDate) query.append("end_date", params.endDate);

  const response = await fetch(buildUrl(`/audit-log/export?${query.toString()}`), buildRequestInit());
  
  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    const message = payload?.errors?.[0]?.message ?? formatDetail(payload?.detail) ?? "Export failed";
    throw new ApiRequestError(message, response.status);
  }

  return response.blob();
};
