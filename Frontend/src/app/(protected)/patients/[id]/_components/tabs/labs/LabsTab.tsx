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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { uploadLabFileApi } from "@/services/apiClient";
import { LabsTabProps } from "@/types";
import { flexRender } from "@tanstack/react-table";
import { FileText, Upload } from "lucide-react";
import { toast } from "sonner";

export function LabsTab({
  id,
  permissions,
  labEntries,
  labDialog,
  setLabDialog,
  labFile,
  setLabFile,
  labLoading,
  setLabLoading,
  setCharts,
  handlePreview,
  labTable,
  labColumns,
  router,
}: LabsTabProps) {
  const handleUpload = async () => {
    if (!labFile) return;
    setLabLoading(true);
    try {
      const newEntry = await uploadLabFileApi(id, labFile);
      setCharts((prev) => [newEntry, ...prev]);
      setLabDialog(false);
      setLabFile(null);
      toast.success("File uploaded successfully");
      router.refresh();
    } catch (error) {
      toast.error("Upload failed", {
        description:
          error instanceof Error ? error.message : "Try again.",
      });
    } finally {
      setLabLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {permissions?.canUploadLabs && (
        <Dialog open={labDialog} onOpenChange={setLabDialog}>
          <DialogTrigger asChild>
            <Button variant="outline">
              <Upload className="mr-2 h-4 w-4" />
              Upload Lab Result
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload lab result</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="field-label">Lab File</Label>
                <Input
                  type="file"
                  onChange={(e) => setLabFile(e.target.files?.[0] || null)}
                />
              </div>
              <Button
                className="w-full"
                disabled={!labFile || labLoading}
                onClick={handleUpload}
              >
                {labLoading ? "Uploading..." : "Start Upload"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
      <div className="mobile-data-stack md:hidden">
        <div className="grid gap-4">
          {labEntries.map((entry) => (
            <Card key={entry.id}>
              <CardContent className="space-y-3 p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {entry.userName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(entry.createdDt).toLocaleDateString("en-US")}
                    </p>
                  </div>
                  <Badge variant="secondary">Lab</Badge>
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
                    Download Report
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="hidden md:block">
        <Card className="overflow-hidden border-border/80">
          <Table>
            <TableHeader>
              {labTable.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {labTable.getRowModel().rows?.length ? (
                labTable.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={labColumns.length}
                    className="h-24 text-center"
                  >
                    <EmptyState
                      icon={Upload}
                      title="No lab results yet"
                      description="Upload-backed diagnostics and lab chart entries will show here once results are attached."
                      compact
                      className="border-0 bg-transparent"
                    />
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  );
}
