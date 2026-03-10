"use client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

type PatientHeaderProps = {
  patient: {
    id: string;
    name: string;
    phone?: string;
    gender?: string;
    age?: number;
    avatar?: string;
    lastVisit?: string;
    nextAppointment?: string;
  };
};

export function PatientHeader({ patient }: PatientHeaderProps) {
  return (
    <div className="bg-card border border-border rounded-lg shadow-sm p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
      {/* Patient Info */}
      <div className="flex items-center gap-4">
        <Avatar className="h-14 w-14">
          <AvatarImage src={patient.avatar} />
          <AvatarFallback>
            {patient.name.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="space-y-1">
          <h2 className="text-xl font-semibold text-foreground">
            {patient.name}
          </h2>

          <p className="text-sm text-muted-foreground">
            {patient.gender} • {patient.age} years
          </p>

          <p className="text-sm text-muted-foreground">📞 {patient.phone}</p>
        </div>
      </div>

      {/* Visits Info */}
      <div className="flex flex-col text-sm text-muted-foreground gap-1">
        <p>
          Last Visit:{" "}
          <span className="text-foreground">{patient.lastVisit ?? "—"}</span>
        </p>

        <p>
          Next Appointment:{" "}
          <span className="text-foreground">
            {patient.nextAppointment ?? "—"}
          </span>
        </p>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Button variant="secondary">Edit Patient</Button>

        <Button>New Appointment</Button>

        <Button variant="outline">Start Visit</Button>
      </div>
    </div>
  );
}
