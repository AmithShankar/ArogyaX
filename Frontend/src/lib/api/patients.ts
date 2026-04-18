import { ChartEntry, Invoice, Patient, PatientSummary, Prescription } from "@/types";
import { safeServerApi, serverApi } from "./base";

export async function fetchPatients(search = "") {
  const query = search ? `?search=${encodeURIComponent(search)}` : "";
  return serverApi<Patient[]>(`/patients${query}`);
}

export async function fetchPatient(patientId: string) {
  return safeServerApi<Patient>(`/patients/${patientId}`);
}

export async function fetchPatientCharts(patientId: string) {
  return serverApi<ChartEntry[]>(`/patients/${patientId}/charts`);
}

export async function fetchPatientPrescriptions(patientId: string) {
  return serverApi<Prescription[]>(`/patients/${patientId}/prescriptions`);
}

export async function fetchPatientInvoices(patientId: string) {
  return serverApi<Invoice[]>(`/patients/${patientId}/invoices`);
}

export async function fetchPatientSummary(patientId: string) {
  return safeServerApi<PatientSummary>(`/patients/${patientId}/summary`);
}

export async function fetchAllPatientPrescriptions(patients: Patient[]) {
  const groups = await Promise.all(
    patients.map(async (patient) => {
      const prescriptions = await fetchPatientPrescriptions(patient.id);
      return prescriptions.map((prescription) => ({
        ...prescription,
        patientName: patient.name,
      }));
    }),
  );

  return groups.flat();
}

export async function fetchAllPatientInvoices(patients: Patient[]) {
  const groups = await Promise.all(
    patients.map(async (patient) => {
      const invoices = await fetchPatientInvoices(patient.id);
      return invoices.map((invoice) => ({
        ...invoice,
        patientName: patient.name,
      }));
    }),
  );

  return groups.flat();
}

export async function fetchAllLabEntries(patients: Patient[]) {
  const groups = await Promise.all(
    patients.map(async (patient) => {
      const charts = await fetchPatientCharts(patient.id);
      return charts
        .filter((entry) => entry.type === "lab")
        .map((entry) => ({
          ...entry,
          patientName: patient.name,
        }));
    }),
  );

  return groups.flat();
}
