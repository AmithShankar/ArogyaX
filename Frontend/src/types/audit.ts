import { UserRole } from "./user";

export interface AuditLogEntry {
  id: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  action: string;
  resource: string;
  resourceId?: string;
  details: string;
  timestamp: string;
}

export interface AuditLogResponse {
  items: AuditLogEntry[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface AuditLogFilters {
  actions: string[];
  resources: string[];
  users: { id: string; name: string }[];
}

export interface FilterState {
  users: Record<string, "include" | "exclude" | "none">;
  actions: Record<string, "include" | "exclude" | "none">;
  resources: Record<string, "include" | "exclude" | "none">;
}

export interface TriStateFilterProps {
  label: string;
  category: keyof FilterState;
  items: string[];
  states: Record<string, "include" | "exclude" | "none">;
  onToggle: (category: keyof FilterState, value: string) => void;
  renderLabel?: (value: string) => string;
}



