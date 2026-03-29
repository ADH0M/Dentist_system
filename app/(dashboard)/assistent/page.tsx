import ReceptionistDashboard from "@/components/layout/receptionist/Dashboard";
import { getTodayPatients } from "@/lib/actions/patientActions";
import AssistantPatientForm from "@/pages/AssistantForm";
import DrAssistantForm from "@/pages/DrAssistantForm";

const page = async () => {
  const patients = await getTodayPatients();
  console.log(patients);

  return (
    <>
      {patients.success && (
        <ReceptionistDashboard patients={patients.data} />
      )}
      {/* <AssistantPatientForm/>
    <DrAssistantForm/> */}
    </>
  );
};

export default page;
