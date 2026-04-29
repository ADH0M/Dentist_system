"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PatientWithUser } from "@/type/types";
import { RejectedToast } from "@/lib/utils/toasts";

type AddAppointmentDialogProps = {
  patients: PatientWithUser[];
  onAdd: (appointment: {
    patientId: string;
    date: string;
    time: string;
  }) => void;
};

export function AddAppointmentDialog({
  patients,
  onAdd,
}: AddAppointmentDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [patientId, setPatientId] = React.useState<string | undefined>();
  const [date, setDate] = React.useState("");
  const [time, setTime] = React.useState("");

  const handleSubmit = () => {
    if (!patientId || !date || !time) {
      RejectedToast("All fields are required");
      return ;
    }
    onAdd({ patientId, date, time });
    setPatientId(undefined);
    setDate("");
    setTime("");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add Appointment</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md border-border">
        <DialogHeader>
          <DialogTitle>New Appointment</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <div>
            <Label>Patient</Label>
            <Select value={patientId} onValueChange={setPatientId}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select a patient" />
              </SelectTrigger>
              <SelectContent>
                {patients.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.user.username}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Date</Label>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label>Time</Label>
            <Input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="mt-1"
            />
          </div>
          <Button onClick={handleSubmit}>Add Appointment</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
