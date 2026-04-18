"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { UserDeactivateDialogProps } from "@/types";
import { ShieldX } from "lucide-react";

export function UserDeactivateDialog({
  open,
  onOpenChange,
  user,
  onConfirm,
  isSubmitting,
}: UserDeactivateDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive font-black tracking-tight">
            <ShieldX className="h-5 w-5" />
            Confirm Deactivation
          </DialogTitle>
        </DialogHeader>
        <div className="py-4 space-y-3">
          <p className="text-sm text-foreground font-medium">
            Are you sure you want to deactivate <span className="font-bold">{user?.name}</span>?
          </p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            The user will lose access to all clinical systems immediately. This action will be audited.
          </p>
        </div>
        <div className="flex gap-3 pt-2">
          <Button
            variant="outline"
            className="flex-1 rounded-xl"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            className="flex-1 rounded-xl shadow-lg shadow-destructive/20 font-bold"
            onClick={onConfirm}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Deactivating..." : "Deactivate User"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
