"use client";

import { memo, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import ToothChart  from "@/components/tooth-chart/ToothChart";

type Visit = {
  id: string;
  visitDate: string;
  chiefComplaint?: string;
  diagnosis?: string;
  treatmentPlan?: string;
  proceduresDone?: string;
  doctor?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  toothChart?: Record<string, any>;
};

type Props = {
  visit: Visit | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

function VisitDetailsSheet({ visit, open, onOpenChange }: Props) {
  const [chart, setChart] = useState(visit?.toothChart || {});

  const handleSaveChart = () => {
    // هنا سترسل البيانات إلى backend / Prisma
    console.log("Saving Tooth Chart:", chart);
  };

  if (!visit) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Visit - {visit.visitDate}</SheetTitle>
        </SheetHeader>

        <div className="space-y-2  p-2">
          {/* Visit Info */}
          <div className="bg-card border border-border rounded-lg p-4 space-y-2">
            <h3 className="text-sm font-semibold text-foreground">
              Visit Information
            </h3>
            <p className="text-sm text-muted-foreground">
              Doctor: {visit.doctor ?? "—"}
            </p>
            <p className="text-sm text-muted-foreground">
              Chief Complaint: {visit.chiefComplaint ?? "—"}
            </p>
          </div>

          {/* Diagnosis */}
          <div className="bg-card border border-border rounded-lg p-4 space-y-2">
            <h3 className="text-sm font-semibold text-foreground">Diagnosis</h3>
            <p className="text-sm text-muted-foreground">
              {visit.diagnosis ?? "No diagnosis recorded"}
            </p>
          </div>

          {/* Treatment Plan */}
          <div className="bg-card border border-border rounded-lg p-4 space-y-2">
            <h3 className="text-sm font-semibold text-foreground">
              Treatment Plan
            </h3>
            <p className="text-sm text-muted-foreground">
              {visit.treatmentPlan ?? "No treatment plan"}
            </p>
          </div>

          {/* Procedures */}
          <div className="bg-card border border-border rounded-lg p-4 space-y-2">
            <h3 className="text-sm font-semibold text-foreground">
              Procedures Done
            </h3>
            <p className="text-sm text-muted-foreground">
              {visit.proceduresDone ?? "No procedures recorded"}
            </p>
          </div>

          {/* Tooth Chart */}
          <div className="bg-card border border-border rounded-lg p-4">
            <h3 className="text-sm font-semibold text-foreground mb-3">
              Tooth Chart
            </h3>

            <ToothChart
              chart={chart}
              onChange={(updated) => setChart(updated)}
            />

            <button
              className="mt-3 px-4 py-2 bg-primary text-primary-foreground rounded hover:opacity-90"
              onClick={handleSaveChart}
            >
              Save Tooth Chart
            </button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default memo(VisitDetailsSheet);
