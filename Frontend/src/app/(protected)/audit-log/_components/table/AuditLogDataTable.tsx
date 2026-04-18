"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
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
            {!isLoading && logs.length === 0 && (
              <div className="py-20 text-center">
                <EmptyState
                  icon={ScrollText}
                  title="No audit events found"
                  description="Try adjusting your filters or search terms."
                  compact
                  className="mx-auto max-w-sm"
                />
              </div>
            )}
            {isLoading && (
              <div className="py-20 text-center animate-pulse text-muted-foreground flex flex-col items-center gap-2">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                <span className="text-xs font-medium uppercase tracking-wider">Synchronizing Audit Records...</span>
              </div>
            )}
          </CardContent>

          {/* Pagination Toolbar */}
          <div className="flex items-center justify-between border-t border-border/60 bg-muted/20 px-8 py-3">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>Show items</span>
                <Select 
                  value={limit.toString()} 
                  onValueChange={(val) => {
                    setLimit(Number(val));
                    setPage(1);
                  }}
                >
                  <SelectTrigger className="h-8 w-[70px] bg-background">
                    <SelectValue placeholder={limit} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <p className="text-xs text-muted-foreground hidden lg:block border-l pl-4 border-border/60">
                Total {totalEntries} entries found
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => setPage(1)}
                  disabled={currentPage === 1 || isLoading}
                  title="First page"
                >
                  <ChevronsLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => setPage((p: number) => Math.max(1, p - 1))}
                  disabled={currentPage === 1 || isLoading}
                  title="Previous page"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex items-center gap-1 mx-2">
                {pageNumbers.map((n: number) => (
                  <Button
                    key={n}
                    variant={currentPage === n ? "secondary" : "ghost"}
                    size="sm"
                    className={cn(
                      "h-8 w-8 p-0 text-xs transition-all",
                      currentPage === n && "bg-primary text-primary-foreground font-bold hover:bg-primary/90"
                    )}
                    onClick={() => setPage(n)}
                    disabled={isLoading}
                  >
                    {n}
                  </Button>
                ))}
              </div>

              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages || isLoading}
                  title="Next page"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => setPage(totalPages)}
                  disabled={currentPage === totalPages || isLoading}
                  title="Last page"
                >
                  <ChevronsRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
}
