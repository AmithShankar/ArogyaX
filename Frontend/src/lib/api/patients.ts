import { ChartEntry, Invoice, InvoiceWithPatient, LabEntry, Patient, PatientSummary, Prescription, PrescriptionEntry } from "@/types";
import { safeServerApi, serverApi } from "./base";

export async function fetchPatients(search = ""): Promise<Patient[]> {
  const query = search ? `?search=${encodeURIComponent(search)}` : "";
  return serverApi<Patient[]>(`/patients${query}`);
}

export async function fetchPatient(patientId: string): Promise<Patient | null> {
  return safeServerApi<Patient>(`/patients/${patientId}`);
}

export async function fetchPatientCharts(patientId: string): Promise<ChartEntry[]> {
  return serverApi<ChartEntry[]>(`/patients/${patientId}/charts`);
}

export async function fetchPatientPrescriptions(patientId: string): Promise<Prescription[]> {
  return serverApi<Prescription[]>(`/patients/${patientId}/prescriptions`);
}

export async function fetchPatientInvoices(patientId: string): Promise<Invoice[]> {
  return serverApi<Invoice[]>(`/patients/${patientId}/invoices`);
}

export async function fetchPatientSummary(patientId: string): Promise<PatientSummary | null> {
  return safeServerApi<PatientSummary>(`/patients/${patientId}/summary`);
}

export async function fetchAllCharts(): Promise<ChartEntry[]> {
  return serverApi<ChartEntry[]>("/charts");
}

export async function fetchAllPrescriptions(): Promise<Prescription[]> {
  return serverApi<Prescription[]>("/prescriptions");
}

export async function fetchAllInvoices(): Promise<InvoiceWithPatient[]> {
  return serverApi<InvoiceWithPatient[]>("/billing");
}

export async function fetchAllPatientPrescriptions(patients: Patient[]): Promise<PrescriptionEntry[]> {
  const prescriptions = await fetchAllPrescriptions();
  const patientMap = new Map<string, string>(patients.map((p) => [p.id, p.name]));

  return prescriptions.map((rx) => ({
    ...rx,
    patientName: patientMap.get(rx.patientId) || "Unknown",
  }));
}

export async function fetchAllPatientInvoices(patients: Patient[]): Promise<InvoiceWithPatient[]> {
  const invoices = await fetchAllInvoices();
  const patientMap = new Map<string, string>(patients.map((p) => [p.id, p.name]));

  return invoices.map((invoice) => ({
    ...invoice,
    patientName: invoice.patientName || patientMap.get(invoice.patientId) || "Unknown",
  }));
}

export async function fetchAllLabEntries(patients: Patient[]): Promise<LabEntry[]> {
  const charts = await fetchAllCharts();
  const patientMap = new Map<string, string>(patients.map((p) => [p.id, p.name]));

  return charts
    .filter((entry) => entry.type === "lab")
    .map((entry) => ({
      ...entry,
      patientName: patientMap.get(entry.patientId) || "Unknown",
    }));
}
