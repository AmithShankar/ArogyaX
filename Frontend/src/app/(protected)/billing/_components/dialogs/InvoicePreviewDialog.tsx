"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { InvoicePreviewDialogProps } from "@/types";
import { Phone, Printer, Receipt, ShieldAlert } from "lucide-react";

export function InvoicePreviewDialog({
  open,
  onOpenChange,
  selectedInvoice,
  onPrint,
  currentUser,
}: InvoicePreviewDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl p-0 overflow-hidden bg-card border-border/60">
        <DialogHeader className="p-6 border-b bg-muted/30">
          <div className="flex items-center justify-between w-full pr-8">
            <DialogTitle className="flex items-center gap-2 text-foreground font-bold">
              <Receipt className="h-5 w-5 text-primary" />
              Invoice Preview
            </DialogTitle>
            <Button 
              onClick={() => selectedInvoice && onPrint(selectedInvoice)}
              className="gap-2 shadow-sm font-bold"
              disabled={currentUser?.role === "auditor"}
            >
              <Printer className="h-4 w-4" />
              Print Now
            </Button>
          </div>
        </DialogHeader>
        <div className="max-h-[70vh] overflow-y-auto p-8 text-foreground bg-card/50">
          {currentUser?.role === "auditor" ? (
            <div className="flex flex-col items-center justify-center text-center p-12 animate-fade-in bg-card/50 rounded-3xl border border-dashed border-border/60">
              <div className="w-20 h-20 rounded-[32px] bg-primary/5 flex items-center justify-center mb-10 shadow-inner">
                <ShieldAlert className="h-10 w-10 text-primary/40" />
              </div>
              <h3 className="text-2xl font-black tracking-tight text-foreground mb-4">Financial Preview Restricted</h3>
              <p className="text-muted-foreground max-w-sm text-base font-medium leading-relaxed">
                Exporting or viewing granular invoice line-items is restricted for the <span className="text-primary font-bold">Auditor</span> level. 
                Audit logs will record this access attempt as a restricted viewing event.
              </p>
              <div className="mt-12 flex flex-col items-center gap-4">
                <div className="px-6 py-2 rounded-2xl bg-primary/5 border border-primary/20 text-[10px] font-black uppercase tracking-[0.2em] text-primary">
                  Restricted Audit Mode
                </div>
              </div>
            </div>
          ) : (
            selectedInvoice && (
              <div id="printable-invoice" className="print:bg-white print:text-slate-900 border rounded-2xl p-8 bg-background/50 border-border/40 shadow-sm">
                <div className="flex justify-between items-start border-b-2 border-border/40 pb-8 mb-8">
                  <div>
                    <div className="text-2xl font-black text-primary tracking-tighter">ArogyaX</div>
                    <div className="text-[10px] text-muted-foreground mt-1 font-bold uppercase tracking-widest">Smart Healthcare Management</div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-black text-foreground tracking-tight print:text-slate-900">INVOICE</div>
                    <div className="text-sm font-mono text-muted-foreground mt-1"># {selectedInvoice.id}</div>
                    <div className="text-sm text-foreground/80 mt-2 font-bold print:text-slate-600">
                      Date: {new Date(selectedInvoice.date).toLocaleDateString("en-IN", {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-12 mb-10">
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60 mb-3">Billed To</div>
                    <div className="text-lg font-black text-foreground leading-none print:text-slate-900">{selectedInvoice.patientName}</div>
                    <div className="text-sm text-foreground/70 mt-3 flex items-center gap-2 font-medium print:text-slate-600">
                      <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center print:bg-slate-100">
                        <Phone className="h-3 w-3 text-muted-foreground" />
                      </div>
                      {selectedInvoice.patientPhone || 'N/A'}
                    </div>
                    <div className="text-xs text-muted-foreground mt-3 flex items-center gap-2 font-bold uppercase tracking-tight">
                       <div className="h-2 w-2 rounded-full bg-primary/20" />
                       Patient ID: {selectedInvoice.patientId}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60 mb-3">Status</div>
                    <Badge 
                      variant={
                        selectedInvoice.status === "paid" ? "success" : 
                        selectedInvoice.status === "rejected" ? "destructive" : "neutral"
                      }
                      className="px-4 py-1.5 text-[10px] font-black uppercase tracking-widest"
                    >
                      {selectedInvoice.status === "pending" ? "Awaiting Payment" : 
                       selectedInvoice.status === "rejected" ? "Rejected" : selectedInvoice.status}
                    </Badge>
                  </div>
                </div>

                <div className="border border-border/60 rounded-xl overflow-hidden mb-10">
                  <Table>
                    <TableHeader className="bg-muted/30">
                      <TableRow className="hover:bg-transparent border-border/60">
                        <TableHead className="font-bold text-foreground">Service / Medication Breakdown</TableHead>
                        <TableHead className="text-right font-bold text-foreground w-[120px]">Subtotal</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow className="hover:bg-transparent border-border/40">
                        <TableCell className="py-5">
                          <div className="font-black text-foreground print:text-slate-900">{selectedInvoice.name}</div>
                          {selectedInvoice.comments && (
                            <div className="text-xs text-muted-foreground mt-2 leading-relaxed whitespace-pre-line print:text-slate-600 bg-primary/5 p-3 rounded-lg border border-primary/10">
                              {selectedInvoice.comments}
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="text-right font-mono font-bold text-foreground py-5 print:text-slate-900">
                          ₹{Number(selectedInvoice.amount).toLocaleString("en-IN")}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>

                <div className="flex flex-col items-end gap-3 border-t-2 border-border/40 pt-8">
                   <div className="flex justify-between w-full max-w-[280px] items-center">
                      <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Total Amount</span>
                      <span className="text-2xl font-black text-primary tracking-tight">₹{Number(selectedInvoice.amount).toLocaleString("en-IN")}</span>
                   </div>
                   <p className="text-[10px] text-muted-foreground font-medium italic mt-2">
                      Prices include all applicable clinical service taxes.
                   </p>
                </div>

                <div className="mt-16 pt-8 border-t border-dashed border-border/40 flex justify-between items-center text-[10px] uppercase font-bold tracking-widest text-muted-foreground/40">
                   <div>Generated via ArogyaX Cloud</div>
                   <div className="print:text-slate-400">Official Patient Receipt</div>
                </div>
              </div>
            )
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
