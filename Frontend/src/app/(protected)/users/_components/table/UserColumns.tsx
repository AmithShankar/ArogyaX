"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GetUserColumnsProps, ROLE_LABELS, User } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { Activity, ArrowUpDown, Pencil, Trash2 } from "lucide-react";

export const getUserColumns = ({
  onEdit,
  onDeactivate,
  onReactivate,
  currentUser,
  isSubmitting
}: GetUserColumnsProps): ColumnDef<User>[] => [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="-ml-4 h-8 data-[state=open]:bg-accent"
      >
        <span>Name</span>
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div className="font-medium">{row.original.name}</div>,
  },
  {
    accessorKey: "role",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="-ml-4 h-8"
      >
        <span>Role</span>
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <Badge variant="outline">{ROLE_LABELS[row.original.role]}</Badge>
    ),
  },
  {
    accessorKey: "phone",
    header: "Phone",
  },
  {
    accessorKey: "jobTitle",
    header: "Job Title",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge variant={row.original.status === "active" ? "success" : "neutral"}>
        {row.original.status}
      </Badge>
    ),
  },
  {
    id: "actions",
    header: () => <div className="text-right">Actions</div>,
    cell: ({ row }) => {
      const staff = row.original;
      return (
        <div className="flex justify-end gap-2 px-6">
          {currentUser?.permissions?.canManageUsers && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
              onClick={() => onEdit(staff)}
            >
              <Pencil className="h-3.5 w-3.5" />
            </Button>
          )}
          {currentUser?.permissions?.canDeleteData &&
            staff.id !== currentUser?.id &&
            staff.status === "active" && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-destructive hover:bg-destructive/10"
                onClick={() => onDeactivate(staff)}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            )}
          {currentUser?.permissions?.canDeleteData && staff.status === "inactive" && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-success hover:bg-success/10"
              onClick={() => onReactivate(staff)}
              disabled={isSubmitting}
            >
              <Activity className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
      );
    },
  },
];
