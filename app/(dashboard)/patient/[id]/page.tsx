import { PatientHeader } from "@/components/patient/patientHeader";
import { PatientQuickStats } from "@/components/patient/PatientQuickStats";
import { PatientTabs } from "@/components/patient/PatientTabs";

export default function Page() {
  const patient = {
    id: "1",
    name: "Ahmed Mohamed",
    phone: "01000000000",
    gender: "Male",
    age: 29,
    lastVisit: "12 May 2026",
    nextAppointment: "20 May 2026",
  };

  const stats = {
    totalVisits: 12,
    upcomingAppointments: 2,
    outstandingInvoices: 1,
    totalPaid: 340,
  };

  const patientId = '123';

  return (
    <div className=" container space-y-4 p-4">
      <PatientQuickStats stats={stats} />
      <PatientHeader patient={patient} />
      <PatientTabs patientId={patientId} />
    </div>
  );
}
