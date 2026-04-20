"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { DataTablePagination } from "@/components/shared/DataTablePagination";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { actionColors } from "@/data/styleData";
import { cn, getInitials } from "@/lib/utils";
import { AuditLogDataTableProps, AuditLogEntry, ROLE_LABELS, UserRole } from "@/types";
import { Cell, flexRender, Row } from "@tanstack/react-table";
import { format } from "date-fns";
import {
    ChevronLeft, ChevronRight,
    ChevronsLeft, ChevronsRight, ScrollText, Settings
} from "lucide-react";

export function AuditLogDataTable({
  table,
  isLoading,
  totalEntries,
  currentPage,
  totalPages,
  setPage,
  limit,
  setLimit,
  pageNumbers,
}: AuditLogDataTableProps) {
  const logs = table.getRowModel().rows;

  return (
    <div className="space-y-6">
      {/* Mobile View */}
      <section className="mobile-data-stack md:hidden">
        {logs.map((row) => {
          const log = row.original;
          return (
            <Card key={log.id}>
              <CardContent className="space-y-4 p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary/10 text-[10px] font-bold text-primary">
                        {log.userName === "System" ? <Settings className="h-3.5 w-3.5" /> : getInitials(log.userName)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{log.userName}</p>
                      <p className="text-xs text-muted-foreground">{ROLE_LABELS[log.userRole as UserRole]}</p>
                    </div>
                  </div>
                  <Badge variant="secondary" className={cn(actionColors[log.action] || "", "text-[10px]")}>
                    {log.action}
                  </Badge>
                </div>
                <p className="text-sm text-foreground">{log.details}</p>
                <dl className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <dt className="field-label text-[10px]">Resource</dt>
                    <dd className="text-foreground text-xs">
                      {log.resource}
                      {log.resourceId ? ` (${log.resourceId})` : ""}
                    </dd>
                  </div>
                  <div>
                    <dt className="field-label text-[10px]">Timestamp</dt>
                    <dd className="text-foreground text-xs">
                      {format(new Date(log.timestamp), "MMM dd, hh:mm a")}
                    </dd>
                  </div>
                </dl>
              </CardContent>
            </Card>
          );
        })}
      </section>

      {/* Desktop View */}
      <section className="desktop-data-table hidden md:block">
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
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {logs.length ? (
                  logs.map((row: Row<AuditLogEntry>) => (
                    <TableRow key={row.original.id} className="group transition-colors hover:bg-muted/30">
                      {row.getVisibleCells().map((cell: Cell<AuditLogEntry, unknown>, index: number) => (
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
                ) : null}
              </TableBody>
            </Table>
            <div className="border-t border-border/40 bg-muted/5">
              <DataTablePagination table={table} />
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
