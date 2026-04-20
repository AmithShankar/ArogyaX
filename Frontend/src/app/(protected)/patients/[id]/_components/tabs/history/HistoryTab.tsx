"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { HistoryTabProps } from "@/types";
import { ClipboardList, FileText, Plus, Trash2, User, Activity, Sparkles } from "lucide-react";
import { typeBadgeVariant } from "../../../_utils/patient-constants";
import { ChartEntryForm } from "./ChartEntryForm";

export function HistoryTab({
  id,
  user,
  permissions,
  charts,
  chartFilter,
  setChartFilter,
  chartDialog,
  setChartDialog,
  handleDeleteChartEntry,
  handlePreview,
  setCharts,
  router,
}: HistoryTabProps) {
  const filteredCharts = chartFilter === "all"
    ? charts
    : charts.filter((chart) => chart.type === chartFilter);
    
  const sortedCharts = [...filteredCharts].sort(
    (left, right) => new Date(right.createdDt).getTime() - new Date(left.createdDt).getTime()
  );

  return (
    <div className="space-y-8 pb-10">
      {/* Visual Header - Unified Design */}
      <div className="flex items-center justify-between gap-4 py-4 px-3 rounded-[2.5rem] border border-border/40 bg-card/30 backdrop-blur-md shadow-sm">
        <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary border border-primary/20 shadow-inner">
                <Activity className="h-6 w-6 animate-pulse" />
            </div>
            <div>
                <h3 className="text-lg md:text-xl font-black tracking-tight text-foreground flex items-center gap-2">
                    Clinical Stream
                    <Sparkles className="h-4 w-4 text-primary animate-pulse" />
                </h3>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60">Pixel-Perfect Identity Sync</p>
            </div>
        </div>

        <div className="flex items-center gap-3">
            <Select value={chartFilter} onValueChange={setChartFilter}>
            <SelectTrigger className="h-10 w-full sm:w-44 border-border bg-background shadow-xs rounded-xl font-bold text-xs uppercase tracking-wider">
                <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-border backdrop-blur-3xl">
                <SelectItem value="all">Comprehensive</SelectItem>
                <SelectItem value="visit">Visits Only</SelectItem>
                <SelectItem value="vitals">Core Vitals</SelectItem>
                <SelectItem value="lab">Lab Files</SelectItem>
                <SelectItem value="note">Staff Notes</SelectItem>
            </SelectContent>
            </Select>
            {permissions?.canEditCharting && user?.role !== "auditor" && (
            <Dialog open={chartDialog} onOpenChange={setChartDialog}>
                <DialogTrigger asChild>
                <Button className="h-10 bg-primary font-black shadow-lg shadow-primary/25 rounded-xl px-6 transition-all hover:scale-[1.03] active:scale-95 text-xs uppercase tracking-widest">
                    <Plus className="mr-1.5 h-4 w-4" />
                    New Log
                </Button>
                </DialogTrigger>
                <DialogContent className="border-border/60 bg-background/95 backdrop-blur-2xl rounded-[2.5rem] max-w-lg shadow-2xl">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-black tracking-tighter mb-2">Digital Clinical Log</DialogTitle>
                </DialogHeader>
                <ChartEntryForm
                    patientId={id}
                    onSuccess={(newEntry) => {
                    setCharts((prev) => [newEntry, ...prev]);
                    setChartDialog(false);
                    router.refresh();
                    }}
                    onCancel={() => setChartDialog(false)}
                />
                </DialogContent>
            </Dialog>
            )}
        </div>
      </div>

      {/* Main Stream Flow */}
      <div className="relative space-y-12 px-2 lg:px-4">
        {/* Central Spine (Mobile Hidden) */}
        <div className="absolute left-[2.75rem] top-0 bottom-0 w-px bg-gradient-to-b from-primary/20 via-border/40 to-transparent hidden sm:block" />

        {sortedCharts.map((entry, idx) => {
          const isCurrentUser = entry.userId === user?.id;
          
          return (
            <div
              key={entry.id}
              className={`group relative flex w-full animate-in fade-in slide-in-from-bottom-2 duration-700
                ${isCurrentUser ? "justify-end pl-10 sm:pl-32" : "justify-start pr-10 sm:pr-32"}`}
              style={{ animationDelay: `${idx * 80}ms` }}
            >
              <div className={`flex max-w-full gap-5 ${isCurrentUser ? "flex-row-reverse" : "flex-row"}`}>
                
                {/* Avatar Orb */}
                <div className="relative flex flex-shrink-0 flex-col items-center">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-2xl border transition-all duration-500 shadow-sm group-hover:shadow-md
                    ${isCurrentUser 
                      ? "border-primary/40 bg-primary/20 text-primary group-hover:scale-110" 
                      : "border-border/80 bg-muted text-muted-foreground group-hover:scale-110"}`}
                  >
                    <User className="h-5.5 w-5.5" />
                  </div>
                  {/* Status Indicator Glow */}
                  <div className={`absolute -right-1 -top-1 h-3 w-3 rounded-full border-2 border-background animate-pulse
                    ${isCurrentUser ? "bg-primary" : "bg-muted-foreground/30"}`} 
                  />
                </div>

                {/* Bubble Stack */}
                <div className={`flex flex-col gap-2 ${isCurrentUser ? "items-end text-right" : "items-start text-left"}`}>
                  {/* Bubble Identity */}
                  <div className="flex items-center gap-3 px-1">
                    <span className="text-[11px] font-black tracking-widest text-foreground/80 uppercase">
                      {entry.userName}
                    </span>
                    <Badge variant="outline" className={`h-4.5 border-0 rounded-md px-2 py-0 text-[8.5px] font-black uppercase tracking-[0.15em] leading-none shadow-sm
                        ${isCurrentUser 
                          ? "text-primary bg-primary/10 shadow-primary/5" 
                          : "text-muted-foreground bg-muted shadow-black/5"}`}
                    >
                      {entry.userRole}
                    </Badge>
                  </div>

                  {/* Primary Data Bubble */}
                  <div className={`relative overflow-hidden border p-5 sm:p-6 shadow-sm transition-all duration-500 group-hover:shadow-xl group-hover:-translate-y-1
                    ${isCurrentUser 
                      ? "rounded-[2.2rem] rounded-tr-none border-primary/25 bg-background dark:bg-primary/[0.08]" 
                      : "rounded-[2.2rem] rounded-tl-none border-border bg-card dark:bg-card/40"}`}
                  >
                    {/* Atmospheric depth layer for light mode contrast */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />

                    {/* Content Block */}
                    <div className="relative z-10 text-[14px] leading-[1.65] tracking-tight text-foreground/90 whitespace-pre-wrap font-medium">
                      {entry.comments}
                    </div>

                    {entry.upload && (
                      <div className="relative z-10 mt-6 pt-5 border-t border-border/50">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handlePreview(entry.upload!)}
                          className={`h-11 w-full gap-3 rounded-2xl border px-5 font-black tracking-tighter transition-all hover:scale-[1.02] active:scale-[0.98]
                                ${isCurrentUser 
                                  ? "border-primary/20 bg-primary/5 text-primary hover:bg-primary/10" 
                                  : "border-border bg-muted/40 text-foreground/70 hover:bg-muted/60"}`}
                        >
                          <FileText className="h-4.5 w-4.5" />
                          ACCESS CLINICAL DATA
                        </Button>
                      </div>
                    )}

                    {/* Metadata Footer */}
                    <div className="relative z-10 mt-6 flex items-center justify-between gap-8 border-t border-border/50 pt-5">
                      <div className="flex items-center gap-4">
                        <div className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-[9px] font-black uppercase tracking-[0.2em] shadow-inner
                            ${isCurrentUser ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}
                        >
                            <span className={`h-1.5 w-1.5 rounded-full ${isCurrentUser ? "bg-primary" : "bg-muted-foreground/40"}`} />
                            {entry.type}
                        </div>
                        
                        {permissions?.canDeleteData && user?.role !== "auditor" && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 opacity-0 transition-all duration-300 group-hover:opacity-100 hover:bg-destructive/10 hover:text-destructive"
                            onClick={() => handleDeleteChartEntry(entry.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      
                      <div className="flex flex-col items-end whitespace-nowrap">
                        <span className="text-[10px] font-black tracking-tight text-foreground uppercase opacity-80">
                            {new Date(entry.createdDt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                        <span className="text-[8.5px] font-bold uppercase tracking-[0.1em] text-muted-foreground opacity-60">
                            {new Date(entry.createdDt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {sortedCharts.length === 0 && (
          <div className="flex flex-col items-center justify-center py-32 text-center animate-fade-in">
            <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-[2.5rem] border border-border bg-card shadow-xl">
              <ClipboardList className="h-11 w-11 text-muted-foreground/30" />
            </div>
            <h3 className="text-2xl font-black text-foreground/80 tracking-tighter">Clinical Buffer Empty</h3>
            <p className="mt-3 max-w-xs text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground leading-relaxed opacity-60">
                Awaiting first clinical pulse entry
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
