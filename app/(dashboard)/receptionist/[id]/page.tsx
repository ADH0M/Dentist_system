import ReceptionistDashboard from "@/components/layout/receptionist/Dashboard";
import { getTodayPatients } from "@/lib/actions/patientActions";
import AssistantPatientForm from "@/pages/AssistantForm";
import DrAssistantForm from "@/pages/DrAssistantForm";

const page = async () => {
  const patients = await getTodayPatients();

  return (
    <>
      {patients.success && <ReceptionistDashboard patients={patients.data} />}

      <DrAssistantForm />
    </>
  );
};

export default page;
