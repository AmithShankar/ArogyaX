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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createInvoiceApi, updatePrescriptionApi } from "@/services/apiClient";
import { PrescriptionEntry, PrescriptionsClientProps } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    ColumnFiltersState, getCoreRowModel, getFilteredRowModel, getSortedRowModel, SortingState, useReactTable
} from "@tanstack/react-table";
import {
    ClipboardList, Receipt,
    Search, X
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

// New modular imports
import { BulkDispenseDialog } from "./dialogs/BulkDispenseDialog";
import { getColumns } from "./table/PrescriptionColumns";
import { PrescriptionDataTable } from "./table/PrescriptionDataTable";


export function PrescriptionsClient({
  user,
  initialRx,
}: PrescriptionsClientProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [tab, setTab] = useState<string>(
    user?.role === "pharmacy" ? "active" : "all"
  );
  
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isBulkDialogOpen, setIsBulkDialogOpen] = useState(false);
  const [billAmount, setBillAmount] = useState<string>("0.00");
  const [isDispensing, setIsDispensing] = useState(false);

  const permissions = user?.permissions ?? null;

  const { data: allRx = initialRx } = useQuery({
    queryKey: ["prescriptions"],
    queryFn: async () => initialRx,
    initialData: initialRx,
  });

  const fulfillMutation = useMutation({
    mutationFn: async ({
      patientId,
      rxIds,
      amount,
      medications,
      status, 
    }: {
      patientId: string;
      rxIds: string[];
      amount: number;
      medications: string[];
      status: "dispensed" | "completed";
    }) => {
      if (status === "dispensed") {
        await createInvoiceApi(patientId, {
          name: `Pharmacy Order: ${medications.join(", ")}`,
          amount,
          status: "pending"
        });
      }

      await Promise.all(
        rxIds.map(id => updatePrescriptionApi(patientId, id, { status }))
      );
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["prescriptions"] });
      setSelectedIds(new Set());
      setIsBulkDialogOpen(false);
      
      toast.success("Action successful", {
        description: variables.status === "dispensed" ? `Unified invoice generated for ₹${variables.amount}. Redirecting to billing...` : "Prescription courses marked as completed.",
      });

      if (variables.status === "dispensed") {
        setTimeout(() => {
          router.push(`/patients/${variables.patientId}?tab=billing`);
        }, 1000);
      }
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Action failed");
    },
  });

  const handleBulkDispenseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedIds.size === 0) return;
    
    const patientId = allRx.find(r => selectedIds.has(r.id))?.patientId;
    if (!patientId) return;

    const medicines = allRx.filter(r => selectedIds.has(r.id));

    setIsDispensing(true);
    try {
      await fulfillMutation.mutateAsync({
        patientId,
        rxIds: Array.from(selectedIds),
        medications: medicines.map(m => m.medication),
        amount: parseFloat(billAmount) || 0,
        status: "dispensed",
      });
    } finally {
      setIsDispensing(false);
    }
  };

  const handleCompleteCourse = (rx: PrescriptionEntry) => {
    fulfillMutation.mutate({
      patientId: rx.patientId,
      rxIds: [rx.id],
      medications: [rx.medication],
      amount: 0,
      status: "completed"
    });
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const columns = useMemo(() => getColumns({
    user,
    permissions,
    selectedIds,
    toggleSelect,
    handleCompleteCourse,
  }), [user, permissions, selectedIds]);

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const table = useReactTable({
    data: allRx,
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

  useEffect(() => {
    table.getColumn("status")?.setFilterValue(tab);
  }, [tab, table]);

  const filteredCount = table.getRowModel().rows.length;

  return (
    <div className="page-shell animate-fade-in">
      <section className="page-hero">
        <div className="space-y-4">
          <Badge variant="outline" className="w-fit">
            Medication workflow
          </Badge>
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Prescriptions
            </h1>
            <p className="max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
              Manage active and completed medication orders.
            </p>
          </div>
        </div>
        <Badge variant="secondary" className="gap-2">
          <ClipboardList className="h-3.5 w-3.5" />
          {filteredCount} records
        </Badge>
      </section>

      <section className="mt-4">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div className="flex flex-1 flex-wrap items-center gap-3">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search medication or patient..."
                value={globalFilter ?? ""}
                onChange={(e) => setGlobalFilter(e.target.value)}
                className="h-10 rounded-xl border-border/70 bg-background/50 pl-9 pr-4 transition-all focus:bg-background focus:ring-4 focus:ring-primary/5"
              />
            </div>
            
            <Select
              value={(table.getColumn("prescribedBy")?.getFilterValue() as string) ?? "all"}
              onValueChange={(value) => 
                table.getColumn("prescribedBy")?.setFilterValue(value === "all" ? undefined : value)
              }
            >
              <SelectTrigger className="h-10 w-[180px] rounded-xl border-border/70 bg-background/50">
                <SelectValue placeholder="Provider: All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Providers</SelectItem>
                {Array.from(new Set(allRx.map(r => r.prescribedBy))).map(name => (
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
          
          <Tabs value={tab} onValueChange={setTab} className="w-full sm:w-auto">
            <TabsList className="bg-background/50 border border-border/50 p-1 rounded-xl h-11">
              <TabsTrigger value="all" className="rounded-lg px-4">All</TabsTrigger>
              <TabsTrigger value="active" className="rounded-lg px-4">Active</TabsTrigger>
              <TabsTrigger value="dispensed" className="rounded-lg px-4">Dispensed</TabsTrigger>
              <TabsTrigger value="completed" className="rounded-lg px-4">Completed</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </section>
      
      {selectedIds.size > 0 && user?.role === "pharmacy" && (
        <div className="sticky top-20 z-40 my-4 flex items-center justify-between rounded-2xl border border-primary/20 bg-primary/5 p-4 backdrop-blur-sm shadow-lg shadow-primary/5 animate-in slide-in-from-top-4 duration-300">
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md">
              <ClipboardList className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-foreground">{selectedIds.size} prescriptions selected</p>
              <p className="text-xs text-muted-foreground">Ready for bulk dispense & billing</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" className="rounded-xl border border-border/10" onClick={() => setSelectedIds(new Set())}>
              Clear
            </Button>
            <Button className="rounded-xl bg-primary shadow-md shadow-primary/20" onClick={() => setIsBulkDialogOpen(true)}>
              <Receipt className="mr-2 h-4 w-4" />
              Dispense Selected
            </Button>
          </div>
        </div>
      )}

      <PrescriptionDataTable 
        table={table}
        user={user}
        selectedIds={selectedIds}
        toggleSelect={toggleSelect}
        columnsCount={columns.length}
      />

      <BulkDispenseDialog 
        open={isBulkDialogOpen}
        onOpenChange={setIsBulkDialogOpen}
        selectedIds={selectedIds}
        allRx={allRx}
        billAmount={billAmount}
        setBillAmount={setBillAmount}
        onSubmit={handleBulkDispenseSubmit}
        isDispensing={isDispensing}
      />
    </div>
  );
}
