"use client";

import React, { lazy, memo, Suspense, useState } from "react";
import { Button } from "@/components/ui/button";
import { PatientWithUser } from "@/type/types";
const PatientDetailsSheet = lazy(() => import("./PatientDetailsSheet"));

function PatientCard({
  patient,
  num,
  componentType,
}: {
  patient: PatientWithUser;
  num: number;
  componentType: "patient" | "appointment" | "visit";
}) {
  const [open, setOpen] = useState(false);

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
          {num + 1}
        </span>
        <h4 className="font-semibold text-foreground ">
          {patient.user.username}
        </h4>
        {patient.user.phone && (
          <p className="text-sm text-muted-foreground">{patient.user.phone}</p>
        )}
        {patient.user.gender && (
          <p className="text-sm text-muted-foreground ">
            gender: {patient.user.gender}
          </p>
        )}

        {/* {componentType === "visit" && (
          <p className="text-sm text-muted-foreground ">
            visit type : {patient.visits[patient.visits.length-1].type || ""}
          </p>
        )} */}
        <Button size="sm" onClick={() => setOpen(true)}>
          View Details
        </Button>
      </div>

      <Suspense fallback={<div>loading</div>}>
        <PatientDetailsSheet
          patient={patient}
          open={open}
          onOpenChange={setOpen}
          componentType={componentType}
        />
      </Suspense>
    </>
  );
}

export default memo(PatientCard);
