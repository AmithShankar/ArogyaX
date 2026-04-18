"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { PatientDeleteDialogProps } from "@/types";
import { ShieldAlert } from "lucide-react";

export function PatientDeleteDialog({
  open,
  onOpenChange,
  patientName,
  onDelete,
  isDeleting,
}: PatientDeleteDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive font-black tracking-tight">
            <ShieldAlert className="h-5 w-5" />
            Delete Patient Record
          </DialogTitle>
        </DialogHeader>
        <div className="py-4 space-y-3">
          <p className="text-sm font-medium">
            Are you absolutely sure you want to delete{" "}
            <span className="text-destructive font-bold">{patientName}</span>'s record?
          </p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            This action is permanent and will delete all clinical history, prescriptions, and
            billing data for this patient. This action cannot be undone.
          </p>
        </div>
        <div className="flex gap-3 pt-2">
          <Button
            variant="outline"
            className="flex-1 rounded-xl"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
          >
            Keep Record
          </Button>
          <Button
            variant="destructive"
            className="flex-1 rounded-xl shadow-lg shadow-destructive/20 font-bold"
            onClick={onDelete}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete Permanently"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
