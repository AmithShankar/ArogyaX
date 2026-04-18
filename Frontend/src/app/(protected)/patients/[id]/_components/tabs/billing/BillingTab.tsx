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
import { BillingTabProps } from "@/types";
import { flexRender } from "@tanstack/react-table";
import { Calendar, CheckCircle2, Plus, XCircle } from "lucide-react";
import { InvoiceForm } from "./InvoiceForm";

export function BillingTab({
  id,
  user,
  permissions,
  invoices,
  billingDialog,
  setBillingDialog,
  setInvoices,
  handleUpdateInvoiceStatus,
  updatingInvoiceId,
  billTable,
  billColumns,
}: BillingTabProps) {
  return (
    <div className="space-y-4">
      {permissions?.canEditBilling && user?.role !== "auditor" && (
        <Dialog open={billingDialog} onOpenChange={setBillingDialog}>
          <DialogTrigger asChild>
            <Button variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              Create Invoice
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Generate invoice</DialogTitle>
            </DialogHeader>
            <InvoiceForm
              patientId={id}
              onSuccess={(newInvoice) => {
                setInvoices((prev) => [newInvoice, ...prev]);
                setBillingDialog(false);
              }}
              onCancel={() => setBillingDialog(false)}
            />
          </DialogContent>
        </Dialog>
      )}
      <div className="mobile-data-stack md:hidden">
        {invoices.map((invoice) => (
          <Card key={invoice.id}>
            <CardContent className="space-y-3 p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-foreground">
                    {invoice.name}
                  </p>
                  <p className="text-[10px] text-muted-foreground font-mono">
                    {invoice.id}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Badge variant="warning" className="font-black">
                    ₹{Number(invoice.amount).toLocaleString("en-IN")}
                  </Badge>
                  <Badge
                    variant={
                      invoice.status === "paid"
                        ? "success"
                        : invoice.status === "rejected"
                        ? "destructive"
                        : "neutral"
                    }
                    className="text-[10px] uppercase px-1.5 py-0"
                  >
                    {invoice.status === "pending"
                      ? "Awaiting Payment"
                      : invoice.status === "rejected"
                      ? "Rejected"
                      : invoice.status}
                  </Badge>
                </div>
              </div>
              <p className="text-xs text-muted-foreground flex items-center gap-1.5 font-medium">
                <Calendar className="h-3 w-3" />
                {new Date(invoice.date).toLocaleDateString()}
              </p>
              {invoice.status === "pending" &&
                permissions?.canEditBilling &&
                user?.role !== "auditor" && (
                  <div className="flex gap-2 pt-2 border-t border-border/20 mt-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 flex-1 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                      onClick={() =>
                        handleUpdateInvoiceStatus(invoice.id, "paid")
                      }
                      disabled={updatingInvoiceId === invoice.id}
                    >
                      <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" />
                      Mark Paid
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 flex-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() =>
                        handleUpdateInvoiceStatus(invoice.id, "rejected")
                      }
                      disabled={updatingInvoiceId === invoice.id}
                    >
                      <XCircle className="h-3.5 w-3.5 mr-1.5" />
                      Reject
                    </Button>
                  </div>
                )}
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="hidden md:block">
        <Card className="overflow-hidden border-border/80">
          <Table>
            <TableHeader>
              {billTable.getHeaderGroups().map((headerGroup) => (
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
              {billTable.getRowModel().rows?.length ? (
                billTable.getRowModel().rows.map((row) => (
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
                    colSpan={billColumns.length}
                    className="h-24 text-center"
                  >
                    No invoices found.
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
