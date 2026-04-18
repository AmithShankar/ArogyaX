"use client";

import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { createPatientApi } from "@/services/apiClient";
import { PatientRegisterDialogProps } from "@/types";
import { format } from "date-fns";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export function PatientRegisterDialog({ trigger, onSuccess }: PatientRegisterDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    dob: "",
    gender: "",
    address: "",
  });

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.dob || !formData.gender) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      setIsRegistering(true);
      await createPatientApi({
        name: formData.name,
        phone: formData.phone,
        dateOfBirth: formData.dob,
        gender: formData.gender,
        address: formData.address || undefined,
      });

      toast.success("Patient registered successfully");
      setOpen(false);
      setFormData({ name: "", phone: "", dob: "", gender: "", address: "" });
      onSuccess?.();
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Registration failed");
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New patient
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Register new patient</DialogTitle>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleRegister}>
          <div className="space-y-2">
            <Label className="field-label">Full Name *</Label>
            <Input
              placeholder="John Doe"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label className="field-label">Phone *</Label>
              <Input
                placeholder="555-0000"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label className="field-label">Gender *</Label>
              <Select
                value={formData.gender}
                onValueChange={(v) =>
                  setFormData({ ...formData, gender: v })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label className="field-label">Date of Birth *</Label>
              <DatePicker
                date={formData.dob ? new Date(formData.dob) : undefined}
                onChange={(date) =>
                  setFormData({
                    ...formData,
                    dob: date ? format(date, "yyyy-MM-dd") : "",
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label className="field-label">Address</Label>
              <Input
                placeholder="123 Main St"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
              />
            </div>
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={isRegistering}
          >
            {isRegistering ? "Registering..." : "Register patient"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
