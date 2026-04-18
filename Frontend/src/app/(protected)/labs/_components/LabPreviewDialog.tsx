"use client";

import { LabPreviewDialogProps } from "@/types";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { Download, FileText, ShieldAlert } from "lucide-react";
import Image from "next/image";



export function LabPreviewDialog({ previewUrl, onClose, userRole }: LabPreviewDialogProps) {
  const isPdf = previewUrl?.toLowerCase().endsWith(".pdf");
  const isAuditor = userRole === "auditor";

  return (
    <Dialog open={!!previewUrl} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-5xl p-0 overflow-hidden h-[90vh] flex flex-col border-none shadow-2xl bg-background rounded-2xl">
        <DialogHeader className="p-5 border-b bg-card flex flex-row items-center justify-between shrink-0">
          <DialogTitle className="flex items-center gap-3 text-xl font-bold">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <p>Medical Diagnostic Report</p>
              <p className="text-xs text-muted-foreground font-normal">Confidential Patient Data • ArogyaX Clinical Lab</p>
            </div>
          </DialogTitle>
        </DialogHeader>
        <div className="flex-1 bg-muted/40 flex items-center justify-center overflow-auto relative group/viewer">
          {isAuditor ? (
            <div className="flex flex-col items-center justify-center text-center p-8 animate-fade-in bg-card/50 w-full h-full">
              <div className="w-20 h-20 rounded-[32px] bg-destructive/10 flex items-center justify-center mb-8 shadow-sm border border-destructive/20">
                <ShieldAlert className="h-10 w-10 text-destructive" />
              </div>
              <h3 className="text-2xl font-black tracking-tighter text-foreground mb-4">Content Restricted</h3>
              <p className="text-muted-foreground max-w-sm text-base font-medium leading-relaxed">
                As an <span className="text-destructive font-bold">Auditor</span>, you are permitted to verify the existence of clinical records, 
                but the raw diagnostic contents are restricted to clinical personnel.
              </p>
              <div className="mt-10 flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-muted/50 border border-border/50">
                <div className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Secure Access Level: Level 1 (Audit Only)</span>
              </div>
            </div>
          ) : (
            previewUrl && (
              isPdf ? (
                <iframe
                  src={previewUrl}
                  className="w-full h-full border-0 bg-white"
                  title="PDF Preview"
                />
              ) : (
                <div className="p-8 flex items-center justify-center w-full h-full">
                  <div className="relative w-full h-full">
                    <Image
                      src={previewUrl}
                      alt="Lab Report"
                      fill
                      unoptimized
                      className="object-contain rounded-xl"
                      sizes="(max-width: 768px) 100vw, 80vw"
                    />
                  </div>
                </div>
              )
            )
          )}
          <div className="absolute top-4 right-4 transition-opacity">
            <Badge className="bg-foreground text-background border-none font-bold">Secure Clinical Viewer</Badge>
          </div>
        </div>
        <div className="p-5 border-t bg-card flex justify-between items-center shrink-0">
          <p className="text-[10px] text-muted-foreground max-w-xs leading-relaxed uppercase tracking-widest font-bold">
            Verify patient identity before sharing. 
            Authorized personnel only.
          </p>
          <div className="flex gap-3">
            <Button variant="outline" className="rounded-xl px-6 h-11" onClick={onClose}>
              Close Preview
            </Button>
            {!isAuditor && previewUrl && (
              <Button className="rounded-xl px-6 h-11 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20" onClick={() => window.open(previewUrl, '_blank')}>
                <Download className="h-4 w-4 mr-2" /> Download Report
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
