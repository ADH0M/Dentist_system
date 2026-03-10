import { AppointmentCard } from "./AppointmentCard"

type Appointment = {
  id: string
  startTime: string
  endTime: string
  doctorName?: string
  status: string
  notes?: string
}

export function AppointmentList({
  appointments,
}: {
  appointments: Appointment[]
}) {
  if (!appointments.length) {
    return (
      <div className="bg-card border border-border rounded-lg p-6 text-center text-muted-foreground">
        No appointments found
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {appointments.map((appointment) => (
        <AppointmentCard
          key={appointment.id}
          appointment={appointment}
        />
      ))}
    </div>
  )
}