"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import { EmptyState } from "@/components/ui/empty-state";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { HistoryTabProps } from "@/types";
import { ClipboardList, FileText, Plus, Trash2, User } from "lucide-react";
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
    <div className="space-y-4">
      <div className="toolbar-row">
        <Select value={chartFilter} onValueChange={setChartFilter}>
          <SelectTrigger className="w-full sm:w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="visit">Visits</SelectItem>
            <SelectItem value="vitals">Vitals</SelectItem>
            <SelectItem value="lab">Labs</SelectItem>
            <SelectItem value="note">Notes</SelectItem>
          </SelectContent>
        </Select>
        {permissions?.canEditCharting && user?.role !== "auditor" && (
          <Dialog open={chartDialog} onOpenChange={setChartDialog}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                Add Entry
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>New chart entry</DialogTitle>
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

      <div className="space-y-4">
        {sortedCharts.map((entry) => (
          <div
            key={entry.id}
            className={`flex gap-3 ${entry.userId === user?.id ? "justify-end" : ""}`}
          >
            {entry.userId !== user?.id && (
              <div className="hidden pt-1 sm:block">
                <div className="rounded-full bg-primary/12 p-2 text-primary">
                  <User className="h-4 w-4" />
                </div>
              </div>
            )}
            <Card className={`w-full max-w-3xl ${entry.userId === user?.id ? "border-primary/20 bg-primary/5" : ""}`}>
              <CardContent className="space-y-3 p-5">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {entry.userId === user?.id ? "You" : entry.userName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(entry.createdDt).toLocaleDateString("en-US")}{" "}
                      {new Date(entry.createdDt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <Badge variant={typeBadgeVariant(entry.type) as never}>
                    {entry.type}
                  </Badge>
                  {permissions?.canDeleteData && user?.role !== "auditor" && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-destructive hover:bg-destructive/10"
                      onClick={() => handleDeleteChartEntry(entry.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </div>
                <p className="text-sm leading-6 text-foreground">
                  {entry.comments}
                </p>
                {entry.upload && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handlePreview(entry.upload!)}
                    className="h-auto w-fit gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/20"
                  >
                    <FileText className="h-3.5 w-3.5" />
                    View Lab Report
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        ))}
        {sortedCharts.length === 0 && (
          <Card>
            <CardContent className="p-0 md:p-0">
              <EmptyState
                icon={ClipboardList}
                title="No chart entries yet"
                description="Visits, notes, vitals, and lab-linked entries will appear once the care team starts documenting this record."
                compact
                className="min-h-40 border-0 bg-transparent"
              />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
