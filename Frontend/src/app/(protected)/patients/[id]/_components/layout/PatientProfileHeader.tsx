"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PatientProfileHeaderProps } from "@/types";
import { format } from "date-fns";
import { ArrowLeft, Loader2, MapPin, Pencil, Phone, Sparkles, Trash2 } from "lucide-react";

export function PatientProfileHeader({
  patient,
  currentPatient,
  permissions,
  user,
  summaryLoading,
  onBack,
  onEdit,
  onDelete,
  onGenerateSummary,
}: PatientProfileHeaderProps) {
  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="w-fit"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <div className="flex flex-wrap gap-2 text-[10px] uppercase font-bold tracking-wider">
          <Badge variant="outline" className="px-2.5 py-1 border-primary/20 bg-primary/5 text-primary">
            {patient.name}
          </Badge>
          <Badge variant="secondary" className="px-2.5 py-1 bg-muted/50">
            Registered {format(new Date(patient.createdTimestamp), "dd MMM yyyy, HH:mm")}
          </Badge>
        </div>
      </div>

      <section className="page-hero">
        <div className="space-y-3">
          <Badge variant="outline" className="w-fit">
            Patient profile
          </Badge>
          <div className="space-y-1.5">
            <p className="page-kicker">Longitudinal care view</p>
            <h1 className="text-3xl font-semibold tracking-tight text-foreground flex items-center gap-3">
              {patient.name}
              <span className="text-muted-foreground/50 text-xl font-normal">
                {patient.patientId || patient.id.slice(0, 8)}
              </span>
            </h1>
            <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
              Clinical context, prescriptions, labs, and billing arranged in one
              calmer workspace for the care team.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">
              {currentPatient.age} yrs | {currentPatient.gender}
            </Badge>
            <Badge variant="outline" className="gap-2">
              <Phone className="h-3.5 w-3.5" />
              {currentPatient.phone}
            </Badge>
            <Badge variant="outline" className="max-w-full gap-2">
              <MapPin className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{currentPatient.address}</span>
            </Badge>
          </div>
        </div>
        <div className="flex flex-col gap-3 sm:items-end">
          <div className="flex gap-2">
            {permissions?.canEditPatients && !summaryLoading && user?.role !== "auditor" && (
              <>
                <Button variant="outline" size="sm" onClick={onEdit}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit Profile
                </Button>
                {permissions?.canDeleteData && (
                  <Button variant="outline" size="sm" className="text-destructive hover:bg-destructive/5 hover:text-destructive" onClick={onDelete}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Record
                  </Button>
                )}
              </>
            )}
          </div>
          <Button
            onClick={onGenerateSummary}
            disabled={summaryLoading || user?.role === "auditor"}
            className="w-full sm:w-auto"
          >
            {summaryLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="mr-2 h-4 w-4" />
            )}
            Generate Summary
          </Button>
        </div>
      </section>
    </>
  );
}
