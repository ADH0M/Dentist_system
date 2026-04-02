"use client";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { PatientList } from "./PatientList";
import { AddPatientDialog } from "./AddPatientDialog";
import { AddAppointmentDialog } from "./AddAppoitmentDailog";
import { PatientWithVisits } from "@/lib/actions/patientActions";



export default function ReceptionistDashboard({
  patients,
}: {
  patients: PatientWithVisits[] | undefined;
}) {
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
            <AddPatientDialog />
            {patients && (
              <AddAppointmentDialog
                patients={patients}
                onAdd={(appt) => console.log("New Appointment:", appt)}
              />
            )}
          </div>
        </header>

        {/* Content based on tab */}
        {selectedTab === "patients" && patients && (
          <PatientList patients={patients} componentType="patient"/>
        )}

        {selectedTab === "appointments" && (
          <div className="text-sm text-muted-foreground">
            {/* Placeholder for Appointment Calendar / List */}
            Appointment Calendar / List will appear here
          </div>
        )}

        {selectedTab === "visits" && patients && (
          <div className="text-sm text-muted-foreground">
            {/* Placeholder for Visits Table / List */}
            <PatientList patients={patients.filter((p)=>p.visits.length)} componentType="visit"/>
          </div>
        )}
      </main>
    </div>
  );
}
// invoce 
// doctor dashboard  
// patient page 