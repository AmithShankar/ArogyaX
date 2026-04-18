import { Patient, PatientSummary } from "@/types";
import { clientApi } from "./base";

export const createPatientApi = (payload: {
  name: string;
  phone: string;
  address?: string;
  dateOfBirth: string;
  gender: string;
}) =>
  clientApi<Patient>("/patients", {
    method: "POST",
    body: payload,
  });

export const updatePatientApi = (
  patientId: string,
  payload: {
    name?: string;
    phone?: string;
    address?: string;
    dateOfBirth?: string;
    gender?: string;
  },
) =>
  clientApi<Patient>(`/patients/${patientId}`, {
    method: "PUT",
    body: payload,
  });

export const deletePatientApi = (patientId: string) =>
  clientApi<string>(`/patients/${patientId}`, {
    method: "DELETE",
  });

export const generateSummaryApi = (patientId: string) =>
  clientApi<PatientSummary>(`/patients/${patientId}/summary/generate`, {
    method: "POST",
  });
