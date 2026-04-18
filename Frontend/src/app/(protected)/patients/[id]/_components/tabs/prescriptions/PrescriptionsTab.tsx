"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { PrescriptionsTabProps } from "@/types";
import { flexRender } from "@tanstack/react-table";
import { CheckCircle2, Plus, Trash2, XCircle } from "lucide-react";
import { formatDosage, FREQUENCY_LABELS } from "../../../_utils/patient-constants";
import { PrescriptionForm } from "./PrescriptionForm";

export function PrescriptionsTab({
  id,
  user,
  permissions,
  prescriptions,
  rxDialog,
  setRxDialog,
  setPrescriptions,
  handleTogglePrescriptionStatus,
  handleDeletePrescription,
  rxTable,
  rxColumns,
}: PrescriptionsTabProps) {
  return (
    <div className="space-y-4">
      {permissions?.canEditPrescriptions && (
        <Dialog open={rxDialog} onOpenChange={setRxDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Prescription
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>New prescription</DialogTitle>
            </DialogHeader>
            <PrescriptionForm
              patientId={id}
              onSuccess={(newPrescription) => {
                setPrescriptions((prev) => [newPrescription, ...prev]);
                setRxDialog(false);
              }}
              onCancel={() => setRxDialog(false)}
            />
          </DialogContent>
        </Dialog>
      )}

      <div className="mobile-data-stack md:hidden">
        {prescriptions
          .filter((prescription) =>
            user?.role === "pharmacy" ? prescription.status === "active" : true
          )
          .map((prescription) => (
            <Card key={prescription.id}>
              <CardContent className="space-y-4 p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {prescription.medication}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {prescription.prescribedBy}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2 text-right">
                    <Badge
                      variant={
                        prescription.status === "active" ? "success" : "neutral"
                      }
                    >
                      {prescription.status}
                    </Badge>
                    {permissions?.canEditPrescriptions && (
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() =>
                            handleTogglePrescriptionStatus(
                              prescription.id,
                              prescription.status
                            )
                          }
                        >
                          {prescription.status === "active" ? (
                            <XCircle className="h-4 w-4 text-orange-500" />
                          ) : (
                            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                          )}
                        </Button>
                        {permissions?.canDeleteData && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive"
                            onClick={() =>
                              handleDeletePrescription(prescription.id)
                            }
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <dl className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <dt className="field-label">Dosage</dt>
                    <dd className="text-foreground">
                      {formatDosage(prescription.dosage)}
                    </dd>
                  </div>
                  <div>
                    <dt className="field-label">Frequency</dt>
                    <dd className="text-foreground">
                      {FREQUENCY_LABELS[prescription.frequency] ||
                        prescription.frequency}
                    </dd>
                  </div>
                  <div>
                    <dt className="field-label">Duration</dt>
                    <dd className="text-foreground">{prescription.duration}</dd>
                  </div>
                </dl>
              </CardContent>
            </Card>
          ))}
      </div>
      <div className="hidden md:block">
        <Card className="overflow-hidden border-border/80">
          <Table>
            <TableHeader>
              {rxTable.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
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
              {rxTable.getRowModel().rows?.length ? (
                rxTable.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={rxColumns.length}
                    className="h-24 text-center"
                  >
                    No prescriptions found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  );
}
