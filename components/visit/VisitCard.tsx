"use client";


import { memo, useState } from "react";
import  VisitDetailsSheet  from "../visitDetailsSheet/VisitDetailsSheet";

type Visit = {
  id: string;
  visitDate: string;
  chiefComplaint?: string;
  diagnosis?: string;
  treatmentPlan?: string;
  doctor?: string;
};

 function VisitCard({ visit }: { visit: Visit }) {

  const [open, setOpen] = useState(false)

  return (
    <>
      <div
        onClick={() => setOpen(true)}
        className="bg-card border border-border rounded-lg shadow-sm p-4 flex flex-col gap-3 cursor-pointer hover:bg-accent transition"
      >
        <h4 className="text-foreground font-semibold">{visit.visitDate}</h4>
        {visit.diagnosis && (
          <p className="text-sm text-muted-foreground">
            Diagnosis: {visit.diagnosis}
          </p>
        )}
      </div>

      <VisitDetailsSheet
        visit={visit}
        open={open}
        onOpenChange={setOpen}
      />
    </>
  )
}

export default memo(VisitCard);