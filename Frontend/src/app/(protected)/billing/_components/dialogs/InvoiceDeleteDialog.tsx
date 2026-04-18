"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { InvoiceDeleteDialogProps } from "@/types";
import { ShieldAlert } from "lucide-react";

export function InvoiceDeleteDialog({
  open,
  onOpenChange,
  invoiceToDelete,
  onConfirm,
  isDeleting,
}: InvoiceDeleteDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive font-black tracking-tight">
            <ShieldAlert className="h-5 w-5" />
            Delete Invoice
          </DialogTitle>
        </DialogHeader>
        <div className="py-4 space-y-3">
          <p className="text-sm font-medium">
            Are you sure you want to delete invoice <span className="font-mono font-bold">#{invoiceToDelete?.id.slice(0, 8)}</span> for <span className="font-bold">{invoiceToDelete?.patientName}</span>?
          </p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            This action is permanent and cannot be undone. This billing record will be removed from all financial histories.
          </p>
        </div>
        <div className="flex gap-3 pt-2">
          <Button variant="outline" className="flex-1 rounded-xl" onClick={() => onOpenChange(false)} disabled={isDeleting}>
            Cancel
          </Button>
          <Button variant="destructive" className="flex-1 rounded-xl shadow-lg shadow-destructive/20 font-bold" onClick={onConfirm} disabled={isDeleting}>
            {isDeleting ? "Deleting..." : "Delete Permanently"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
