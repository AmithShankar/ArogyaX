import { Activity, FileText, FlaskConical, Stethoscope } from "lucide-react";

export type ChartType = "vitals" | "lab" | "note" | "visit";

export const CHART_TYPE_CONFIG: Record<
  ChartType,
  {
    icon: any;
    color: string;
  }
> = {
  vitals: {
    icon: Activity,
    color: "text-rose-500 bg-rose-500/10",
  },
  lab: {
    icon: FlaskConical,
    color: "text-violet-500 bg-violet-500/10",
  },
  note: {
    icon: FileText,
    color: "text-amber-500 bg-amber-500/10",
  },
  visit: {
    icon: Stethoscope,
    color: "text-primary bg-primary/10",
  },
};

export function getChartTypeIcon(type: ChartType) {
  return CHART_TYPE_CONFIG[type].icon;
}

export function getChartTypeColor(type: ChartType) {
  return CHART_TYPE_CONFIG[type].color;
}
