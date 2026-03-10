"use client";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { PatientList } from "./PatientList";
import { AddPatientDialog } from "./AddPatientDialog";
import { AddAppointmentDialog } from "./AddAppoitmentDailog";

type Patient = {
  id: string;
  name: string;
  phone?: string;
  lastVisit?: string;
};

// Dummy Data
const dummyPatients: Patient[] = [
  { id: "1", name: "Ali Ahmed", phone: "01012345678", lastVisit: "2026-03-01" },
  {
    id: "2",
    name: "Sara Mohamed",
    phone: "01098765432",
    lastVisit: "2026-02-25",
  },
  { id: "3", name: "Omar Khaled", phone: "01011223344" },
];

export default function ReceptionistDashboard() {
  const [selectedTab, setSelectedTab] = useState<
    "patients" | "appointments" | "visits"
  >("patients");

  return (
    <div className="flex h-screen bg-background text-foreground">
      {/* Sidebar */}
      <aside className="w-64 bg-sidebar text-sidebar-foreground border-r border-sidebar-border p-4 flex flex-col gap-4">
        <h2 className="text-xl font-bold mb-4">Receptionist</h2>
        <nav className="flex flex-col gap-2">
          <Button
            variant={selectedTab === "patients" ? "default" : "ghost"}
            onClick={() => setSelectedTab("patients")}
          >
            Patients
          </Button>
          <Button
            variant={selectedTab === "appointments" ? "default" : "ghost"}
            onClick={() => setSelectedTab("appointments")}
          >
            Appointments
          </Button>
          <Button
            variant={selectedTab === "visits" ? "default" : "ghost"}
            onClick={() => setSelectedTab("visits")}
          >
            Visits
          </Button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <div className="flex gap-2">
            <AddPatientDialog
              onAdd={(patient) => console.log("New Patient:", patient)}
            />
            <AddAppointmentDialog
              patients={dummyPatients}
              onAdd={(appt) => console.log("New Appointment:", appt)}
            />
          </div>
        </header>

        {/* Content based on tab */}
        {selectedTab === "patients" && <PatientList patients={dummyPatients} />}

        {selectedTab === "appointments" && (
          <div className="text-sm text-muted-foreground">
            {/* Placeholder for Appointment Calendar / List */}
            Appointment Calendar / List will appear here
          </div>
        )}

        {selectedTab === "visits" && (
          <div className="text-sm text-muted-foreground">
            {/* Placeholder for Visits Table / List */}
            Visits List will appear here
          </div>
        )}
      </main>
    </div>
  );
}
