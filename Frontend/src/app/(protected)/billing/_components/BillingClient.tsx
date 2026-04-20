"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { deleteInvoiceApi, listAllInvoicesApi } from "@/services/apiClient";
import { InvoiceWithPatient } from "@/types";
import { useQuery } from "@tanstack/react-query";
import {
    getCoreRowModel, getPaginationRowModel, getSortedRowModel,
    SortingState, useReactTable
} from "@tanstack/react-table";
import { Filter, Receipt, Search, X } from "lucide-react";
import { TablePageSkeleton } from "@/components/shared/skeletons/TablePageSkeleton";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { getBillingColumns } from "./table/BillingColumns";

import { InvoiceDeleteDialog } from "./dialogs/InvoiceDeleteDialog";
import { InvoicePreviewDialog } from "./dialogs/InvoicePreviewDialog";
import { BillingDataTable } from "./table/BillingDataTable";
import { getInvoiceHtml } from "./templates/InvoiceHtmlTemplate";


export function BillingClient() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const { permissions, user } = useAuth();
  const [search, setSearch] = useState("");

  const [activeTab, setActiveTab] = useState("all");
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceWithPatient | null>(null);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [invoiceToDelete, setInvoiceToDelete] = useState<InvoiceWithPatient | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handlePreviewInvoice = (invoice: InvoiceWithPatient) => {
    setSelectedInvoice(invoice);
    setPreviewDialogOpen(true);
  };

  const { data: invoices = [], isLoading, refetch } = useQuery({
    queryKey: ["all-invoices"],
    queryFn: listAllInvoicesApi,
  });

  const handleDeleteInvoice = async () => {
    if (!invoiceToDelete) return;
    setIsDeleting(true);
    try {
      await deleteInvoiceApi(invoiceToDelete.patientId, invoiceToDelete.id);
      toast.success("Invoice deleted successfully");
      setDeleteDialogOpen(false);
      setInvoiceToDelete(null);
      refetch();
    } catch (error) {
      toast.error("Failed to delete invoice", {
        description: error instanceof Error ? error.message : "Request failed"
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handlePrintInvoice = (invoice: InvoiceWithPatient) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const invoiceHtml = getInvoiceHtml(invoice);
    printWindow.document.write(invoiceHtml);
    printWindow.document.close();
  };

  const filteredInvoices = useMemo(() => {
    return invoices.filter((inv: InvoiceWithPatient) => {
      const matchesSearch = 
        inv.patientName.toLowerCase().includes(search.toLowerCase()) ||
        inv.name.toLowerCase().includes(search.toLowerCase());
      
      if (activeTab === "all") return matchesSearch;
      return matchesSearch && inv.status === activeTab;
    });
  }, [invoices, search, activeTab]);

  const [sorting, setSorting] = useState<SortingState>([]);

  const columns = useMemo(() => getBillingColumns({
    onPreview: handlePreviewInvoice,
    onDelete: (inv: InvoiceWithPatient) => {
      setInvoiceToDelete(inv);
      setDeleteDialogOpen(true);
    },
    permissions,
    currentUser: user
  }), [permissions, user]);


  const table = useReactTable({
    data: filteredInvoices,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
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
            Ledger
          </Badge>
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Billing
            </h1>
            <p className="max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
              Manage patient billing, payment status, and financial records.
            </p>
          </div>
        </div>
        <Badge variant="secondary" className="gap-2 h-9 px-3">
          <Receipt className="h-3.5 w-3.5" />
          {invoices.length} invoices
        </Badge>
      </section>

      <div className="mt-4">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div className="flex flex-1 flex-wrap items-center gap-3">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search patient or invoice..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-10 rounded-xl border-border/70 bg-background/50 pl-9 pr-4 transition-all focus:bg-background focus:ring-4 focus:ring-primary/5"
              />
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="bg-background/50 border border-border/50 p-1 rounded-xl h-11">
                <TabsTrigger value="all" className="rounded-lg px-4">All</TabsTrigger>
                <TabsTrigger value="pending" className="rounded-lg px-4">Pending</TabsTrigger>
                <TabsTrigger value="paid" className="rounded-lg px-4">Paid</TabsTrigger>
              </TabsList>
            </Tabs>

            {(search || activeTab !== "all") && (
              <Button
                variant="ghost"
                onClick={() => {
                  setSearch("");
                  setActiveTab("all");
                }}
                className="h-10 gap-2 px-3 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
                Clear
              </Button>
            )}
          </div>
          
          <Badge variant="secondary" className="gap-2 h-9 px-3">
            <Filter className="h-3.5 w-3.5" />
            {filteredInvoices.length} results
          </Badge>
        </div>

        <BillingDataTable 
          table={table}
          isLoading={isLoading}
          search={search}
        />
      </div>

      <InvoicePreviewDialog 
        open={previewDialogOpen}
        onOpenChange={setPreviewDialogOpen}
        selectedInvoice={selectedInvoice}
        onPrint={handlePrintInvoice}
        currentUser={user}
      />

      <InvoiceDeleteDialog 
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        invoiceToDelete={invoiceToDelete}
        onConfirm={handleDeleteInvoice}
        isDeleting={isDeleting}
      />
    </div>
  );
}


