export interface Invoice {
  id: string;
  patientId: string;
  name: string;
  amount: number;
  status: "pending" | "paid" | "void" | "rejected";
  comments?: string;
  date: string;
}

export interface InvoiceWithPatient extends Invoice {
  patientName: string;
  patientPhone?: string;
}
