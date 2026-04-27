"use client";
import { PatientList } from "./PatientList";
import { AddPatientDialog } from "./AddPatientDialog";
import { AddAppointmentDialog } from "./AddAppoitmentDailog";
import { useSelectorHook } from "@/hooks/useSelector";
import { PatientWithUser } from "@/type/types";

export default function ReceptionistDashboard({
  patients,
}: {
  patients: PatientWithUser[] | undefined;
}) {
  const selectedTab = useSelectorHook((state) => state.receptionistReducer);

  return (
    <div className="flex h-screen bg-background text-foreground">
      {/* Sidebar */}

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
        {selectedTab.type === "patients" && patients && (
          <PatientList patients={patients} componentType="patient" />
        )}

        {selectedTab.type === "appointments" && (
          <div className="text-sm text-muted-foreground">
            {/* Placeholder for Appointment Calendar / List */}
            Appointment Calendar / List will appear here
          </div>
        )}

        {selectedTab.type === "visits" && patients && (
          <div className="text-sm text-muted-foreground">
            {/* Placeholder for Visits Table / List */}
            {/* <PatientList
              componentType="visit"
            /> */}
          </div>
        )}
      </main>
    </div>
  );
}

