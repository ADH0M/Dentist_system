"use client";

import React, { lazy, memo, useState } from "react";
import { Button } from "@/components/ui/button";
import { PatientWithVisits } from "@/lib/actions/patientActions";
const PatientDetailsSheet = lazy(() => import("./PatientDetailsSheet"));

function PatientCard({
  patient,
  num,
  componentType,
}: {
  patient: PatientWithVisits;
  num: number;
  componentType: "patient" | "appointment" | "visit";
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="bg-card relative border border-border rounded-lg p-4 shadow-sm flex flex-col gap-2 cursor-pointer hover:bg-accent transition">
        <span className="bg-primary absolute top-2 right-2 w-8 h-8 flex justify-center items-center rounded-full text-center">
          {num + 1}
        </span>
        <h4 className="font-semibold text-foreground">{patient.name}</h4>
        {patient.phone && (
          <p className="text-sm text-muted-foreground">{patient.phone}</p>
        )}
        {patient.gender && (
          <p className="text-sm text-muted-foreground ">
            gender: {patient.gender}
          </p>
        )}

        {componentType === "visit" && (
          <p className="text-sm text-muted-foreground ">
            visit type : {patient.visits[patient.visits.length-1].type || ""}
          </p>
        )}
        <Button size="sm" onClick={() => setOpen(true)}>
          View Details
        </Button>
      </div>

      <PatientDetailsSheet
        patient={patient}
        open={open}
        onOpenChange={setOpen}
        componentType={componentType}
      />
    </>
  );
}

export default memo(PatientCard);
