"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { createPrescriptionApi } from "@/services/apiClient";
import { PrescriptionFormProps } from "@/types";
import { Activity, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { DURATION_UNITS, FREQUENCIES } from "../../../_utils/patient-constants";

export function PrescriptionForm({ patientId, onSuccess, onCancel }: PrescriptionFormProps) {
  const [medication, setMedication] = useState("");
  const [dosage, setDosage] = useState("");
  const [frequency, setFrequency] = useState("QD");
  const [durationVal, setDurationVal] = useState<number>(7);
  const [durationUnit, setDurationUnit] = useState<string>("days");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!medication.trim()) return;

    setIsSubmitting(true);
    try {
      const durationDisplay = durationUnit === "indefinite" 
        ? "Indefinite/Ongoing" 
        : `${durationVal} ${durationUnit}`;

      const created = await createPrescriptionApi(patientId, {
        medication,
        dosage,
        frequency,
        duration: durationDisplay,
        status: "active",
      });
      setIsSuccess(true);
      setTimeout(() => {
        onSuccess(created); 
        router.refresh();
      }, 1500);
    } catch (error) {
      toast.error("Unable to save prescription", {
        description: error instanceof Error ? error.message : "Please try again.",
      });
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center py-8 space-y-4 animate-in fade-in zoom-in duration-300">
        <div className="h-12 w-12 rounded-full bg-success/20 flex items-center justify-center text-success">
          <Activity className="h-6 w-6" />
        </div>
        <div className="text-center">
          <h3 className="text-lg font-medium">Prescription Saved</h3>
          <p className="text-sm text-muted-foreground">Redirecting to care timeline...</p>
        </div>
      </div>
    );
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <Label className="field-label">Medication Name</Label>
        <Input
          placeholder="e.g. Amoxicillin or Metformin"
          value={medication}
          onChange={(e) => setMedication(e.target.value)}
          required
        />
      </div>
      
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label className="field-label">Dosage</Label>
          <Input
            placeholder="e.g. 500mg"
            value={dosage}
            onChange={(e) => setDosage(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label className="field-label">Frequency</Label>
          <Select value={frequency} onValueChange={setFrequency}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {FREQUENCIES.map(f => (
                <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-3">
        <Label className="field-label">Duration</Label>
        <div className="flex gap-2">
          {durationUnit !== "indefinite" && (
            <div className="w-24">
              <Input
                type="number"
                min={1}
                value={durationVal}
                onChange={(e) => setDurationVal(parseInt(e.target.value) || 1)}
              />
            </div>
          )}
          <div className="flex-1">
            <Select value={durationUnit} onValueChange={setDurationUnit}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DURATION_UNITS.map(u => (
                  <SelectItem key={u.value} value={u.value}>{u.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="flex gap-3 pt-2">
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
          Save Prescription
        </Button>
      </div>
    </form>
  );
}
