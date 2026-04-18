"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GetInvoiceColumnsProps, Invoice } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { ArrowUpDown, CheckCircle2, XCircle } from "lucide-react";

export const getInvoiceColumns = ({
  permissions,
  user,
  updatingInvoiceId,
  handleUpdateInvoiceStatus,
}: GetInvoiceColumnsProps): ColumnDef<Invoice>[] => [
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
    accessorKey: "name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="-ml-4 h-8"
      >
        <span>Invoice Description</span>
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <span className="font-bold text-foreground">{row.original.name}</span>,
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
        ₹{Number(row.original.amount).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
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
        {row.original.status === "pending" && permissions?.canEditBilling && user?.role !== "auditor" && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-success hover:bg-success/10"
              onClick={() => handleUpdateInvoiceStatus(row.original.id, "paid")}
              disabled={updatingInvoiceId === row.original.id}
              title="Mark as Paid"
            >
              <CheckCircle2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive hover:bg-destructive/10"
              onClick={() => handleUpdateInvoiceStatus(row.original.id, "rejected")}
              disabled={updatingInvoiceId === row.original.id}
              title="Reject Invoice"
            >
              <XCircle className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>
    ),
  },
];
