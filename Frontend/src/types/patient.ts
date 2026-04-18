export interface Patient {
  id: string;
  patientId?: string;
  name: string;
  phone: string;
  address: string;
  age: number;
  dateOfBirth: string;
  createdTimestamp: string;
  referredBy?: string;
  invoiceId?: string;
  gender: "male" | "female" | "other";
}

export interface PatientSummary {
  chiefComplaint: string;
  pastMedicalHistory: string;
  recentDevelopments: string;
  currentAssessment: string;
}
