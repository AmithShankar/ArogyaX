"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { ReportPreviewDialogProps } from "@/types";
import { FileText, ShieldAlert } from "lucide-react";

export function ReportPreviewDialog({
  previewUrl,
  previewType,
  onClose,
  user,
}: ReportPreviewDialogProps) {
  return (
    <Dialog open={!!previewUrl} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden h-[85vh] flex flex-col">
        <DialogHeader className="p-4 border-b">
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-primary" />
            Medical Report Preview
          </DialogTitle>
        </DialogHeader>
        <div className="flex-1 bg-muted/30 flex items-center justify-center overflow-auto p-4">
          {user?.role === "auditor" ? (
            <div className="flex flex-col items-center justify-center text-center p-8 animate-fade-in">
              <div className="w-16 h-16 rounded-3xl bg-destructive/10 flex items-center justify-center mb-6 shadow-sm border border-destructive/20">
                <ShieldAlert className="h-8 w-8 text-destructive" />
              </div>
              <h3 className="text-xl font-bold tracking-tight">Preview Restricted</h3>
              <p className="text-sm text-muted-foreground max-w-xs mt-3 leading-relaxed font-medium">
                The 'Auditor' role is restricted from viewing medical document contents. 
                Please contact the clinical administrator for full access.
              </p>
              <div className="mt-8 px-4 py-2 rounded-full bg-muted/50 border border-border/50 text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">
                Secure Audit Access Mode
              </div>
            </div>
          ) : (
            previewUrl && (
              previewType === "image" ? (
                <img
                  src={previewUrl}
                  alt="Lab Report"
                  className="max-w-full max-h-full object-contain rounded-md shadow-lg"
                />
              ) : (
                <iframe
                  src={previewUrl}
                  className="w-full h-full rounded-md border-0 bg-white"
                  title="PDF Preview"
                />
              )
            )
          )}
        </div>

        <div className="p-3 border-t bg-muted/10 flex justify-end">
          <Button variant="outline" onClick={onClose}>
            Close Preview
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
