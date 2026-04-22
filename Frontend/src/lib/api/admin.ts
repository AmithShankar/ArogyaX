import { DashboardStats, Patient } from "@/types";
import { serverApi } from "./base";

function formatMonth(month: number, year: number) {
  return new Date(year, month - 1, 1).toLocaleString("en-US", {
    month: "short",
  });
}

function formatTypeLabel(value: string) {
  return value
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export async function fetchAdminDashboardData(patients?: Patient[]) {
  const [stats, monthlyVisits, revenue, diagnosisDistribution, patientFrequency] =
    await Promise.all([
      serverApi<DashboardStats>("/admin/stats"),
      serverApi<Array<{ year: number; month: number; count: number }>>(
        "/admin/monthly-visits",
      ),
      serverApi<Array<{ year: number; month: number; total: number }>>("/admin/revenue"),
      serverApi<Array<{ type: string; count: number }>>("/admin/diagnosis-distribution"),
      serverApi<Array<{ visits: string; count: number }>>("/admin/patient-frequency"),
    ]);

  return {
    stats,
    monthlyVisits: monthlyVisits.map((entry) => ({
      month: formatMonth(entry.month, entry.year),
      visits: entry.count,
    })),
    revenue: revenue.map((entry) => ({
      month: formatMonth(entry.month, entry.year),
      revenue: entry.total,
    })),
    diagnosisDistribution: diagnosisDistribution.map((entry) => ({
      name: formatTypeLabel(entry.type),
      value: entry.count,
    })),
    patientFrequency,
  };
}
