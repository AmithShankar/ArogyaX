import { Clock, Database, FileText, ShieldCheck } from "lucide-react";

export const LOGIN_FEATURES = [
  {
    icon: ShieldCheck,
    label: "Audit Integrity",
    desc: "AES-256 encryption with automated clinical audit trails",
    color: "text-blue-500",
  },
  {
    icon: Database,
    label: "Zero-Latency Sync",
    desc: "Real-time record updates across all facility units",
    color: "text-indigo-500",
  },
  {
    icon: FileText,
    label: "FHIR Integrated",
    desc: "Native support for standardized medical data formats",
    color: "text-primary",
  },
  {
    icon: Clock,
    label: "99.9% Uptime SLA",
    desc: "Fault-tolerant, multi-zone redundant architecture",
    color: "text-emerald-500",
  },
];
