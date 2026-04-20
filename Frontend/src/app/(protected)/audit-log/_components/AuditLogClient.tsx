"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
    Popover,
    PopoverContent,
    PopoverTrigger
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { exportAuditLogsApi, getAuditLogFiltersApi, getAuditLogsApi } from "@/services/apiClient";
import {
    AuditLogClientProps, AuditLogResponse, FilterState
} from "@/types";
import { useQuery } from "@tanstack/react-query";
import {
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable
} from "@tanstack/react-table";
import { format } from "date-fns";
import {
    Calendar as CalendarIcon, FileDown, Search, ShieldCheck, X
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { DateRange } from "react-day-picker";
import { toast } from "sonner";
import { AuditLogExportDialog } from "./dialogs/AuditLogExportDialog";
import { columns } from "./table/AuditLogColumns";
import { AuditLogDataTable } from "./table/AuditLogDataTable";
import { TriStateFilter } from "./table/TriStateFilter";
import { TablePageSkeleton } from "@/components/shared/skeletons/TablePageSkeleton";




export function AuditLogClient({ initialData }: AuditLogClientProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const { data: filterOptions } = useQuery({
    queryKey: ["audit-log-filters"],
    queryFn: getAuditLogFiltersApi,
  });

  const uniqueActions = filterOptions?.actions ?? [];
  const uniqueResources = filterOptions?.resources ?? [];
  const userList = filterOptions?.users ?? [];
  const uniqueUserIds = userList.map(u => u.id);

  const userNameMap = useMemo(() => {
    const map: Record<string, string> = {};
    userList.forEach(u => map[u.id] = u.name);
    return map;
  }, [userList]);

  const [search, setSearch] = useState("");
  const [activeSearch, setActiveSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);

  const [filterStates, setFilterStates] = useState<FilterState>({
    users: {},
    actions: {},
    resources: {},
  });
  
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [exportReason, setExportReason] = useState("");
  const [isExporting, setIsExporting] = useState(false);
  
  const handleExport = async () => {
    if (exportReason.length < 10) {
      toast.error("Please provide a more detailed reason (min 10 characters)");
      return;
    }

    try {
      setIsExporting(true);
      toast.info("Generating compliance report...");
      
      const blob = await exportAuditLogsApi({
        includeUserIds: getArray(filterStates.users, "include"),
        includeActions: getArray(filterStates.actions, "include"),
        includeResources: getArray(filterStates.resources, "include"),
        startDate: dateRange?.from?.toISOString() ?? null,
        endDate: dateRange?.to?.toISOString() ?? null,
        search: activeSearch,
      }, exportReason);

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `arogyax_audit_${format(new Date(), "yyyyMMdd_HHmm")}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success("Audit trail exported and logged successfully");
      setIsExportModalOpen(false);
      setExportReason("");
    } catch (error) {
      console.error("Export failed:", error);
      toast.error("Failed to export audit logs. Please check permissions.");
    } finally {
      setIsExporting(false);
    }
  };
  
  useEffect(() => {
    const timer = setTimeout(() => setActiveSearch(search), 500);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [activeSearch]);

  const [sorting, setSorting] = useState<SortingState>([]);

  const getArray = (map: Record<string, "include" | "exclude" | "none">, val: "include" | "exclude") =>
    Object.entries(map)
      .filter(([_, state]) => state === val)
      .map(([id]) => id);

  const { data: logResponse = initialData, isLoading } = useQuery<AuditLogResponse>({
    queryKey: ["audit-logs", filterStates, dateRange, page, limit, activeSearch],
    queryFn: () =>
      getAuditLogsApi({
        includeUserIds: getArray(filterStates.users, "include"),
        excludeUserIds: getArray(filterStates.users, "exclude"),
        includeActions: getArray(filterStates.actions, "include"),
        excludeActions: getArray(filterStates.actions, "exclude"),
        includeResources: getArray(filterStates.resources, "include"),
        excludeResources: getArray(filterStates.resources, "exclude"),
        startDate: dateRange?.from?.toISOString() ?? null,
        endDate: dateRange?.to?.toISOString() ?? null,
        page,
        limit,
        search: activeSearch,
      }),
    initialData: page === 1 && limit === 20 && !activeSearch ? initialData : undefined,
  });

  const logs = logResponse.items;
  const totalPages = logResponse.pages;

  const toggleFilter = (category: keyof FilterState, value: string) => {
    setFilterStates((prev) => {
      const current = prev[category][value] || "none";
      let next: "include" | "exclude" | "none" = "include";
      if (current === "include") next = "exclude";
      else if (current === "exclude") next = "none";
      return {
        ...prev,
        [category]: { ...prev[category], [value]: next },
      };
    });
    setPage(1);
  };

  const memoColumns = useMemo(() => columns, []);

  const table = useReactTable({
    data: logs,
    columns: memoColumns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    rowCount: logResponse.total,
    state: {
      sorting,
      pagination: {
        pageIndex: page - 1,
        pageSize: limit,
      },
    },
    onSortingChange: setSorting,
    onPaginationChange: (updater) => {
      if (typeof updater === "function") {
        const next = updater({
          pageIndex: page - 1,
          pageSize: limit,
        });
        setPage(next.pageIndex + 1);
        setLimit(next.pageSize);
      }
    },
  });

  const pageNumbers = useMemo(() => {
    const range = [];
    const maxVisible = 5;
    let start = Math.max(1, page - 2);
    let end = Math.min(totalPages, start + maxVisible - 1);
    
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }
    
    for (let i = start; i <= end; i++) {
      range.push(i);
    }
    return range;
  }, [page, totalPages]);

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
            Governance trail
          </Badge>
          <div className="space-y-2">
            <p className="page-kicker">Operational traceability</p>
            <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Audit Log
            </h1>
            <p className="max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
              Review system activity with total administrative visibility. Track every action, resource, and actor across the entire practice.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="gap-2">
            {isLoading ? <span className="animate-pulse">Fetching...</span> : (
              <>
                <ShieldCheck className="h-3.5 w-3.5" />
                {logResponse.total} events
              </>
            )}
          </Badge>
          {page > 1 && <Badge variant="outline">Page {page} of {totalPages}</Badge>}
        </div>
        <div className="flex shrink-0 gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="h-9 gap-2"
            onClick={() => setIsExportModalOpen(true)}
          >
            <FileDown className="h-4 w-4" />
            <span className="hidden sm:inline">Export Audit Trail</span>
          </Button>
        </div>
      </section>

      <section className="toolbar-row flex-col items-stretch gap-3 lg:grid lg:grid-cols-12 lg:items-center">
        <div className="relative w-full lg:col-span-3">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search details..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:col-span-9 lg:flex lg:justify-end lg:gap-2">
          <div className="flex gap-2 lg:w-fit">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date"
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal lg:w-[280px]",
                    !dateRange && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange?.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "LLL dd, y")} -{" "}
                        {format(dateRange.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(dateRange.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Pick a date range</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange?.from}
                  selected={dateRange}
                  onSelect={(d) => {
                    setDateRange(d);
                    setPage(1);
                  }}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4 lg:w-auto">
          <TriStateFilter
            label="Users"
            category="users"
            items={uniqueUserIds}
            states={filterStates.users}
            onToggle={toggleFilter}
            renderLabel={(id) => userNameMap[id] || id}
          />
          <TriStateFilter
            label="Actions"
            category="actions"
            items={uniqueActions}
            states={filterStates.actions}
            onToggle={toggleFilter}
          />
          <TriStateFilter
            label="Resources"
            category="resources"
            items={uniqueResources}
            states={filterStates.resources}
            onToggle={toggleFilter}
          />
          </div>
        </div>

        {(Object.values(filterStates).some((cat) => 
          typeof cat === "object" && Object.values(cat).some((s) => s !== "none")
        ) || dateRange) && (
          <div className="lg:col-span-12 flex items-center justify-end">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setFilterStates({ users: {}, actions: {}, resources: {} });
                setDateRange(undefined);
                setPage(1);
              }}
              className="h-8 gap-2 text-xs text-muted-foreground hover:text-foreground"
            >
              <X className="h-3 w-3" />
              Clear all filters
            </Button>
          </div>
        )}
      </section>

      <AuditLogDataTable 
        table={table}
        isLoading={isLoading}
        totalEntries={logResponse.total}
        currentPage={page}
        totalPages={totalPages}
        setPage={setPage}
        limit={limit}
        setLimit={setLimit}
        pageNumbers={pageNumbers}
      />

      <div className="h-20" />

      <AuditLogExportDialog 
        open={isExportModalOpen}
        onOpenChange={setIsExportModalOpen}
        reason={exportReason}
        onReasonChange={setExportReason}
        isExporting={isExporting}
        onExport={handleExport}
      />
    </div>
  );
}

