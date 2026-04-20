"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { LabEntry, LabsDataTableProps } from "@/types";
import { Cell, flexRender, Header, HeaderGroup, Row } from "@tanstack/react-table";
import { format as formatDate } from "date-fns";
import { ChevronRight, Eye, FlaskConical } from "lucide-react";



export function LabsDataTable({ table, onPreview }: LabsDataTableProps) {
  const { rows } = table.getRowModel();

  return (
    <>
      <div className="mobile-data-stack md:hidden">
        {rows.length > 0 ? (
          rows.map((row) => {
            const entry = row.original;
            return (
              <Card key={entry.id} className="border-border/50 bg-card/50">
                <CardContent className="p-4 space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold text-foreground">{entry.patientName}</p>
                      <p className="text-[10px] text-muted-foreground uppercase font-semibold">
                        {formatDate(new Date(entry.createdDt), "dd MMM yyyy")}
                      </p>
                    </div>
                    <Badge variant="outline" className="text-[10px] bg-primary/5 text-primary border-primary/20">Lab</Badge>
                  </div>
                  <p className="text-sm italic text-muted-foreground">"{entry.comments}"</p>
                  <div className="pt-3 border-t flex items-center justify-between">
                    <span className="text-[11px] font-medium text-muted-foreground">Dr. {entry.userName}</span>
                    {entry.upload ? (
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 text-primary hover:bg-primary/10"
                          onClick={() => onPreview(entry.upload!)}
                        >
                          <Eye className="h-3.5 w-3.5 mr-1" /> View
                        </Button>
                      </div>
                    ) : (
                      <span className="text-[10px] text-muted-foreground/30 font-bold uppercase">No File</span>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })
        ) : (
          <EmptyState
            icon={FlaskConical}
            title="No diagnostic matches found"
            description="Try widening your search or check again after new samples are processed."
            compact
            className="mx-auto max-w-sm"
          />
        )}
      </div>

      <section className="desktop-data-table hidden md:block">
        <Card className="app-surface !p-0 overflow-hidden">
          <CardContent className="!p-0">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup: HeaderGroup<LabEntry>) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header: Header<LabEntry, unknown>, index: number) => (
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
                {rows.length ? (
                  rows.map((row: Row<LabEntry>) => (
                    <TableRow key={row.id}>
                      {row.getVisibleCells().map((cell: Cell<LabEntry, unknown>, index: number) => (
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
                    <TableCell colSpan={table.getAllColumns().length + 1} className="py-20 text-center">
                      <EmptyState
                        icon={FlaskConical}
                        title="No diagnostic matches found"
                        description="Try widening your search or check again after new samples are processed."
                        compact
                        className="mx-auto max-w-sm"
                      />
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            <div className="border-t bg-muted/5 p-4">
              <DataTablePagination table={table} />
            </div>
          </CardContent>
        </Card>
      </section>
    </>
  );
}
