"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GetBillingColumnsProps, InvoiceWithPatient } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { ArrowRight, ArrowUpDown, Eye, FileText, Trash2 } from "lucide-react";
import Link from "next/link";

export const getBillingColumns = ({
  onPreview,
  onDelete,
  permissions,
  currentUser
}: GetBillingColumnsProps): ColumnDef<InvoiceWithPatient>[] => [
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
        {row.original.date ? format(new Date(row.original.date), "dd MMM yyyy") : "N/A"}
      </span>
    ),
  },
  {
    accessorKey: "patientName",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="-ml-4 h-8"
      >
        <span>Patient</span>
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-bold text-foreground">{row.original.patientName}</span>
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground/80 font-bold">
          {row.original.patientPhone || "No Phone"}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "name",
    header: "Invoice Name",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <FileText className="h-4 w-4 text-primary/70" />
        <span className="font-medium">{row.original.name}</span>
      </div>
    ),
  },
  {
    accessorKey: "amount",
    header: ({ column }) => (
      <div className="text-right">
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="-mr-4 ml-auto h-8"
        >
          <span>Amount</span>
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      </div>
    ),
    cell: ({ row }) => (
      <div className="text-right font-black text-primary">
        ₹{parseFloat(row.original.amount.toString()).toLocaleString("en-IN", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        })}
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge
        variant={
          row.original.status === "paid" ? "success" : 
          row.original.status === "rejected" ? "destructive" :
          row.original.status === "pending" ? "premium" : "neutral"
        }
        className="font-bold tracking-tight"
      >
        {row.original.status}
      </Badge>
    ),
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => (
      <div className="flex items-center justify-end gap-1 px-4">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-primary hover:bg-primary/10"
          title="View Patient Billing"
          asChild
        >
          <Link href={`/patients/${row.original.patientId}?tab=billing`}>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:bg-muted"
          title="Preview & Print"
          onClick={() => onPreview(row.original)}
        >
          <Eye className="h-4 w-4" />
        </Button>
        {permissions?.canDeleteData && currentUser?.role !== "auditor" && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
            title="Delete Invoice"
            onClick={() => onDelete(row.original)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>
    ),
  },
];
