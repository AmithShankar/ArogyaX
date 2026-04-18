"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { PatientDataTableProps } from "@/types";
import { flexRender } from "@tanstack/react-table";
import { ChevronRight, MapPin, Phone, UsersRound } from "lucide-react";
import { useRouter } from "next/navigation";

export function PatientDataTable({ table }: PatientDataTableProps) {
  const router = useRouter();
  const { rows } = table.getRowModel();

  return (
    <>
      <section className="mobile-data-stack md:hidden">
        {rows.map((row) => {
          const patient = row.original;
          return (
            <Card
              key={patient.id}
              className="cursor-pointer border-border/80"
              onClick={() => router.push(`/patients/${patient.id}`)}
            >
              <CardContent className="space-y-4 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {patient.name}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {patient.age} yrs | {patient.gender}
                    </p>
                  </div>
                  <Badge variant="outline">
                    {patient.patientId || patient.id.slice(0, 8)}
                  </Badge>
                </div>
                <dl className="grid gap-3 text-sm">
                  <div className="flex items-center gap-2 text-foreground">
                    <Phone className="h-4 w-4 text-primary" />
                    <span>{patient.phone}</span>
                  </div>
                  <div className="flex items-start gap-2 text-muted-foreground">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span className="line-clamp-2">{patient.address}</span>
                  </div>
                </dl>
              </CardContent>
            </Card>
          );
        })}
      </section>

      <section className="desktop-data-table mt-4 hidden flex-1 md:block">
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
                {rows.length ? (
                  rows.map((row) => (
                    <TableRow
                      key={row.id}
                      className="cursor-pointer"
                      onClick={() => router.push(`/patients/${row.original.id}`)}
                    >
                      {row.getVisibleCells().map((cell, index) => (
                        <TableCell 
                          key={cell.id}
                          className={cn(
                            index === 0 && "pl-8",
                            index === row.getVisibleCells().length - 1 && "pr-4"
                          )}
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                      <TableCell className="w-10 pr-8">
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell 
                      colSpan={table.getAllColumns().length + 1} 
                      className="h-24 text-center"
                    >
                      No patients found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </section>

      {rows.length === 0 && (
        <div className="py-20 text-center">
          <EmptyState
            icon={UsersRound}
            title="No patients found"
            description="Try a different search term or register the first patient record for this workspace."
            compact
            className="mx-auto max-w-sm"
          />
        </div>
      )}
    </>
  );
}
