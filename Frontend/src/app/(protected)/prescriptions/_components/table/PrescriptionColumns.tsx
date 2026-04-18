"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    GetPrescriptionsColumnsProps, PrescriptionEntry
} from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { format as formatDate } from "date-fns";
import { ArrowUpDown, CheckCheck } from "lucide-react";

const formatDosage = (dosage: string) => {
  if (/^\d+$/.test(dosage)) {
    return `${dosage}mg`;
  }
  return dosage;
};

const FREQUENCY_LABELS: Record<string, string> = {
  QD: "Once Daily",
  BID: "Twice Daily",
  TID: "Three Times Daily",
  QID: "Four Times Daily",
  QHS: "At Bedtime",
  PRN: "As Needed",
  Q4H: "Every 4 Hours",
  Q8H: "Every 8 Hours",
};

export const getColumns = ({
  user,
  permissions,
  selectedIds,
  toggleSelect,
  handleCompleteCourse,
}: GetPrescriptionsColumnsProps): ColumnDef<PrescriptionEntry>[] => [
  {
    accessorKey: "patientName",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="-ml-4 h-8 data-[state=open]:bg-accent"
      >
        Patient
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        {user?.role === "pharmacy" && row.original.status === "active" && (
          <div
            className={`h-5 w-5 cursor-pointer rounded border transition-colors flex items-center justify-center ${
              selectedIds.has(row.original.id)
                ? "bg-primary border-primary"
                : "border-muted-foreground/30 hover:border-primary"
            }`}
            onClick={(e) => {
              e.stopPropagation();
              toggleSelect(row.original.id);
            }}
          >
            {selectedIds.has(row.original.id) && (
              <CheckCheck className="h-4 w-4 text-white" />
            )}
          </div>
        )}
        <span className="font-bold text-foreground">
          {row.original.patientName}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "medication",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="-ml-4 h-8 data-[state=open]:bg-accent"
      >
        Medication
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-medium text-primary">
          {row.original.medication}
        </span>
        <span className="text-[10px] text-muted-foreground uppercase">
          {formatDosage(row.original.dosage)} • {row.original.duration}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "frequency",
    header: "Regimen",
    cell: ({ row }) => (
      <div className="text-sm font-medium text-muted-foreground">
        {FREQUENCY_LABELS[row.original.frequency] || row.original.frequency}
      </div>
    ),
  },
  {
    accessorKey: "prescribedBy",
    header: "Provider",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
          {row.original.prescribedBy.charAt(0)}
        </div>
        <span className="text-xs font-medium">Dr. {row.original.prescribedBy}</span>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge
        variant={
          row.original.status === "active"
            ? "success"
            : row.original.status === "dispensed"
            ? "default"
            : "neutral"
        }
      >
        {row.original.status}
      </Badge>
    ),
    filterFn: (row, id, value) => {
      return value === "all" ? true : row.getValue(id) === value;
    },
  },
  {
    accessorKey: "createdDt",
    header: "Issued",
    cell: ({ row }) => (
      <span className="text-xs text-muted-foreground">
        {formatDate(new Date(row.original.createdDt), "dd MMM yyyy")}
      </span>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const rx = row.original;
      const canComplete =
        permissions?.canEditPrescriptions &&
        (user?.role === "doctor" || user?.role === "nurse") &&
        rx.status !== "completed";

      if (!canComplete) return null;

      return (
        <Button
          size="sm"
          variant="ghost"
          className="h-7 px-2 text-xs"
          onClick={() => handleCompleteCourse(rx)}
        >
          <CheckCheck className="mr-1 h-3.5 w-3.5" />
          Complete
        </Button>
      );
    },
  },
];
