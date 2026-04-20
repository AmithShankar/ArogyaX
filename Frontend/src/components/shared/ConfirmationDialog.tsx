"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertCircle, HelpCircle, ShieldAlert } from "lucide-react";

interface ConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  onConfirm: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "warning" | "info";
  isLoading?: boolean;
}

export function ConfirmationDialog({
  open,
  onOpenChange,
  title,
  description,
  onConfirm,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "danger",
  isLoading = false,
}: ConfirmationDialogProps) {
  const Icon = variant === "danger" ? ShieldAlert : HelpCircle;
  const titleColor = variant === "danger" ? "text-destructive" : "text-foreground";
  const buttonVariant = variant === "danger" ? "destructive" : "default";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[400px] rounded-2xl border-border/50 bg-background shadow-2xl p-0 overflow-hidden">
        <div className="p-6 pb-2">
          <DialogHeader>
            <DialogTitle className={`flex items-center gap-2 font-black tracking-tight ${titleColor}`}>
              <Icon className="h-5 w-5" />
              {title}
            </DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-3">
            <p className="text-sm font-medium leading-relaxed text-foreground">
              {description}
            </p>
          </div>
        </div>
        
        <DialogFooter className="p-4 flex flex-col-reverse sm:flex-row gap-3 pt-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
            className="flex-1 rounded-xl font-medium"
          >
            {cancelLabel}
          </Button>
          <Button
            variant={buttonVariant}
            onClick={() => {
              onConfirm();
            }}
            disabled={isLoading}
            className={`flex-1 rounded-xl font-bold shadow-lg ${variant === 'danger' ? 'shadow-destructive/20' : 'shadow-primary/20'}`}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                ...
              </div>
            ) : (
              confirmLabel
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
