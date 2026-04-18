import { ChartEntry, InvoiceWithPatient, Patient, Prescription } from "@/types";

export function processDashboardData(
  patients: Patient[],
  allCharts: ChartEntry[],
  prescriptions: Prescription[],
  invoices: InvoiceWithPatient[],
) {
  const recentCharts = [...allCharts]
    .sort((a, b) => new Date(b.createdDt).getTime() - new Date(a.createdDt).getTime())
    .slice(0, 5);

  const recentVitals = allCharts
    .filter((entry) => entry.type === "vitals")
    .sort((a, b) => new Date(b.createdDt).getTime() - new Date(a.createdDt).getTime())
    .slice(0, 5);

  const recentLabs = allCharts
    .filter((entry) => entry.type === "lab")
    .sort((a, b) => new Date(b.createdDt).getTime() - new Date(a.createdDt).getTime())
    .slice(0, 6);

  const recentPatients = [...patients]
    .sort((a, b) => new Date(b.createdTimestamp).getTime() - new Date(a.createdTimestamp).getTime())
    .slice(0, 5);

  const recentInvoices = [...invoices]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  const totalRevenue = invoices.reduce((sum, invoice) => sum + Number(invoice.amount), 0);

  const currentMonthRevenue = invoices
    .filter((invoice) => {
      const invoiceDate = new Date(invoice.date);
      const now = new Date();
      return (
        invoiceDate.getMonth() === now.getMonth() &&
        invoiceDate.getFullYear() === now.getFullYear()
      );
    })
    .reduce((sum, invoice) => sum + Number(invoice.amount), 0);

  const activePrescriptionsCount = prescriptions.filter(p => p.status === "active").length;

  return {
    recentCharts,
    recentVitals,
    recentLabs,
    recentPatients,
    recentInvoices,
    totalRevenue,
    currentMonthRevenue,
    activePrescriptionsCount,
  };
}
