"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { DataTablePagination } from "@/components/shared/DataTablePagination";
import { cn } from "@/lib/utils";
import { ROLE_LABELS, UserDataTableProps } from "@/types";
import { flexRender } from "@tanstack/react-table";
import { Activity, Loader2, Pencil, Trash2 } from "lucide-react";

export function UserDataTable({
  table,
  users,
  currentUser,
  onEdit,
  onDeactivate,
  onReactivate,
  isSubmitting,
  canManageUsers,
  canDeleteData,
}: UserDataTableProps) {
  return (
    <>
      <section className="mobile-data-stack md:hidden">
        {users.map((staff) => (
          <Card key={staff.id}>
            <CardContent className="space-y-4 p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-foreground">{staff.name}</p>
                  <p className="text-sm text-muted-foreground">{staff.jobTitle}</p>
                </div>
                <Badge variant={staff.status === "active" ? "success" : "neutral"}>
                  {staff.status}
                </Badge>
              </div>
              <dl className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <dt className="field-label">Role</dt>
                  <dd className="text-foreground">{ROLE_LABELS[staff.role]}</dd>
                </div>
                <div>
                  <dt className="field-label">Phone</dt>
                  <dd className="text-foreground">{staff.phone}</dd>
                </div>
              </dl>
              {canManageUsers && (
                <div className="flex gap-2 pt-2 border-t border-border/40">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => onEdit(staff)}
                  >
                    <Pencil className="mr-2 h-3 w-3" /> Edit
                  </Button>
                  {staff.status === "active" &&
                    currentUser?.id !== staff.id &&
                    canDeleteData && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 text-destructive hover:text-destructive"
                        onClick={() => onDeactivate(staff)}
                      >
                        <Trash2 className="mr-2 h-3 w-3" /> Deactivate
                      </Button>
                    )}
                  {staff.status === "inactive" && canDeleteData && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 text-success hover:text-success"
                      onClick={() => onReactivate(staff)}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Activity className="mr-2 h-3 w-3" />
                      )}
                      Reactivate
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="desktop-data-table mt-4 hidden md:block">
        <Card className="app-surface !p-0 overflow-hidden">
          <CardContent className="!p-0">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header, index) => (
                      <TableHead
                        key={header.id}
                        className={cn(
                          index === 0 && "pl-8",
                          index === headerGroup.headers.length - 1 &&
                            "pr-8 text-right"
                        )}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell, index) => (
                        <TableCell
                          key={cell.id}
                          className={cn(
                            index === 0 && "pl-8",
                            index === row.getVisibleCells().length - 1 && "pr-8"
                          )}
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={table.getAllColumns().length}
                      className="h-24 text-center text-muted-foreground"
                    >
                      No users found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            <div className="border-t border-border/40 bg-muted/5">
              <DataTablePagination table={table} />
            </div>
          </CardContent>
        </Card>
      </section>
    </>
  );
}
