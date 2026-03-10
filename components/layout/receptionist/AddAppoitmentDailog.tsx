"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type Patient = { id: string; name: string }

type AddAppointmentDialogProps = {
  patients: Patient[]
  onAdd: (appointment: { patientId: string; date: string; time: string }) => void
}

export function AddAppointmentDialog({ patients, onAdd }: AddAppointmentDialogProps) {
  const [open, setOpen] = React.useState(false)
  const [patientId, setPatientId] = React.useState<string | undefined>()
  const [date, setDate] = React.useState("")
  const [time, setTime] = React.useState("")

  const handleSubmit = () => {
    if (!patientId || !date || !time) return alert("All fields are required")
    onAdd({ patientId, date, time })
    setPatientId(undefined)
    setDate("")
    setTime("")
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add Appointment</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>New Appointment</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <div>
            <Label>Patient</Label>
            <Select value={patientId} onValueChange={setPatientId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a patient" />
              </SelectTrigger>
              <SelectContent>
                {patients.map((p) => (
                  <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Date</Label>
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div>
            <Label>Time</Label>
            <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
          </div>
          <Button onClick={handleSubmit}>Add Appointment</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}