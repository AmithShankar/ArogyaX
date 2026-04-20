"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { DataTablePagination } from "@/components/shared/DataTablePagination";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { PrescriptionDataTableProps } from "@/types";
import { flexRender } from "@tanstack/react-table";
import { format as formatDate } from "date-fns";
import { CheckCheck, ChevronRight, Pill } from "lucide-react";

export function PrescriptionDataTable({
  table,
  user,
  selectedIds,
  toggleSelect,
  columnsCount,
}: PrescriptionDataTableProps) {
  return (
    <>
      <section className="mobile-data-stack md:hidden">
        {table.getRowModel().rows.map((row) => (
          <Card key={row.original.id}>
            <CardContent className="space-y-4 p-4">
              <div className="flex items-start justify-between">
                <div className="flex gap-3">
                  {user?.role === "pharmacy" && row.original.status === "active" && (
                    <div
                      className={`mt-1 h-5 w-5 cursor-pointer rounded border transition-colors flex items-center justify-center ${
                        selectedIds.has(row.original.id)
                          ? "bg-primary border-primary"
                          : "border-muted-foreground/30 hover:border-primary"
                      }`}
                      onClick={() => toggleSelect(row.original.id)}
                    >
                      {selectedIds.has(row.original.id) && (
                        <CheckCheck className="h-4 w-4 text-white" />
                      )}
                    </div>
                  )}
                  <div>
                    <p className="font-bold text-foreground">
                      {row.original.patientName}
                    </p>
                    <p className="text-sm font-medium text-primary">
                      {row.original.medication}
                    </p>
                  </div>
                </div>
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
              </div>
              <div className="flex items-center justify-between pt-2 border-t text-[10px] uppercase font-bold text-muted-foreground">
                <span>Dr. {row.original.prescribedBy}</span>
                <span>
                  {formatDate(new Date(row.original.createdDt), "MMM dd, yyyy")}
                </span>
              </div>
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
                          index === headerGroup.headers.length - 1 && "pr-8"
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
                    <TableHead className="w-10 pr-8" />
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id}>
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
                      <TableCell className="w-10 pr-8">
                        <ChevronRight className="h-4 w-4 text-muted-foreground/40" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columnsCount + 1}
                      className="py-12 text-center"
                    >
                      <EmptyState
                        icon={Pill}
                        title="No prescriptions found"
                        description="Adjust your search or status tab to find matching records."
                        compact
                        className="mx-auto max-w-sm"
                      />
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
