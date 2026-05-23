import ReceptionistDashboard from "@/components/layout/receptionist/Dashboard";
import { getTodayPatients } from "@/lib/actions/patientActions";
import AssistantPatientForm from "@/components/pages/AssistantForm";
import DrAssistantForm from "@/components/pages/DrAssistantForm";

const page = async () => {
  const patients = await getTodayPatients();   
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
