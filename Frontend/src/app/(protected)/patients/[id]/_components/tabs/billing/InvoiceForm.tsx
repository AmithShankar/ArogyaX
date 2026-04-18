"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createInvoiceApi } from "@/services/apiClient";
import { InvoiceFormProps } from "@/types";
import { Loader2, Receipt } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export function InvoiceForm({ patientId, onSuccess, onCancel }: InvoiceFormProps) {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState(0);
  const [comments, setComments] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    try {
      const newInvoice = await createInvoiceApi(patientId, { 
        name, 
        amount, 
        comments,
        status: "pending" 
      });
      setIsSuccess(true);
      setTimeout(() => {
        onSuccess(newInvoice);
        router.refresh();
      }, 1500);
    } catch (error) {
      toast.error("Failed to create invoice", {
        description: error instanceof Error ? error.message : "Try again.",
      });
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center py-8 space-y-4 animate-in fade-in zoom-in duration-300">
        <div className="h-12 w-12 rounded-full bg-success/20 flex items-center justify-center text-success">
          <Receipt className="h-6 w-6" />
        </div>
        <div className="text-center">
          <h3 className="text-lg font-medium">Invoice Generated</h3>
          <p className="text-sm text-muted-foreground">The billing record was successfully created.</p>
        </div>
      </div>
    );
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <Label className="field-label">Description</Label>
        <Input
          placeholder="Service description"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label className="field-label font-bold">Amount (₹)</Label>
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-black">₹</div>
          <Input
            type="number"
            placeholder="0"
            className="pl-7"
            value={amount}
            onChange={(e) => setAmount(parseFloat(e.target.value))}
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label className="field-label">Medicines / Details</Label>
        <Textarea
          placeholder="List medicines or service breakdown..."
          className="min-h-[100px] bg-background/50 resize-none"
          value={comments}
          onChange={(e) => setComments(e.target.value)}
        />
        <p className="text-[10px] text-muted-foreground italic">
          These details will appear as line-items in the invoice preview.
        </p>
      </div>
      <div className="flex gap-3">
        <Button
          type="button"
          variant="outline"
          className="flex-1"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" className="flex-1" disabled={isSubmitting}>
          {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Generate Invoice
        </Button>
      </div>
    </form>
  );
}
