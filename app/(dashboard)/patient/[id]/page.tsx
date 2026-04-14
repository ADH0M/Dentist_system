import { PatientHeader } from "@/components/patient/patientHeader";
import { PatientQuickStats } from "@/components/patient/PatientQuickStats";
import { PatientTabs } from "@/components/patient/PatientTabs";
import { getPatient } from "@/lib/actions/patientActions";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const patientId = "123";

  const patientL = await getPatient("69db9d9e88177c379a5914c8");
  const totalVisits = patientL.data?.visits.length
    ? patientL.data?.visits.length
    : 0;
  const totalPaid = patientL.data?.invoices.length ? 123 : 0;
  const stats = {
    totalVisits,
    totalPaid,
  };

  console.log(patientL.data);

  const patient = {
    id: "1",
    name: patientL.data?.name,
    phone: patientL.data?.phone,
    gender: patientL.data?.gender,
    age: patientL.data?.birthDate,
    lastVisit:
      patientL.data?.visits[patientL.data?.visits.length - 1]?.createdAt,
  };

  return (
    <div className="  space-y-4 p-4">
      <PatientQuickStats stats={stats} />
      <PatientHeader patient={patient} />
      <PatientTabs patient={patientL.data} />
    </div>
  );
}
