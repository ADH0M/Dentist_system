"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { OverviewTab } from "./OverviewTab";
import { AppointmentsTab } from "../appointments/AppointmentsTab";
import { VisitsTab } from "../visit/VisitsTab";
import { P_VisitsInvoicesImages } from "@/lib/actions/patientActions";

export function PatientTabs({ patient }: { patient: P_VisitsInvoicesImages |undefined }) {
  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList className="grid grid-cols-4 w-full max-w-md">
        <TabsTrigger value="overview">Overview</TabsTrigger>

        <TabsTrigger value="appointments">Appointments</TabsTrigger>

        <TabsTrigger value="visits">Visits</TabsTrigger>

        <TabsTrigger value="billing">Billing</TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="mt-6">
        <OverviewTab />
      </TabsContent>

      <TabsContent value="appointments" className="mt-6">
        <AppointmentsTab />
      </TabsContent>

      <TabsContent value="visits" className="mt-6">
        <VisitsTab visit={patient?.visits} />
      </TabsContent>

      <TabsContent value="billing" className="mt-6">
        {/* <BillingTab patientId={patientId} /> */}
      </TabsContent>
    </Tabs>
  );
}
