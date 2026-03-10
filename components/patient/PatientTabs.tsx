"use client"

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"


import { OverviewTab } from "./OverviewTab"
import { AppointmentsTab } from "../appointments/AppointmentsTab"
import { VisitsTab } from "../visit/VisitsTab"

type PatientTabsProps = {
  patientId: string
}

export function PatientTabs({ patientId }: PatientTabsProps) {
  return (
    <Tabs defaultValue="overview" className="w-full">

      <TabsList className="grid grid-cols-4 w-full max-w-md">

        <TabsTrigger value="overview">
          Overview
        </TabsTrigger>

        <TabsTrigger value="appointments">
          Appointments
        </TabsTrigger>

        <TabsTrigger value="visits">
          Visits
        </TabsTrigger>

        <TabsTrigger value="billing">
          Billing
        </TabsTrigger>

      </TabsList>

      <TabsContent value="overview" className="mt-6">
        <OverviewTab patientId={patientId} />
      </TabsContent>

      <TabsContent value="appointments" className="mt-6">
        <AppointmentsTab patientId={patientId} />
      </TabsContent>

      <TabsContent value="visits" className="mt-6">
         <VisitsTab patientId={patientId} /> 
      </TabsContent>

      <TabsContent value="billing" className="mt-6">
        {/* <BillingTab patientId={patientId} /> */}
      </TabsContent>

    </Tabs>
  )
}