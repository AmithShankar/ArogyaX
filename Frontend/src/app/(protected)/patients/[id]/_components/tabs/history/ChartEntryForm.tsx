"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { createChartEntryApi } from "@/services/apiClient";
import { ChartEntry, ChartEntryFormProps } from "@/types";
import { Loader2, Sparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function ChartEntryForm({ patientId, onSuccess, onCancel }: ChartEntryFormProps) {
  const [type, setType] = useState<ChartEntry["type"]>("note");
  const [comments, setComments] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!comments.trim()) return;
    
    setIsSubmitting(true);
    try {
      const newEntry = await createChartEntryApi(patientId, {
        comments,
        type,
      });
      setIsSuccess(true);
      setTimeout(() => {
        onSuccess(newEntry);
      }, 1500);
    } catch (error) {
      toast.error("Unable to save chart entry", {
        description: error instanceof Error ? error.message : "Please try again.",
      });
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center py-8 space-y-4 animate-in fade-in zoom-in duration-300">
        <div className="h-12 w-12 rounded-full bg-success/20 flex items-center justify-center text-success">
          <Sparkles className="h-6 w-6" />
        </div>
        <div className="text-center">
          <h3 className="text-lg font-medium">Entry Saved</h3>
          <p className="text-sm text-muted-foreground">Adding to patient timeline...</p>
        </div>
      </div>
    );
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <Label className="field-label">Type</Label>
        <Select
          value={type}
          onValueChange={(value) => setType(value as ChartEntry["type"])}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="visit">Visit</SelectItem>
            <SelectItem value="vitals">Vitals</SelectItem>
            <SelectItem value="lab">Lab</SelectItem>
            <SelectItem value="note">Note</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label className="field-label">Comments</Label>
        <Textarea
          placeholder="Enter notes..."
          value={comments}
          onChange={(event) => setComments(event.target.value)}
          rows={5}
        />
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
          Save Entry
        </Button>
      </div>
    </form>
  );
}
