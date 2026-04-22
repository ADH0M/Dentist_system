import { PatientHeader } from "@/components/patient/patientHeader";
import { PatientQuickStats } from "@/components/patient/PatientQuickStats";
import { PatientTabs } from "@/components/patient/PatientTabs";
import PatientTopbar from "@/components/patient/Topbar";
import { getPatient } from "@/lib/actions/patientActions";
import ProfilePage from "@/pages/profile/ProfilePage";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // const { id } = await params;

  // const patientL = await getPatient(id);
  // console.log(patientL);
  
  // const totalVisits = patientL.data?.visits.length
  //   ? patientL.data?.visits.length
  //   : 0;
  // const totalPaid =
  //   patientL.data?.invoices.reduce(
  //     (sum, inv) => sum + (inv.totalAmount || 0),
  //     0,
  //   ) || 0;
  // const stats = {
  //   totalVisits,
  //   totalPaid,
  // };

  // console.log(patientL.data);



  return (
    <div className="  space-y-4 p-4">
      <PatientTopbar username={'user.name'} type={"patient"} id={'user.id'} />
      {/* <PatientQuickStats stats={stats} /> */}
      {/* <PatientHeader patient={patient} />
      <PatientTabs patient={patientL.data} /> */}
      <ProfilePage />
    </div>
  );
}
