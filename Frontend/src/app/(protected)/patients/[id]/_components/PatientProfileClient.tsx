"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    ChartEntry, Invoice, Patient, PatientProfileClientProps, PatientSummary as PatientSummaryType, Prescription
} from "@/types";
import {
    getCoreRowModel,
    getSortedRowModel,
    SortingState, useReactTable
} from "@tanstack/react-table";
import {
    ArrowLeft
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

// API
import {
    deleteChartEntryApi, deletePatientApi, deletePrescriptionApi, generateSummaryApi, updateInvoiceApi, updatePatientApi, updatePrescriptionApi
} from "@/services/apiClient";

import { PatientDeleteDialog } from "./dialogs/PatientDeleteDialog";
import { PatientEditDialog } from "./dialogs/PatientEditDialog";
import { PatientProfileHeader } from "./layout/PatientProfileHeader";
import { PatientStatsCards } from "./layout/PatientStatsCards";
import { PatientSummary } from "./layout/PatientSummary";
import { BillingTab } from "./tabs/billing/BillingTab";
import { CurrentVisitTab } from "./tabs/current-visit/CurrentVisitTab";
import { HistoryTab } from "./tabs/history/HistoryTab";
import { LabsTab } from "./tabs/labs/LabsTab";
import { ReportPreviewDialog } from "./tabs/labs/ReportPreviewDialog";
import { PrescriptionsTab } from "./tabs/prescriptions/PrescriptionsTab";

import { getInvoiceColumns } from "./tabs/billing/InvoiceColumns";
import { getLabColumns } from "./tabs/labs/LabColumns";
import { getRxColumns } from "./tabs/prescriptions/PrescriptionColumns";


import { ConfirmationDialog } from "@/components/shared/ConfirmationDialog";

export function PatientProfileClient({
  id,
  user,
  permissions,
  patient,
  initialCharts,
  initialPrescriptions,
  initialInvoices,
  initialSummary,
}: PatientProfileClientProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "history");

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab) setActiveTab(tab);
  }, [searchParams]);

  const [summary, setSummary] = useState<PatientSummaryType | null>(initialSummary);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewType, setPreviewType] = useState<"image" | "pdf" | null>(null);

  const handlePreview = (url: string) => {
    const isPdf = url.toLowerCase().endsWith(".pdf");
    setPreviewType(isPdf ? "pdf" : "image");
    setPreviewUrl(url);
  };

  const [chartFilter, setChartFilter] = useState<string>("all");
  const [chartDialog, setChartDialog] = useState(false);
  const [rxDialog, setRxDialog] = useState(false);
  const [charts, setCharts] = useState<ChartEntry[]>(initialCharts);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>(initialPrescriptions);
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices);
  const [currentPatient, setCurrentPatient] = useState<Patient>(patient);
  const [editPatientDialog, setEditPatientDialog] = useState(false);
  const [deletePatientConfirm, setDeletePatientConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [labDialog, setLabDialog] = useState(false);
  const [labFile, setLabFile] = useState<File | null>(null);
  const [labLoading, setLabLoading] = useState(false);
  const [billingDialog, setBillingDialog] = useState(false);
  const [updatingInvoiceId, setUpdatingInvoiceId] = useState<string | null>(null);

  // New states for confirmation dialogs
  const [confirmChartDelete, setConfirmChartDelete] = useState<{ open: boolean; id: string | null }>({ open: false, id: null });
  const [confirmRxDelete, setConfirmRxDelete] = useState<{ open: boolean; id: string | null }>({ open: false, id: null });
  const [isProcessingAction, setIsProcessingAction] = useState(false);


  useEffect(() => {
    setCharts(initialCharts);
    setPrescriptions(initialPrescriptions);
    setInvoices(initialInvoices);
  }, [initialCharts, initialPrescriptions, initialInvoices]);

  const handleDeleteChartEntry = (entryId: string) => {
    setConfirmChartDelete({ open: true, id: entryId });
  };

  const executeDeleteChartEntry = async () => {
    if (!confirmChartDelete.id) return;
    setIsProcessingAction(true);
    try {
      await deleteChartEntryApi(id, confirmChartDelete.id);
      setCharts((prev) => prev.filter((c) => c.id !== confirmChartDelete.id));
      toast.success("Entry removed");
      setConfirmChartDelete({ open: false, id: null });
    } catch (error) {
      toast.error("Failed to delete entry");
    } finally {
      setIsProcessingAction(false);
    }
  };

  const handleDeletePrescription = (rxId: string) => {
    setConfirmRxDelete({ open: true, id: rxId });
  };

  const executeDeletePrescription = async () => {
    if (!confirmRxDelete.id) return;
    setIsProcessingAction(true);
    try {
      await deletePrescriptionApi(id, confirmRxDelete.id);
      setPrescriptions((prev) => prev.filter((r) => r.id !== confirmRxDelete.id));
      toast.success("Prescription removed");
      setConfirmRxDelete({ open: false, id: null });
    } catch (error) {
      toast.error("Failed to delete prescription");
    } finally {
      setIsProcessingAction(false);
    }
  };

  const handleTogglePrescriptionStatus = async (rxId: string, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "void" : "active";
    try {
      const updated = await updatePrescriptionApi(id, rxId, { status: newStatus as any });
      setPrescriptions((prev) => prev.map((r) => r.id === rxId ? updated : r));
      toast.success(`Prescription marked as ${newStatus}`);
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const handleUpdatePatient = async (data: any) => {
    try {
      const updated = await updatePatientApi(id, {
        name: data.name,
        phone: data.phone,
        address: data.address,
        gender: data.gender,
        dateOfBirth: patient.dateOfBirth,
      });
      setCurrentPatient(updated);
      setEditPatientDialog(false);
      toast.success("Patient profile updated");
      router.refresh();
    } catch (error) {
      toast.error("Failed to update patient");
    }
  };

  const handleDeletePatient = async () => {
    setIsDeleting(true);
    try {
      await deletePatientApi(id);
      toast.success("Patient record deleted");
      router.push("/patients");
      router.refresh();
    } catch (error) {
      toast.error("Failed to delete patient");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleUpdateInvoiceStatus = async (invoiceId: string, status: "paid" | "rejected") => {
    setUpdatingInvoiceId(invoiceId);
    try {
      const updated = await updateInvoiceApi(id, invoiceId, { status });
      setInvoices(prev => prev.map(inv => inv.id === invoiceId ? updated : inv));
      toast.success(`Invoice marked as ${status}`);
    } catch (error) {
      toast.error(`Failed to update invoice`);
    } finally {
      setUpdatingInvoiceId(null);
    }
  };

  const generateSummary = async () => {
    setSummaryLoading(true);
    try {
      const generatedSummary = await generateSummaryApi(id);
      setSummary(generatedSummary);
    } catch (error) {
      setSummary(null);
      toast.error("Unable to generate summary");
    } finally {
      setSummaryLoading(false);
    }
  };

  const [rxSorting, setRxSorting] = useState<SortingState>([]);
  const [labSorting, setLabSorting] = useState<SortingState>([]);
  const [billSorting, setBillSorting] = useState<SortingState>([]);

  const rxColumns = useMemo(() => getRxColumns({
    permissions,
    user,
    handleTogglePrescriptionStatus,
    handleDeletePrescription,
  }), [permissions, user]);

  const rxData = useMemo(() => 
    prescriptions.filter((rx) => user?.role === "pharmacy" ? rx.status === "active" : true),
  [prescriptions, user?.role]);

  const rxTable = useReactTable({
    data: rxData,
    columns: rxColumns,
    state: { sorting: rxSorting },
    onSortingChange: setRxSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const labColumns = useMemo(() => getLabColumns({ handlePreview }), []);
  const labEntries = useMemo(() => charts.filter((chart) => chart.type === "lab"), [charts]);

  const labTable = useReactTable({
    data: labEntries,
    columns: labColumns,
    state: { sorting: labSorting },
    onSortingChange: setLabSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const billColumns = useMemo(() => getInvoiceColumns({
    permissions,
    user,
    updatingInvoiceId,
    handleUpdateInvoiceStatus,
  }), [permissions, user, updatingInvoiceId]);

  const billTable = useReactTable({
    data: invoices,
    columns: billColumns,
    state: { sorting: billSorting },
    onSortingChange: setBillSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  if (!mounted) {
    return (
      <div className="page-shell animate-pulse">
        <div className="h-[200px] w-full rounded-2xl bg-muted/20" />
        <div className="mt-8 h-[400px] w-full rounded-2xl bg-muted/10" />
      </div>
    );
  }

  if (user?.role === "reception") {
    return (
      <div className="page-shell animate-fade-in">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="w-fit"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Card>
          <CardContent className="space-y-4 p-6">
            <div className="space-y-2">
              <Badge variant="outline" className="w-fit">
                Reception view
              </Badge>
              <h1 className="text-2xl font-semibold text-foreground">
                {patient.name}
              </h1>
              <p className="text-sm text-muted-foreground">
                {patient.age} yrs | {patient.phone}
              </p>
            </div>
            {summary && (
              <div className="rounded-[var(--radius-md)] border border-border/70 bg-muted/40 p-4 text-sm text-foreground">
                <span className="font-medium">Last Visit:</span>{" "}
                {summary.chiefComplaint}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="page-shell animate-fade-in">
      <PatientProfileHeader
        patient={patient}
        currentPatient={currentPatient}
        permissions={permissions}
        user={user}
        summaryLoading={summaryLoading}
        onBack={() => router.back()}
        onEdit={() => setEditPatientDialog(true)}
        onDelete={() => setDeletePatientConfirm(true)}
        onGenerateSummary={generateSummary}
      />

      <section
        className={`grid gap-4 ${
          summary || summaryLoading
            ? "lg:grid-cols-[minmax(0,1.3fr)_minmax(17rem,0.85fr)]"
            : ""
        }`}
      >
        <PatientSummary summary={summary} summaryLoading={summaryLoading} />
        <PatientStatsCards 
          charts={charts} 
          prescriptions={prescriptions} 
          invoices={invoices} 
          isSidebar={!!(summary || summaryLoading)}
        />
      </section>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-5">
        <TabsList>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="current">Current Visit</TabsTrigger>
          {permissions?.canViewPrescriptions && (
            <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger>
          )}
          {permissions?.canViewLabs && (
            <TabsTrigger value="labs">Labs</TabsTrigger>
          )}
          {permissions?.canViewBilling && (
            <TabsTrigger value="billing">Billing</TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="history">
          <HistoryTab
            id={id}
            user={user}
            permissions={permissions}
            charts={charts}
            chartFilter={chartFilter}
            setChartFilter={setChartFilter}
            chartDialog={chartDialog}
            setChartDialog={setChartDialog}
            handleDeleteChartEntry={handleDeleteChartEntry}
            handlePreview={handlePreview}
            setCharts={setCharts}
            router={router}
          />
        </TabsContent>

        <TabsContent value="current">
          <CurrentVisitTab charts={charts} />
        </TabsContent>

        {permissions?.canViewPrescriptions && (
          <TabsContent value="prescriptions">
            <PrescriptionsTab
              id={id}
              user={user}
              permissions={permissions}
              prescriptions={prescriptions}
              rxDialog={rxDialog}
              setRxDialog={setRxDialog}
              setPrescriptions={setPrescriptions}
              handleTogglePrescriptionStatus={handleTogglePrescriptionStatus}
              handleDeletePrescription={handleDeletePrescription}
              rxTable={rxTable}
              rxColumns={rxColumns}
            />
          </TabsContent>
        )}

        {permissions?.canViewLabs && (
          <TabsContent value="labs">
            <LabsTab
              id={id}
              permissions={permissions}
              labEntries={labEntries}
              labDialog={labDialog}
              setLabDialog={setLabDialog}
              labFile={labFile}
              setLabFile={setLabFile}
              labLoading={labLoading}
              setLabLoading={setLabLoading}
              setCharts={setCharts}
              handlePreview={handlePreview}
              labTable={labTable}
              labColumns={labColumns}
              router={router}
            />
          </TabsContent>
        )}

        {permissions?.canViewBilling && (
          <TabsContent value="billing">
            <BillingTab
              id={id}
              user={user}
              permissions={permissions}
              invoices={invoices}
              billingDialog={billingDialog}
              setBillingDialog={setBillingDialog}
              setInvoices={setInvoices}
              handleUpdateInvoiceStatus={handleUpdateInvoiceStatus}
              updatingInvoiceId={updatingInvoiceId}
              billTable={billTable}
              billColumns={billColumns}
            />
          </TabsContent>
        )}
      </Tabs>

      <ReportPreviewDialog
        previewUrl={previewUrl}
        previewType={previewType}
        onClose={() => setPreviewUrl(null)}
        user={user}
      />

      {currentPatient && (
        <PatientEditDialog
          open={editPatientDialog}
          onOpenChange={setEditPatientDialog}
          patient={currentPatient}
          onUpdate={handleUpdatePatient}
        />
      )}

      {currentPatient && (
        <PatientDeleteDialog
          open={deletePatientConfirm}
          onOpenChange={setDeletePatientConfirm}
          patientName={currentPatient.name}
          onDelete={handleDeletePatient}
          isDeleting={isDeleting}
        />
      )}

      <ConfirmationDialog 
        open={confirmChartDelete.open}
        onOpenChange={(open) => setConfirmChartDelete({ ...confirmChartDelete, open })}
        title="Delete Clinical Entry"
        description="Are you sure you want to permanently delete this clinical record? This action cannot be undone and will be logged for audit purposes."
        onConfirm={executeDeleteChartEntry}
        confirmLabel="Delete Entry"
        isLoading={isProcessingAction}
        variant="danger"
      />

      <ConfirmationDialog 
        open={confirmRxDelete.open}
        onOpenChange={(open) => setConfirmRxDelete({ ...confirmRxDelete, open })}
        title="Delete Prescription"
        description="Are you sure you want to remove this medication from the patient's record? This trail will remain in clinical history but the order will be voided."
        onConfirm={executeDeletePrescription}
        confirmLabel="Void & Delete"
        isLoading={isProcessingAction}
        variant="danger"
      />
    </div>
  );
}
