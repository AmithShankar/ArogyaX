import { ChartEntry, Prescription } from "@/types";
import { clientApi } from "./base";

export const createChartEntryApi = (
  patientId: string,
  entry: { comments: string; type: ChartEntry["type"] },
) =>
  clientApi<ChartEntry>(`/patients/${patientId}/charts`, {
    method: "POST",
    body: entry,
  });

export const deleteChartEntryApi = (patientId: string, entryId: string) =>
  clientApi<string>(`/patients/${patientId}/charts/${entryId}`, {
    method: "DELETE",
  });

export const uploadLabFileApi = (patientId: string, file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  return clientApi<ChartEntry>(`/patients/${patientId}/charts/upload`, {
    method: "POST",
    body: formData,
  });
};

export const createPrescriptionApi = (
  patientId: string,
  prescription: Pick<
    Prescription,
    "medication" | "dosage" | "frequency" | "duration" | "status"
  >,
) =>
  clientApi<Prescription>(`/patients/${patientId}/prescriptions`, {
    method: "POST",
    body: prescription,
  });

export const updatePrescriptionApi = (
  patientId: string,
  rxId: string,
  payload: Partial<Prescription>,
) =>
  clientApi<Prescription>(`/patients/${patientId}/prescriptions/${rxId}`, {
    method: "PATCH",
    body: payload,
  });

export const deletePrescriptionApi = (patientId: string, rxId: string) =>
  clientApi<string>(`/patients/${patientId}/prescriptions/${rxId}`, {
    method: "DELETE",
  });
