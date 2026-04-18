"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GetRxColumnsProps, Prescription } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, CheckCircle2, Trash2, XCircle } from "lucide-react";
import { formatDosage, FREQUENCY_LABELS } from "../../../_utils/patient-constants";

export const getRxColumns = ({
  permissions,
  user,
  handleTogglePrescriptionStatus,
  handleDeletePrescription,
}: GetRxColumnsProps): ColumnDef<Prescription>[] => [
  {
    accessorKey: "date",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="-ml-4 h-8"
      >
        <span>Date</span>
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <span className="text-muted-foreground font-medium">
        {new Date(row.original.createdDt).toLocaleDateString()}
      </span>
    ),
  },
  {
    accessorKey: "medication",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="-ml-4 h-8"
      >
        <span>Medication</span>
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-bold text-foreground">{row.original.medication}</span>
        <span className="text-[10px] uppercase font-bold text-muted-foreground/80 tracking-widest">
          {formatDosage(row.original.dosage)} • {FREQUENCY_LABELS[row.original.frequency] || row.original.frequency}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "prescribedBy",
    header: "Prescribed By",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge
        variant={row.original.status === "active" ? "success" : "neutral"}
      >
        {row.original.status}
      </Badge>
    ),
  },
  {
    id: "actions",
    header: () => <div className="text-right">Actions</div>,
    cell: ({ row }) => (
      <div className="flex justify-end gap-2">
        {permissions?.canEditPrescriptions && user?.role !== "auditor" && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => handleTogglePrescriptionStatus(row.original.id, row.original.status)}
              title={row.original.status === "active" ? "Void prescription" : "Activate prescription"}
            >
              {row.original.status === "active" ? <XCircle className="h-4 w-4 text-orange-500" /> : <CheckCircle2 className="h-4 w-4 text-emerald-500" />}
            </Button>
            {permissions?.canDeleteData && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-destructive hover:bg-destructive/10"
                onClick={() => handleDeletePrescription(row.original.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </>
        )}
      </div>
    ),
  },
];
