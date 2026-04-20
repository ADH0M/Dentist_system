import CreateVisit from "@/components/visit/CreateVisit";
import { getPatient } from "@/lib/actions/patientActions";
import { redirect } from "next/navigation";

const UserDashboard = async ({
  params,
}: {
  params: Promise<{ userId: string }>;
}) => {
  const { userId } = await params;

  if (!userId) redirect("/login");

  const patient = await getPatient(userId);
  if (!patient.success || !patient.data) {
    redirect("/login");
  }

  const p = {
    id: patient.data.id,
    name: patient.data.name,
    phone: patient.data.phone,
    gender: patient.data.gender ?? null,
    totalVisits: patient.data.visits.length,
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-accent-foreground">
          Patient Details
        </h1>
        <p className="text-muted-foreground mt-2">
          View and manage patient information
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-card p-6 rounded-xl shadow-sm border border-border">
          <h2 className="text-xl font-semibold mb-4">Patient Info</h2>
          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b border-border">
              <span className="text-muted-foreground">Name</span>
              <span className="font-medium">{patient.data.name}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-border">
              <span className="text-muted-foreground">Phone</span>
              <span className="font-medium">{patient.data.phone || "—"}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-border">
              <span className="text-muted-foreground">Gender</span>
              <span className="capitalize font-medium">{patient.data.gender || "—"}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-border">
              <span className="text-muted-foreground">Total Visits</span>
              <span className="font-medium">{patient.data.visits.length}</span>
            </div>
          </div>
        </div>

        <div className="bg-card p-6 rounded-xl shadow-sm border border-border">
          <h2 className="text-xl font-semibold mb-4">Create New Visit</h2>
          <CreateVisit patient={p} />
        </div>
      </div>

      {patient.data.visits.length > 0 && (
        <div className="mt-6 bg-card p-6 rounded-xl shadow-sm border border-border">
          <h2 className="text-xl font-semibold mb-4">Visit History</h2>
          <div className="space-y-3">
            {patient.data.visits.slice(-5).reverse().map((visit) => (
              <div key={visit.id} className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">
                  {new Date(visit.createdAt).toLocaleDateString()}
                </span>
                <span className="font-medium">{visit.chiefComplaint || "Checkup"}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;