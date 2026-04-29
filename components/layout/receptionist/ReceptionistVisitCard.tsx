"use client";
import { lazy, memo, Suspense, useState } from "react";
import { Button } from "@/components/ui/button";
import ReceptionistVisitSheet from "@/components/visitDetailsSheet/ReceptionistVisitSheet";
import type{ SimpleVisitWithUserType } from "@/type/types";

function PatientCard({
  patient,
  ind,
}: {
  patient: SimpleVisitWithUserType;
  ind: number;
}) {
  const [open, setOpen] = useState(false);

  if (!patient) return;
  return (
    <>
      <div
        className="bg-card relative border pt-5 border-border rounded-lg p-4 shadow-sm flex flex-col gap-2 cursor-pointer
       hover:bg-accent transition"
      >
        <span
          className="bg-accent absolute top-2 right-2 w-7 h-7 flex justify-center border border-accent-foreground
        items-center rounded-full text-center text-sm"
        >
          {ind + 1}
        </span>
        <h4 className="font-semibold text-foreground ">{patient.username}</h4>
        {patient.phone && (
          <p className="text-sm text-muted-foreground">{patient.phone}</p>
        )}
        {patient.gender && (
          <p className="text-sm text-muted-foreground ">
            gender: {patient.gender}
          </p>
        )}

        <Button size="sm" onClick={() => setOpen(true)}>
          View Details
        </Button>
      </div>

       <Suspense fallback={<div></div>}>
        <ReceptionistVisitSheet
          patient={patient}
          open={open}
          onOpenChange={setOpen}
        />
      </Suspense> 
    </>
  );
}

export default memo(PatientCard);
