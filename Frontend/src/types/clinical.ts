import { UserRole } from "./user";

export interface ChartEntry {
  id: string;
  patientId: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  patientName?: string;
  comments: string;
  type: "visit" | "vitals" | "lab" | "note";
  upload?: string;
  createdDt: string;
}

export interface Prescription {
  id: string;
  patientId: string;
  medication: string;
  dosage: string;
  frequency: string;
  duration: string;
  prescribedBy: string;
  prescribedById: string;
  status: "active" | "completed" | "dispensed";
  createdDt: string;
}

export interface LabEntry extends ChartEntry {
  patientName: string;
}

export interface PrescriptionEntry extends Prescription {
  patientName: string;
}
