export const formatDosage = (dosage: string) => {
  if (/^\d+$/.test(dosage)) {
    return `${dosage}mg`;
  }
  return dosage;
};

export const FREQUENCY_LABELS: Record<string, string> = {
  QD: "Once Daily",
  BID: "Twice Daily",
  TID: "Three Times Daily",
  QID: "Four Times Daily",
  QHS: "At Bedtime",
  PRN: "As Needed",
  Q4H: "Every 4 Hours",
  Q8H: "Every 8 Hours",
};

export const FREQUENCIES = [
  { value: "QD", label: "Once Daily (QD)" },
  { value: "BID", label: "Twice Daily (BID)" },
  { value: "TID", label: "Three Times Daily (TID)" },
  { value: "QID", label: "Four Times Daily (QID)" },
  { value: "QHS", label: "At Bedtime (QHS)" },
  { value: "PRN", label: "As Needed (PRN)" },
  { value: "Q4H", label: "Every 4 Hours (Q4H)" },
  { value: "Q8H", label: "Every 8 Hours (Q8H)" },
];

export const DURATION_UNITS = [
  { value: "days", label: "Days" },
  { value: "weeks", label: "Weeks" },
  { value: "months", label: "Months" },
  { value: "indefinite", label: "Indefinite / Ongoing" },
];

export const typeBadgeVariant = (type: string): "info" | "success" | "secondary" | "warning" | "outline" => {
  switch (type) {
    case "visit":
      return "info";
    case "vitals":
      return "success";
    case "lab":
      return "secondary";
    case "note":
      return "warning";
    default:
      return "outline";
  }
};
