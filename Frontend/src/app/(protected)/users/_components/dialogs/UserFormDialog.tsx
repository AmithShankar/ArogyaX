"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle
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
import { ROLE_LABELS, UserFormDialogProps, UserRole } from "@/types";
import { Copy } from "lucide-react";
import { toast } from "sonner";

export function UserFormDialog({
  open,
  onOpenChange,
  isEditing,
  name,
  setName,
  phone,
  setPhone,
  role,
  setRole,
  jobTitle,
  setJobTitle,
  generatedPassword,
  isSubmitting,
  onSubmit,
  allRoles,
}: UserFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit user" : "Create new user"}</DialogTitle>
        </DialogHeader>
        <form className="space-y-4" onSubmit={onSubmit}>
          <div className="space-y-2">
            <Label className="field-label">Full Name</Label>
            <Input
              placeholder="Jane Doe"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label className="field-label">Phone</Label>
              <Input
                placeholder="9876543210"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label className="field-label">Role</Label>
              <Select value={role} onValueChange={(value) => setRole(value as UserRole)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {allRoles.map((r: UserRole) => (
                    <SelectItem key={r} value={r}>
                      {ROLE_LABELS[r]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label className="field-label">Job Title</Label>
            <Input
              placeholder="Registered Nurse"
              value={jobTitle}
              onChange={(event) => setJobTitle(event.target.value)}
            />
          </div>
          {!isEditing && (
            <div className="space-y-2">
              <Label className="field-label">Generated Password</Label>
              <div className="flex gap-2">
                <Input value={generatedPassword} readOnly className="font-mono text-sm" />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    navigator.clipboard.writeText(generatedPassword);
                    toast("Copied!");
                  }}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                The user will be prompted to rotate this on first sign in.
              </p>
            </div>
          )}
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting
              ? isEditing
                ? "Saving changes..."
                : "Creating user..."
              : isEditing
              ? "Save changes"
              : "Create user"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
