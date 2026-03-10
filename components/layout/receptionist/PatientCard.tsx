"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { PatientDetailsSheet } from "./PatientDetailsSheet"

type Patient = {
  id: string
  name: string
  phone?: string
  lastVisit?: string
}

export function PatientCard({ patient }: { patient: Patient }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <div className="bg-card border border-border rounded-lg p-4 shadow-sm flex flex-col gap-2 cursor-pointer hover:bg-accent transition">
        <h4 className="font-semibold text-foreground">{patient.name}</h4>
        {patient.phone && <p className="text-sm text-muted-foreground">{patient.phone}</p>}
        {patient.lastVisit && <p className="text-sm text-muted-foreground">Last Visit: {patient.lastVisit}</p>}
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