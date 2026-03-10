"use client"

import { Button } from "@/components/ui/button"
import { AppointmentList } from "./AppointmentList"

type Appointment = {
  id: string
  startTime: string
  endTime: string
  doctorName?: string
  status: string
  notes?: string
}

type Props = {
  patientId: string
}

export function AppointmentsTab({ patientId }: Props) {

  // temporary mock data
  const appointments: Appointment[] = [
    {
      id: "1",
      startTime: "20 May 2026 10:00",
      endTime: "20 May 2026 10:30",
      doctorName: "Ahmed",
      status: "scheduled",
      notes: "Routine check"
    },
    {
      id: "2",
      startTime: "15 May 2026 12:00",
      endTime: "15 May 2026 12:30",
      doctorName: "Sara",
      status: "completed"
    }
  ]

  return (
    <div className="space-y-6">

      <div className="flex justify-between items-center">

        <h3 className="text-lg font-semibold text-foreground">
          Appointments
        </h3>

        <Button>
          New Appointment
        </Button>

      </div>

      <AppointmentList appointments={appointments} />

    </div>
  )
}