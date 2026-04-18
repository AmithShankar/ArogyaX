import { DashboardStat, StatsConfigParams } from "@/types";
import {
    Activity, Calendar, ClipboardList, FlaskConical, Pill, ScrollText, TrendingUp, Users
} from "lucide-react";


export function getStatsConfig({
  role,
  patientsCount,
  recentChartsCount,
  activePrescriptionsCount,
  recentLabsCount,
  recentVitalsCount,
  recentPatientsCount,
  prescriptionsCount,
  allChartsCount,
  totalRevenue,
  visitEntriesCount,
  auditTotal,
}: StatsConfigParams): DashboardStat[] {
  switch (role) {
    case "doctor":
      return [
        { label: "Patients Available", value: patientsCount.toString(), icon: Users, color: "text-primary" },
        { label: "Recent Charts", value: recentChartsCount.toString(), icon: ClipboardList, color: "text-amber-600" },
        { label: "Active Prescriptions", value: activePrescriptionsCount.toString(), icon: Pill, color: "text-emerald-600" },
        { label: "Lab Results", value: recentLabsCount.toString(), icon: FlaskConical, color: "text-violet-600" },
      ];
    case "nurse":
      return [
        { label: "Patients Available", value: patientsCount.toString(), icon: Users, color: "text-primary" },
        { label: "Vitals Recorded", value: recentVitalsCount.toString(), icon: Activity, color: "text-emerald-600" },
        { label: "Chart Feed", value: recentChartsCount.toString(), icon: ClipboardList, color: "text-amber-600" },
      ];
    case "reception":
      return [
        { label: "Registered Patients", value: patientsCount.toString(), icon: Users, color: "text-primary" },
        { label: "Recent Registrations", value: recentPatientsCount.toString(), icon: TrendingUp, color: "text-violet-600" },
        { label: "Front Desk Queue", value: recentPatientsCount.toString(), icon: Calendar as any, color: "text-emerald-600" }, // Import Calendar specifically if needed, or stick to users
      ];
    case "pharmacy":
      return [
        { label: "Active Prescriptions", value: activePrescriptionsCount.toString(), icon: Pill, color: "text-primary" },
        { label: "Total Orders", value: prescriptionsCount.toString(), icon: ClipboardList, color: "text-emerald-600" },
      ];
    case "lab_tech":
      return [
        { label: "Lab Results", value: recentLabsCount.toString(), icon: FlaskConical, color: "text-primary" },
        { label: "Chart Feed", value: allChartsCount.toString(), icon: ClipboardList, color: "text-emerald-600" },
      ];
    case "hospital_admin":
      return [
        { label: "Total Patients", value: patientsCount.toString(), icon: Users, color: "text-primary" },
        { label: "Visit Entries", value: visitEntriesCount.toString(), icon: TrendingUp, color: "text-emerald-600" },
        { label: "Revenue", value: `₹${totalRevenue.toLocaleString()}`, icon: Activity, color: "text-violet-600" },
      ];
    case "owner":
      return [
        { label: "Tracked Events", value: auditTotal.toString(), icon: Users, color: "text-primary" },
        { label: "Total Patients", value: patientsCount.toString(), icon: Activity, color: "text-emerald-600" },
        { label: "Revenue", value: `₹${totalRevenue.toLocaleString()}`, icon: TrendingUp, color: "text-amber-600" },
      ];
    case "auditor":
      return [
        { label: "Total Events", value: auditTotal.toString(), icon: ScrollText, color: "text-primary" },
        { label: "Active Patients", value: patientsCount.toString(), icon: Users, color: "text-emerald-600" },
        { label: "Total Revenue", value: `₹${totalRevenue.toLocaleString()}`, icon: Activity, color: "text-violet-600" },
      ];
    default:
      return [];
  }
}
