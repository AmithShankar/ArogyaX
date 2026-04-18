"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { actionColors } from "@/data/styleData";
import { cn, getInitials } from "@/lib/utils";
import { AuditLogEntry, ROLE_LABELS, UserRole } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { ArrowUpDown, Settings } from "lucide-react";

export const columns: ColumnDef<AuditLogEntry>[] = [
  {
    accessorKey: "timestamp",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="-ml-4 h-8 data-[state=open]:bg-accent text-xs"
      >
        Timestamp
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="flex flex-col text-xs text-muted-foreground font-medium">
        <span className="text-foreground">{format(new Date(row.original.timestamp), "MMM dd, yyyy")}</span>
        <span className="text-muted-foreground/70">{format(new Date(row.original.timestamp), "hh:mm a")}</span>
      </div>
    ),
  },
  {
    accessorKey: "userName",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="-ml-4 h-8 data-[state=open]:bg-accent text-xs"
      >
        User
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="flex items-center gap-2.5">
        <Avatar className="h-7 w-7 border-border/10 ring-1 ring-border/5">
          <AvatarFallback className="bg-muted text-[10px] font-bold text-foreground/70 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
            {row.original.userName === "System" ? <Settings className="h-3.5 w-3.5" /> : getInitials(row.original.userName)}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col min-w-0">
          <span className="truncate text-sm font-medium">{row.original.userName}</span>
          <span className="text-[10px] text-muted-foreground uppercase tracking-wide">
            {ROLE_LABELS[row.original.userRole as UserRole] || row.original.userRole}
          </span>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "action",
    header: "Action",
    cell: ({ row }) => (
      <Badge variant="secondary" className={cn(actionColors[row.original.action] || "", "text-[10px] font-bold py-0.5 px-2")}>
        {row.original.action}
      </Badge>
    ),
  },
  {
    accessorKey: "resource",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="-ml-4 h-8 data-[state=open]:bg-accent text-xs"
      >
        Resource
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="text-sm font-medium">
        <span className="text-foreground/90">{row.original.resource}</span>
        {row.original.resourceId && (
          <span className="ml-1.5 text-[10px] text-muted-foreground/60 font-mono bg-muted/50 px-1 rounded ring-1 ring-border/5">
            #{row.original.resourceId.slice(0, 8)}
          </span>
        )}
      </div>
    ),
  },
  {
    accessorKey: "details",
    header: "Details",
    cell: ({ row }) => (
      <span className="line-clamp-2 text-sm text-muted-foreground/80 leading-relaxed max-w-[400px]">
        {row.original.details}
      </span>
    ),
  },
];
