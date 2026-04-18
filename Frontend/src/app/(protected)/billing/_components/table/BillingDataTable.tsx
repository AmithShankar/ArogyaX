"use client";

import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { BillingDataTableProps, InvoiceWithPatient } from "@/types";
import { Cell, flexRender, Header, HeaderGroup, Row } from "@tanstack/react-table";
import { ChevronRight, Receipt as ReceiptIcon } from "lucide-react";

export function BillingDataTable({
  table,
  isLoading,
  search,
}: BillingDataTableProps) {
  const columns = table.getVisibleFlatColumns();

  return (
    <section className="desktop-data-table hidden md:block">
      <Card className="app-surface !p-0 overflow-hidden">
        <CardContent className="!p-0">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup: HeaderGroup<InvoiceWithPatient>) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header: Header<InvoiceWithPatient, unknown>, index: number) => (
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
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell className="pl-8"><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="ml-auto h-4 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                    <TableCell className="pr-8 text-right"><Skeleton className="ml-auto h-8 w-8 rounded-full" /></TableCell>
                  </TableRow>
                ))
              ) : table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row: Row<InvoiceWithPatient>) => (
                  <TableRow 
                    key={row.id} 
                    className="group cursor-default"
                  >
                    {row.getVisibleCells().map((cell: Cell<InvoiceWithPatient, unknown>, index: number) => (
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
                  <TableCell colSpan={columns.length + 1} className="h-24 text-center">
                    <EmptyState
                      icon={ReceiptIcon}
                      title="No invoices found"
                      description={search ? "No results matching your search criteria." : "Generated invoices will appear here."}
                      compact
                      className="py-12 border-0 bg-transparent mx-auto max-w-sm"
                    />
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </section>
  );
}
