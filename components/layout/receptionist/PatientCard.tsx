"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { PatientDetailsSheet } from "./PatientDetailsSheet"

type Patient = {
  id: string
  name: string
  phone?: string
  lastVisit?: string
  birthdate?:string;
  gender?:string;
}

export function PatientCard({ patient ,num}: { patient: Patient,num:number }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <div className="bg-card relative border border-border rounded-lg p-4 shadow-sm flex flex-col gap-2 cursor-pointer hover:bg-accent transition">
        <span className="bg-primary absolute top-2 right-2 w-8 h-8 flex justify-center items-center rounded-full text-center">{num+1}</span>
        <h4 className="font-semibold text-foreground">{patient.name}</h4>
        {patient.phone && <p className="text-sm text-muted-foreground">{patient.phone}</p>}
        {patient.gender && <p className="text-sm text-muted-foreground ">gender: {patient.gender}</p>}
        <Button size="sm" onClick={() => setOpen(true)}>View Details</Button>
        
      </div>

      <PatientDetailsSheet
        patient={patient}
        open={open}
        onOpenChange={setOpen}
      />
    </>
  )
}