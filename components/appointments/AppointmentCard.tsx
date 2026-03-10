"use client"

import { Badge } from "@/components/ui/badge"

type Appointment = {
  id: string
  startTime: string
  endTime: string
  doctorName?: string
  status: string
  notes?: string
}

export function AppointmentCard({ appointment }: { appointment: Appointment }) {
  return (
    <div className="bg-card border border-border rounded-lg shadow-sm p-4 flex justify-between items-start">

      <div className="space-y-2">

        <p className="text-sm text-muted-foreground">
          {appointment.startTime} - {appointment.endTime}
        </p>

        <h4 className="text-foreground font-medium">
          Dr. {appointment.doctorName ?? "—"}
        </h4>

        {appointment.notes && (
          <p className="text-sm text-muted-foreground">
            {appointment.notes}
          </p>
        )}

      </div>

      <Badge variant="secondary">
        {appointment.status}
      </Badge>

    </div>
  )
}