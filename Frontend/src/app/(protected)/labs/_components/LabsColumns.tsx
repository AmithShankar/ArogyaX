"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GetLabsColumnsProps, LabEntry } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { format as formatDate } from "date-fns";
import { ArrowUpDown, ExternalLink, Eye } from "lucide-react";



export const getLabsColumns = ({ onPreview }: GetLabsColumnsProps): ColumnDef<LabEntry>[] => [
  {
    accessorKey: "patientName",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="-ml-4 h-8 data-[state=open]:bg-accent"
      >
        Patient Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <span className="font-bold text-foreground">
        {row.original.patientName}
      </span>
    ),
  },
  {
    accessorKey: "comments",
    header: "Diagnostic Comments",
    cell: ({ row }) => (
      <span className="text-sm italic text-muted-foreground group-hover:text-foreground transition-colors duration-300">
        "{row.original.comments}"
      </span>
    ),
  },
  {
    accessorKey: "createdDt",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="-ml-4 h-8 data-[state=open]:bg-accent"
      >
        Date
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <span className="text-sm font-medium text-muted-foreground">
        {formatDate(new Date(row.original.createdDt), "dd MMM yyyy")}
      </span>
    ),
  },
  {
    accessorKey: "userName",
    header: "Requested By",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary">
          {row.original.userName.charAt(0)}
        </div>
        <span className="text-xs font-medium truncate">Dr. {row.original.userName}</span>
      </div>
    ),
  },
  {
    id: "actions",
    header: () => <div className="text-right">Action</div>,
    cell: ({ row }) => (
      <div className="flex items-center justify-end gap-1">
        {row.original.upload ? (
          <div className="flex justify-end gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-primary hover:bg-primary/10 rounded-lg"
              title="Preview Report"
              onClick={() => onPreview(row.original.upload!)}
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:bg-muted rounded-lg"
              title="Open in new tab"
              onClick={() => window.open(row.original.upload!, '_blank')}
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <Badge variant="neutral" className="text-[9px] uppercase font-bold opacity-30">No File</Badge>
        )}
      </div>
    ),
  },
];
