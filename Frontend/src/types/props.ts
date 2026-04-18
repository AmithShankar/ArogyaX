/**
 * Centralized component props types.
 * All component-level interface definitions live here so that
 * the src/app and src/components trees remain interface-free.
 */

import { ColumnDef, Table as ReactTable } from "@tanstack/react-table";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import React, { ReactNode } from "react";

import {
    AuditLogEntry,
    AuditLogResponse, ChartEntry, DashboardStat, Invoice,
    InvoiceWithPatient, LabEntry, Patient,
    PatientSummary, Prescription, PrescriptionEntry, RolePermissions,
    User, UserRole
} from "./index";

// ─── Layout ─────────────────────────────────────────────────────────────────

export interface AppLayoutProps {
  children: ReactNode;
}

export interface WorkflowPulseProps {
  chartsCount: number;
  labsCount: number;
  revenue?: string;
}

export interface DashboardHeroProps {
  highlights: string[];
  stats: DashboardStat[];
}

export interface StatsGridProps {
  stats: DashboardStat[];
}

export interface PatientSearchProps {
  patients: Patient[];
}

// ─── Dashboard Role Extras ───────────────────────────────────────────────────

/** Invoice extended with a resolved patient name for UI display */
export interface InvoiceWithPatientName extends Invoice {
  patientName: string;
}

/** Prescription extended with a resolved patient name for UI display */
export interface PrescriptionWithPatientName extends Prescription {
  patientName: string;
}

export interface AdminExtraProps {
  recentInvoices: InvoiceWithPatientName[];
  totalRevenue: number;
  monthRevenue: number;
}

export interface PharmacyExtraProps {
  prescriptions: PrescriptionWithPatientName[];
}

export interface DoctorExtraProps {
  recentCharts: ChartEntry[];
  patients: Patient[];
}

export interface NurseExtraProps {
  vitals: ChartEntry[];
  patients: Patient[];
}

export interface LabTechExtraProps {
  labs: ChartEntry[];
  patients: Patient[];
}

export interface OwnerExtraProps {
  logs: AuditLogEntry[];
}

export interface AuditorExtraProps {
  logs: AuditLogEntry[];
}

export interface ReceptionExtraProps {
  recentPatients: Patient[];
}

// ─── Stats Config ────────────────────────────────────────────────────────────

export interface StatsConfigParams {
  role: UserRole;
  patientsCount: number;
  recentChartsCount: number;
  activePrescriptionsCount: number;
  recentLabsCount: number;
  recentVitalsCount: number;
  recentPatientsCount: number;
  prescriptionsCount: number;
  allChartsCount: number;
  totalRevenue: number;
  visitEntriesCount: number;
  auditTotal: number;
}

// ─── Patient List ────────────────────────────────────────────────────────────

export interface PatientListClientProps {
  initialPatients: Patient[];
  permissions: RolePermissions | null;
}

// ─── Patient Profile ─────────────────────────────────────────────────────────

export interface PatientProfileClientProps {
  id: string;
  user: User | null;
  permissions: RolePermissions | null;
  patient: Patient;
  initialCharts: ChartEntry[];
  initialPrescriptions: Prescription[];
  initialInvoices: Invoice[];
  initialSummary: PatientSummary | null;
}

export interface PatientProfileHeaderProps {
  patient: Patient;
  currentPatient: Patient;
  permissions: RolePermissions | null;
  user: User | null;
  summaryLoading: boolean;
  onBack: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onGenerateSummary: () => void;
}

export interface PatientStatsCardsProps {
  charts: ChartEntry[];
  prescriptions: Prescription[];
  invoices: Invoice[];
}

export interface PatientSummaryProps {
  summary: PatientSummary | null;
  summaryLoading?: boolean;
}

export interface PatientEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  patient: Patient;
  onUpdate: (data: Partial<Patient>) => Promise<void>;
}

export interface PatientDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  patientName: string;
  onDelete: () => Promise<void>;
  isDeleting: boolean;
}

// ─── Patient Tabs ────────────────────────────────────────────────────────────

export interface BillingTabProps {
  id: string;
  user: User | null;
  permissions: RolePermissions | null;
  invoices: Invoice[];
  billingDialog: boolean;
  setBillingDialog: (open: boolean) => void;
  setInvoices: React.Dispatch<React.SetStateAction<Invoice[]>>;
  handleUpdateInvoiceStatus: (id: string, status: "paid" | "rejected") => void;
  updatingInvoiceId: string | null;
  billTable: ReactTable<Invoice>;
  billColumns: ColumnDef<Invoice>[];
}

export interface InvoiceFormProps {
  patientId: string;
  onSuccess: (invoice: Invoice) => void;
  onCancel: () => void;
}

export interface GetInvoiceColumnsProps {
  permissions: RolePermissions | null;
  user: User | null;
  updatingInvoiceId: string | null;
  handleUpdateInvoiceStatus: (id: string, status: "paid" | "rejected") => void;
}

export interface LabsTabProps {
  id: string;
  permissions: RolePermissions | null;
  labEntries: ChartEntry[];
  labDialog: boolean;
  setLabDialog: (open: boolean) => void;
  labFile: File | null;
  setLabFile: (file: File | null) => void;
  labLoading: boolean;
  setLabLoading: (loading: boolean) => void;
  setCharts: React.Dispatch<React.SetStateAction<ChartEntry[]>>;
  handlePreview: (url: string) => void;
  labTable: ReactTable<ChartEntry>;
  labColumns: ColumnDef<ChartEntry>[];
  router: AppRouterInstance;
}

export interface GetLabColumnsProps {
  handlePreview: (url: string) => void;
}

export interface ReportPreviewDialogProps {
  previewUrl: string | null;
  previewType: "image" | "pdf" | null;
  onClose: () => void;
  user: User | null;
}

export interface PrescriptionsTabProps {
  id: string;
  user: User | null;
  permissions: RolePermissions | null;
  prescriptions: Prescription[];
  rxDialog: boolean;
  setRxDialog: (open: boolean) => void;
  setPrescriptions: React.Dispatch<React.SetStateAction<Prescription[]>>;
  handleTogglePrescriptionStatus: (id: string, status: string) => void;
  handleDeletePrescription: (id: string) => void;
  rxTable: import("@tanstack/react-table").Table<Prescription>;
  rxColumns: import("@tanstack/react-table").ColumnDef<Prescription>[];
}

export interface PrescriptionFormProps {
  patientId: string;
  onSuccess: (prescription: Prescription) => void;
  onCancel: () => void;
}

export interface GetRxColumnsProps {
  permissions: RolePermissions | null;
  user: User | null;
  handleTogglePrescriptionStatus: (id: string, status: string) => void;
  handleDeletePrescription: (id: string) => void;
}

export interface HistoryTabProps {
  id: string;
  user: User | null;
  permissions: RolePermissions | null;
  charts: ChartEntry[];
  chartFilter: string;
  setChartFilter: (filter: string) => void;
  chartDialog: boolean;
  setChartDialog: (open: boolean) => void;
  handleDeleteChartEntry: (id: string) => void;
  handlePreview: (url: string) => void;
  setCharts: React.Dispatch<React.SetStateAction<ChartEntry[]>>;
  router: AppRouterInstance;
}

export interface ChartEntryFormProps {
  patientId: string;
  onSuccess: (entry: ChartEntry) => void;
  onCancel: () => void;
}

export interface CurrentVisitTabProps {
  charts: ChartEntry[];
}

// ─── Labs Module ─────────────────────────────────────────────────────────────

export interface LabsClientProps {
  permissions: RolePermissions | null;
  initialLabs: LabEntry[];
}

export interface LabsDataTableProps {
  table: import("@tanstack/react-table").Table<LabEntry>;
  onPreview: (url: string) => void;
}

export interface GetLabsColumnsProps {
  onPreview: (url: string) => void;
}

export interface LabPreviewDialogProps {
  previewUrl: string | null;
  onClose: () => void;
  userRole?: string;
}

// ─── Prescriptions Module ────────────────────────────────────────────────────

export interface PrescriptionsClientProps {
  user: User | null;
  initialRx: PrescriptionEntry[];
}

export interface PrescriptionDataTableProps {
  table: import("@tanstack/react-table").Table<PrescriptionEntry>;
  user: User | null;
  selectedIds: Set<string>;
  toggleSelect: (id: string) => void;
  columnsCount: number;
}

export interface GetPrescriptionsColumnsProps {
  user: User | null;
  permissions: RolePermissions | null;
  selectedIds: Set<string>;
  toggleSelect: (id: string) => void;
  handleCompleteCourse: (rx: PrescriptionEntry) => void;
}

export interface BulkDispenseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedIds: Set<string>;
  allRx: PrescriptionEntry[];
  billAmount: string;
  setBillAmount: (amount: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isDispensing: boolean;
}

// ─── Billing Module ──────────────────────────────────────────────────────────

export interface BillingDataTableProps {
  table: import("@tanstack/react-table").Table<InvoiceWithPatient>;
  isLoading: boolean;
  search: string;
}

export interface GetBillingColumnsProps {
  onPreview: (invoice: InvoiceWithPatient) => void;
  onDelete: (invoice: InvoiceWithPatient) => void;
  permissions: RolePermissions | null;
  currentUser: User | null;
}

export interface InvoiceDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoiceToDelete: InvoiceWithPatient | null;
  onConfirm: () => void;
  isDeleting: boolean;
}

export interface InvoicePreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedInvoice: InvoiceWithPatient | null;
  onPrint: (invoice: InvoiceWithPatient) => void;
  currentUser: User | null;
}

// ─── Users Module ────────────────────────────────────────────────────────────

export interface UserManagementClientProps {
  initialUsers: User[];
}

export interface UserDataTableProps {
  table: import("@tanstack/react-table").Table<User>;
  users: User[];
  currentUser: User | null;
  onEdit: (u: User) => void;
  onDeactivate: (u: User) => void;
  onReactivate: (u: User) => void;
  isSubmitting: boolean;
  canManageUsers: boolean;
  canDeleteData: boolean;
}

export interface GetUserColumnsProps {
  onEdit: (user: User) => void;
  onDeactivate: (user: User) => void;
  onReactivate: (user: User) => void;
  currentUser: User | null;
  isSubmitting: boolean;
}

export interface UserFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isEditing: boolean;
  name: string;
  setName: (v: string) => void;
  phone: string;
  setPhone: (v: string) => void;
  role: UserRole;
  setRole: (v: UserRole) => void;
  jobTitle: string;
  setJobTitle: (v: string) => void;
  generatedPassword: string;
  isSubmitting: boolean;
  onSubmit: (e: React.FormEvent) => void;
  allRoles: UserRole[];
}

export interface UserDeactivateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
  onConfirm: () => Promise<void>;
  isSubmitting: boolean;
}

// ─── Audit Log ───────────────────────────────────────────────────────────────

export interface AuditLogClientProps {
  initialData: AuditLogResponse;
}

export interface AuditLogExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reason: string;
  onReasonChange: (reason: string) => void;
  isExporting: boolean;
  onExport: () => void;
}

export interface AuditLogDataTableProps {
  table: import("@tanstack/react-table").Table<AuditLogEntry>;
  isLoading: boolean;
  totalEntries: number;
  currentPage: number;
  totalPages: number;
  setPage: (page: number | ((prev: number) => number)) => void;
  limit: number;
  setLimit: (limit: number) => void;
  pageNumbers: number[];
}

// ─── Admin / Charts ──────────────────────────────────────────────────────────

export interface AdminChartsProps {
  initialMonthlyVisits: unknown[];
  initialRevenueData: unknown[];
  initialDiagnosisData: unknown[];
  initialPatientFrequency: unknown[];
}

// ─── Components ──────────────────────────────────────────────────────────────

export interface PatientDataTableProps {
  table: import("@tanstack/react-table").Table<Patient>;
}

export interface PatientRegisterDialogProps {
  trigger?: React.ReactNode;
  onSuccess?: () => void;
}

// ─── UI Primitive Components ──────────────────────────────────────────────────

export interface ClinicalGridProps {
  size?: number;
  id?: string;
  className?: string;
  opacity?: number;
}

export interface EcgLineProps {
  className?: string;
  /** pixels per second the trace advances */
  speed?: number;
}
