"use client";

import {
    Search,
    UsersRound
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import * as React from "react";

import {
    ColumnFiltersState, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, SortingState, useReactTable
} from "@tanstack/react-table";
import { patientColumns } from "./PatientColumns";

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { Patient, PatientListClientProps } from "@/types";
import { PatientDataTable } from "./PatientDataTable";
import { PatientRegisterDialog } from "./PatientRegisterDialog";
import { TablePageSkeleton } from "@/components/shared/skeletons/TablePageSkeleton";

export function PatientListClient({
  permissions,
  initialPatients,
}: PatientListClientProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const [patients, setPatients] = useState<Patient[]>(initialPatients);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const columns = React.useMemo(() => patientColumns, []);

  const table = useReactTable({
    data: patients,
    columns,
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  if (!mounted) {
    return (
      <div className="page-shell">
        <TablePageSkeleton columns={5} rows={12} />
      </div>
    );
  }


  return (
    <div className="page-shell animate-fade-in">
      <section className="page-hero">
        <div className="space-y-4">
          <Badge variant="outline" className="w-fit">
            Patient registry
          </Badge>
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Patients
            </h1>
            <p className="max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
              Manage patient registration and contact details.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Badge variant="secondary" className="gap-2">
            <UsersRound className="h-3.5 w-3.5" />
            {table.getFilteredRowModel().rows.length} visible
          </Badge>
          {permissions?.canEditPatients && (
            <PatientRegisterDialog />
          )}
        </div>
      </section>

      <section className="toolbar-row flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by patient, phone, or ID"
            value={globalFilter ?? ""}
            onChange={(event) => setGlobalFilter(event.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-2">
          <Select
            value={(table.getColumn("gender")?.getFilterValue() as string) ?? "all"}
            onValueChange={(value) =>
              table.getColumn("gender")?.setFilterValue(value === "all" ? undefined : value)
            }
          >
            <SelectTrigger className="h-9 w-[130px]">
              <SelectValue placeholder="All Genders" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Genders</SelectItem>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </section>

      <PatientDataTable table={table} />
    </div>
  );
}
