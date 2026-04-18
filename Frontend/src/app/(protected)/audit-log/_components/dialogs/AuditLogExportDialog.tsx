"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AuditLogExportDialogProps } from "@/types";
import { AlertCircle, FileDown, ShieldCheck } from "lucide-react";

export function AuditLogExportDialog({
  open,
  onOpenChange,
  reason,
  onReasonChange,
  isExporting,
  onExport,
}: AuditLogExportDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-primary" />
            Administrative Export
          </DialogTitle>
          <DialogDescription>
            Exporting medical audit logs is a sensitive action. Please provide a formal justification for this request.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="reason" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Justification Reason
            </Label>
            <Textarea
              id="reason"
              placeholder="e.g., Monthly compliance review for Internal Audit Dept."
              className="resize-none"
              rows={4}
              value={reason}
              onChange={(e) => onReasonChange(e.target.value)}
            />
            <div className="flex items-center gap-2 text-[10px] text-muted-foreground italic">
              <AlertCircle className="h-3 w-3" />
              This justification will be permanently logged in the system audit trail.
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)} disabled={isExporting}>
            Cancel
          </Button>
          <Button 
            onClick={onExport} 
            disabled={reason.length < 10 || isExporting}
            className="gap-2"
          >
            {isExporting ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Generating...
              </>
            ) : (
              <>
                <FileDown className="h-4 w-4" />
                Download CSV
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
