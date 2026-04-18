"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent, DialogDescription,
    DialogFooter, DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BulkDispenseDialogProps, PrescriptionEntry } from "@/types";
import { CheckCheck, Loader2, Receipt } from "lucide-react";

export function BulkDispenseDialog({
  open,
  onOpenChange,
  selectedIds,
  allRx,
  billAmount,
  setBillAmount,
  onSubmit,
  isDispensing,
}: BulkDispenseDialogProps) {
  const selectedItems = allRx.filter((r: PrescriptionEntry) => selectedIds.has(r.id));
  const patientName = selectedItems[0]?.patientName;

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onOpenChange(false)}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Receipt className="h-5 w-5 text-primary" />
            Bulk Dispense & Bill
          </DialogTitle>
          <DialogDescription>
            HANDOVER: Handing over <strong>{selectedIds.size} medicines</strong> to the patient.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-6 pt-2">
          <div className="rounded-2xl border border-border/50 bg-muted/20 p-4 space-y-3">
            <div className="flex justify-between text-xs uppercase tracking-widest font-black text-muted-foreground opacity-60">
              <span>Selected Items</span>
              <span>Qty</span>
            </div>
            <div className="space-y-2 max-h-32 overflow-y-auto pr-1 scrollbar-thin">
              {selectedItems.map((rx: PrescriptionEntry) => (
                <div key={rx.id} className="flex justify-between text-sm items-center">
                  <span className="font-bold text-foreground truncate max-w-[200px]">
                    {rx.medication}
                  </span>
                  <span className="text-primary font-black px-2 py-0.5 rounded bg-primary/10 text-[10px]">
                    1 UNIT
                  </span>
                </div>
              ))}
            </div>
            <div className="flex justify-between text-sm pt-2 border-t border-border/30">
              <span className="text-muted-foreground">Patient</span>
              <span className="font-semibold text-foreground">{patientName}</span>
            </div>
          </div>

          <div className="space-y-3">
            <Label
              htmlFor="amount"
              className="text-sm font-bold text-foreground italic flex justify-between"
            >
              <span>Total Bill Amount (INR)</span>
              <span className="text-primary uppercase text-[10px] tracking-tighter">
                Enter price (₹) for all items
              </span>
            </Label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-black">
                ₹
              </div>
              <Input
                id="amount"
                type="number"
                step="1"
                min="0"
                className="pl-8 h-12 text-xl font-black bg-background border-2 border-primary/20 focus-visible:border-primary transition-all shadow-inner"
                value={billAmount}
                onChange={(e) => setBillAmount(e.target.value)}
                autoFocus
              />
            </div>
            <p className="text-[10px] leading-relaxed text-muted-foreground uppercase tracking-widest font-bold opacity-70">
              This will generate ONE invoice for a total of {selectedIds.size} prescriptions.
            </p>
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              disabled={isDispensing}
              className="h-11 rounded-xl"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="h-11 rounded-xl bg-primary hover:bg-primary/90 shadow-xl shadow-primary/20 font-black tracking-tight"
              disabled={isDispensing}
            >
              {isDispensing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Order...
                </>
              ) : (
                <>
                  <CheckCheck className="mr-2 h-4 w-4" />
                  Deliver & Generate Bill
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
