import { Invoice, InvoiceWithPatient } from "@/types";
import { clientApi } from "./base";

export const createInvoiceApi = (
  patientId: string,
  data: { name: string; amount: number; status: "pending" | "paid" | "void" | "rejected"; comments?: string },
) =>
  clientApi<Invoice>(`/patients/${patientId}/invoices`, {
    method: "POST",
    body: data,
  });

export const updateInvoiceApi = (
  patientId: string,
  invoiceId: string,
  data: { status: "pending" | "paid" | "void" | "rejected" },
) =>
  clientApi<Invoice>(`/patients/${patientId}/invoices/${invoiceId}`, {
    method: "PATCH",
    body: data,
  });

export const deleteInvoiceApi = (patientId: string, invoiceId: string) =>
  clientApi<string>(`/patients/${patientId}/invoices/${invoiceId}`, {
    method: "DELETE",
  });

export const listAllInvoicesApi = () =>
  clientApi<InvoiceWithPatient[]>("/billing");
