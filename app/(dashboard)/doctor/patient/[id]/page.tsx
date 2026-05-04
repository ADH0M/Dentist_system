import { notFound } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

import {
  Calendar,
  Phone,
  Mail,
  MapPin,
  Activity,
  DollarSign,
  Image as ImageIcon,
} from "lucide-react";
import PatientRadiology from "@/components/layout/doctor/PatientRadiology";
import PatientVisitsHistory from "@/components/layout/doctor/PatientVisitsHistory";
import PatientMedicalForm from "@/components/layout/doctor/PatientMedicalForm";
import { getPatientData } from "@/lib/actions/patientActions";
import Link from "next/link";
import PatientInvoices from "@/components/layout/doctor/PatientInvoices";
import VisitMedicalForm from "@/components/layout/doctor/VisitMedicalForm";
import { cookies } from "next/headers";
import ToothChart from "@/components/tooth-chart/ToothChart";

export default async function PatientPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const patient = await getPatientData(id);
  const cookieStore = await cookies();
  const uploadedById = cookieStore.get("userId")?.value;

  if (!patient) {
    notFound();
  }

  const { user, latestVisit, allVisits, invoices, images, _count } = patient;

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header with Back Button */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 text-muted-foreground text-xs hover:text-chart-2"
        >
          ← Back to Dashboard
        </Link>
        <h1 className="text-2xl font-bold text-chart-2">
          Patient Medical Record
        </h1>
      </div>

      {/* Patient Basic Information Card */}
      <Card className="border-chart-1 ">
        <CardContent className="pt-6 ">
          <div className="flex flex-col md:flex-row gap-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src={user.profile_avatar || undefined} />
              <AvatarFallback className="text-2xl">
                {user.username.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-2">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-semibold">{user.username}</h2>
                  <p className="text-gray-500">Patient ID: {patient.id}</p>
                </div>
                <div className="flex gap-2">
                  <Badge variant="secondary">
                    {_count.visits} Total Visits
                  </Badge>
                  <Badge variant="outline">
                    Last:{" "}
                    {latestVisit
                      ? new Date(latestVisit.visitDate).toLocaleDateString()
                      : "No visits"}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                {user.phone && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span>{user.phone}</span>
                  </div>
                )}
                {user.email && (
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span>{user.email}</span>
                  </div>
                )}
                {user.birthDate && (
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span>
                      Born: {new Date(user.birthDate).toLocaleDateString()}
                    </span>
                  </div>
                )}
                {user.gender && (
                  <div className="flex items-center gap-2 text-sm">
                    <Activity className="h-4 w-4 text-gray-400" />
                    <span className="capitalize">Gender: {user.gender}</span>
                  </div>
                )}
                {user.address && (
                  <div className="flex items-center gap-2 text-sm col-span-2">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span>{user.address}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs for Patient Information */}

      <Tabs defaultValue="medical" className="space-y-4">
        <TabsList className="grid grid-cols-3 sm:grid-cols-6  w-full px-2 lg:max-w-[85%] ">
          <TabsTrigger value="medical" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Medical Form
          </TabsTrigger>

          <TabsTrigger value="aboutVisit" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            About Visit
          </TabsTrigger>

          <TabsTrigger value="toothChart" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Tooth Chart
          </TabsTrigger>

          <TabsTrigger value="radiology" className="flex items-center gap-2">
            <ImageIcon className="h-4 w-4" />
            Radiology
          </TabsTrigger>

          <TabsTrigger value="history" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Visit History
          </TabsTrigger>

          <TabsTrigger value="invoices" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Invoices
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Medical Form (Client Component) */}
        <TabsContent value="medical">
          <PatientMedicalForm
            initialData={{
              diagnosis: latestVisit?.diagnosis || "",
              proceduresDone: latestVisit?.proceduresDone || "",
              treatmentPlan: latestVisit?.treatmentPlan || "",
              chiefComplaint: latestVisit?.chiefComplaint || "",
            }}
            visitId={latestVisit?.id}
          />
        </TabsContent>

        {/* Tab 2: About Visit Form (Client Component) */}
        <TabsContent value="aboutVisit">
          <VisitMedicalForm
            patientId={patient.id}
            initialData={{
              allergies: patient.allergies || [],
              medications: patient.medications || [],
              notes: patient.notes || "",
            }}
            visitId={latestVisit?.id}
          />
        </TabsContent>

        {/* Tab 3: Visit History */}
        <TabsContent value="history">
          <PatientVisitsHistory visits={allVisits} />
        </TabsContent>

        {/* Tab 4: Invoices */}
        <TabsContent value="invoices">
          <PatientInvoices
            invoices={invoices}
            totalInvoices={_count.invoices}
          />
        </TabsContent>

        {/* Tab 5: Radiology Images */}
        <TabsContent value="radiology">
          <PatientRadiology
            images={images}
            patientId={patient.id}
            uploadedById={uploadedById}
          />
        </TabsContent>

        {/* Tab 6: Tooth chart */}
        <TabsContent value="toothChart">
          <ToothChart />
        </TabsContent>
      </Tabs>
    </div>
  );
}
