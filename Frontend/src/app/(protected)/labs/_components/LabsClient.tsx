"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { LabEntry, LabsClientProps } from "@/types";
import {
    ColumnFiltersState, getCoreRowModel, getFilteredRowModel, getSortedRowModel, SortingState, useReactTable
} from "@tanstack/react-table";
import { FlaskConical, Search, Upload, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { LabPreviewDialog } from "./LabPreviewDialog";
import { getLabsColumns } from "./LabsColumns";
import { LabsDataTable } from "./LabsDataTable";



export function LabsClient({ permissions, initialLabs }: LabsClientProps) {
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [labs] = useState<LabEntry[]>(initialLabs);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const columns = useMemo(() => getLabsColumns({
    onPreview: (url) => setPreviewUrl(url)
  }), []);

  const table = useReactTable({
    data: labs,
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
  });

  if (!mounted) return null;

  return (
    <div className="page-shell animate-fade-in">
       <section className="page-hero">
        <div className="space-y-4">
          <Badge variant="outline" className="w-fit">
            Diagnostic Records
          </Badge>
          <div className="space-y-2">
            <p className="page-kicker">Clinical data management</p>
            <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Lab Reports
            </h1>
            <p className="max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
              Access patient diagnostic reports and clinical lab results.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {permissions?.canUploadLabs && user?.role !== "auditor" && (
            <Button size="sm" className="bg-primary hover:bg-primary/90 shadow-md">
              <Upload className="h-4 w-4 mr-2" /> Upload Results
            </Button>
          )}
        </div>
      </section>

      <section className="mt-4">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div className="flex flex-1 flex-wrap items-center gap-3">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search report details or patient..."
                value={globalFilter ?? ""}
                onChange={(e) => setGlobalFilter(e.target.value)}
                className="h-10 rounded-xl border-border/70 bg-background/50 pl-9 pr-4 transition-all focus:bg-background focus:ring-4 focus:ring-primary/5"
              />
            </div>
            
            <Select
              value={(table.getColumn("userName")?.getFilterValue() as string) ?? "all"}
              onValueChange={(value) => 
                table.getColumn("userName")?.setFilterValue(value === "all" ? undefined : value)
              }
            >
              <SelectTrigger className="h-10 w-[180px] rounded-xl border-border/70 bg-background/50">
                <SelectValue placeholder="Requested By: All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Providers</SelectItem>
                {Array.from(new Set(labs.map(l => l.userName))).map(name => (
                  <SelectItem key={name} value={name}>
                    Dr. {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {(globalFilter || columnFilters.length > 0) && (
              <Button
                variant="ghost"
                onClick={() => {
                  setGlobalFilter("");
                  setColumnFilters([]);
                }}
                className="h-10 gap-2 px-3 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
                Clear
              </Button>
            )}
          </div>
          
          <Badge variant="secondary" className="gap-2 h-9 px-3">
            <FlaskConical className="h-3.5 w-3.5" />
            {table.getFilteredRowModel().rows.length} Results
          </Badge>
        </div>

        <LabsDataTable table={table} onPreview={(url) => setPreviewUrl(url)} />
      </section>

      <LabPreviewDialog 
        previewUrl={previewUrl} 
        onClose={() => setPreviewUrl(null)} 
        userRole={user?.role}
      />
    </div>
  );
}
