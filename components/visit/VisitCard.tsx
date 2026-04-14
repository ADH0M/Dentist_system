"use client";

import { Visit } from "@/generated/prisma";
import { memo, useState } from "react";

function VisitCard({ visit }: { visit: Visit }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div
        onClick={() => setOpen(true)}
        className="bg-card border border-border rounded-lg shadow-sm p-4 flex flex-col gap-3 
        cursor-pointer hover:bg-accent transition"
      >
        <h4 className="text-foreground font-semibold">
          {visit.createdAt.toLocaleDateString()}
        </h4>
        {visit.diagnosis && (
          <p className="text-sm text-muted-foreground">
            Diagnosis: {visit.diagnosis ||"__"}
          </p>
        )}
      </div>

      {/* <VisitDetailsSheet
        visit={visit}
        open={open}
        onOpenChange={setOpen}
      /> */}
    </>
  );
}

export default memo(VisitCard);
