"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChartEntry, GetLabColumnsProps } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, ClipboardList, FileText } from "lucide-react";

export const getLabColumns = ({
  handlePreview,
}: GetLabColumnsProps): ColumnDef<ChartEntry>[] => [
  {
    accessorKey: "createdDt",
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
    accessorKey: "comments",
    header: "Test Details",
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <div className="rounded-full bg-secondary/15 p-2 text-secondary-foreground">
          <ClipboardList className="h-4 w-4" />
        </div>
        <p className="text-sm font-bold text-foreground line-clamp-2">
          {row.original.comments}
        </p>
      </div>
    ),
  },
  {
    accessorKey: "userName",
    header: "Technician",
  },
  {
    id: "report",
    header: "Report",
    cell: ({ row }) => (
      row.original.upload ? (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handlePreview(row.original.upload!)}
          className="h-9 gap-2 rounded-xl bg-primary/10 px-4 text-xs font-black uppercase tracking-widest text-primary hover:bg-primary/20"
        >
          <FileText className="h-3.5 w-3.5" />
          View Lab Report
        </Button>
      ) : (
        <Badge variant="neutral" className="opacity-50">Pending Report</Badge>
      )
    ),
  },
];
