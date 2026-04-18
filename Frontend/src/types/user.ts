export type UserRole =
  | "doctor"
  | "nurse"
  | "reception"
  | "pharmacy"
  | "lab_tech"
  | "hospital_admin"
  | "owner"
  | "auditor";

export type UserStatus = "active" | "inactive" | "suspended";

export interface RolePermissions {
  canViewPatients: boolean;
  canEditPatients: boolean;
  canViewCharting: boolean;
  canEditCharting: boolean;
  canViewPrescriptions: boolean;
  canEditPrescriptions: boolean;
  canViewLabs: boolean;
  canUploadLabs: boolean;
  canEditBilling: boolean;
  canViewBilling: boolean;
  canViewAdminDashboard: boolean;
  canManageUsers: boolean;
  canViewAuditLog: boolean;
  canViewSensitiveData: boolean;
  canDeleteData: boolean;
}

export interface User {
  id: string;
  phone: string;
  name: string;
  role: UserRole;
  status: UserStatus;
  jobTitle?: string;
  passwordType: "admin_created" | "user_created";
  createdTimestamp: string;
  address?: string;
  hireDt?: string;
  managerId?: string;
  avatar?: string;
  permissions: RolePermissions;
}

export const ROLE_LABELS: Record<UserRole, string> = {
  doctor: "Doctor",
  nurse: "Nurse",
  reception: "Reception",
  pharmacy: "Pharmacy",
  lab_tech: "Lab Technician",
  hospital_admin: "Hospital Admin",
  owner: "Owner",
  auditor: "Auditor",
};

export const ALL_ROLES: UserRole[] = [
  "doctor",
  "nurse",
  "reception",
  "pharmacy",
  "lab_tech",
  "hospital_admin",
  "owner",
  "auditor",
];
