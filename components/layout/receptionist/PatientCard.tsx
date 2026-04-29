"use client";

import React, { lazy, memo, Suspense, useState } from "react";
import { Button } from "@/components/ui/button";
import { PhoneIcon, UserIcon } from "lucide-react";
import { UserInfo } from "@/type/types";
import { UserSimpleInfo } from "./ReceptionistSearch";
const PatientDetailsSheet = lazy(() => import("./PatientDetailsSheet"));


function PatientCard({
  patient,
  num,
  componentType,
}: {
  patient: UserSimpleInfo;
  num: number;
  componentType: string;
}) {
  const [open, setOpen] = useState(false);

  if (!patient) return;
  return (
    <>
      {componentType === "cards" && (
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
      )}

      {componentType === "list" && (
        <li
          key={patient.patientId +" "}
          className="border-b p-2  text-chart-2 w-full relative"
        >
          <p className="font-medium flex items-center gap-1 w-full p-1">
            <UserIcon size={14} className="text-accent-foreground" />
            <span>{patient.username}</span>
          </p>
          <p className="text-sm text-accent flex items-center gap-1 p-1">
            <PhoneIcon size={14} className="text-accent-foreground" />
            <span>{patient.phone}</span>
          </p>
          <Button size="sm" className="absolute text-xs right-4 top-1/2 cursor-pointer -translate-y-1/2" 
          onClick={() => setOpen(true)}>
            View 
          </Button>
        </li>
      )}
      <Suspense fallback={<div></div>}>
        <PatientDetailsSheet
          patient={patient}
          open={open}
          onOpenChange={setOpen}
        />
      </Suspense>
    </>
  );
}

export default memo(PatientCard);
