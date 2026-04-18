"use client";

import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { PatientSearchProps } from "@/types";
import { ChevronRight, Search, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";


export function PatientSearch({ patients }: PatientSearchProps) {
  const router = useRouter();
  const [search, setSearch] = useState("");

  const filteredPatients = search.trim()
    ? patients.filter(
        (patient) =>
          patient.name.toLowerCase().includes(search.toLowerCase()) ||
          patient.phone.includes(search) ||
          patient.id.toLowerCase().includes(search.toLowerCase()),
      )
    : [];

  return (
    <div className="overflow-hidden rounded-[calc(var(--radius)+2px)] border border-border/90 bg-card shadow-sm">
      <div className="flex items-center gap-3 border-b border-border/70 px-4 py-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
          <Search className="h-4 w-4 text-primary" />
        </div>
        <div className="min-w-0">
          <h2 className="text-sm font-semibold tracking-tight text-foreground">
            Quick patient lookup
          </h2>
          <p className="text-xs text-muted-foreground">Search by name, phone, or ID</p>
        </div>
      </div>
      
      <div className="p-3.5 border-b border-border/50 bg-muted/5">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search patients..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="h-9 rounded-xl border-border/80 bg-background pl-9 pr-9 text-sm placeholder:text-muted-foreground/60 focus:border-primary/50 focus:ring-2 focus:ring-primary/10"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      <div className="!p-0 min-h-[40px]">
        {filteredPatients.length > 0 ? (
          <div className="max-h-72 overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="pl-8 h-9 py-2">Patient</TableHead>
                  <TableHead className="h-9 py-2">ID</TableHead>
                  <TableHead className="h-9 py-2 pr-8 text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPatients.map((patient) => (
                  <TableRow
                    key={patient.id}
                    onClick={() => router.push(`/patients/${patient.id}`)}
                    className="cursor-pointer group"
                  >
                    <TableCell className="pl-8 py-2.5">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-primary/20 bg-primary/5 text-[10px] font-bold text-primary">
                          {patient.name.charAt(0)}
                        </div>
                        <span className="truncate max-w-[120px] font-medium text-foreground">
                          {patient.name}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="py-2.5">
                      <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground">
                        {patient.id.slice(0, 6)}
                      </span>
                    </TableCell>
                    <TableCell className="py-2.5 pr-8 text-right">
                      <ChevronRight className="ml-auto h-3.5 w-3.5 text-muted-foreground/40 group-hover:text-primary transition-colors" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : search.trim() ? (
          <div className="animate-in fade-in flex flex-col items-center py-8 text-center duration-200">
            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-muted">
              <Search className="h-5 w-5 text-muted-foreground/50" />
            </div>
            <p className="text-sm font-medium text-foreground">No matches</p>
          </div>
        ) : (
          <div className="flex flex-col items-center py-6 text-center text-muted-foreground/40">
            <p className="text-[10px] font-medium uppercase tracking-widest">Awaiting input</p>
          </div>
        )}
      </div>
    </div>
  );
}
