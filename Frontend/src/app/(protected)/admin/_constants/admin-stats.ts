import { Activity, IndianRupee, ShieldCheck, Users2 } from "lucide-react";

export const getAdminStatConfig = (stats: any) => [
  { 
    label: "Throughput", 
    value: stats.totalVisits, 
    sub: "Monthly Visits", 
    icon: Users2, 
    color: "text-primary" 
  },
  { 
    label: "Revenue", 
    value: `₹${Number(stats.totalRevenue).toLocaleString()}`, 
    sub: "Total Earnings", 
    icon: IndianRupee, 
    color: "text-emerald-600" 
  },
  { 
    label: "Clinical", 
    value: stats.activePrescriptions, 
    sub: "Active Rx", 
    icon: Activity, 
    color: "text-amber-600" 
  },
  { 
    label: "Governance", 
    value: stats.totalUsers, 
    sub: "System Users", 
    icon: ShieldCheck, 
    color: "text-sky-600" 
  },
];
