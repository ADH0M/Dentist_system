"use client"

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"

type Patient = {
  id: string
  name: string
  phone?: string
  lastVisit?: string
}

type Props = {
  patient: Patient
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PatientDetailsSheet({ patient, open, onOpenChange }: Props) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{patient.name}</SheetTitle>
        </SheetHeader>

        <div className="space-y-6 mt-4">
          <div className="bg-card border border-border rounded-lg p-4">
            <h3 className="font-semibold text-foreground">Patient Info</h3>
            <p className="text-sm text-muted-foreground">Phone: {patient.phone ?? "—"}</p>
            <p className="text-sm text-muted-foreground">Last Visit: {patient.lastVisit ?? "—"}</p>
          </div>

          <div className="bg-card border border-border rounded-lg p-4 space-y-2">
            <h3 className="font-semibold text-foreground">Appointments</h3>
            {/* هنا نضيف AppointmentList لل patient */}
            <p className="text-sm text-muted-foreground">No appointments yet</p>
            <Button size="sm" className="mt-2">Add Appointment</Button>
          </div>

          <div className="bg-card border border-border rounded-lg p-4 space-y-2">
            <h3 className="font-semibold text-foreground">Visits</h3>
            {/* هنا نعرض Visits مختصر مع إمكانية فتح ToothChart */}
            <p className="text-sm text-muted-foreground">No visits yet</p>
            <Button size="sm" className="mt-2">Add Visit</Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}