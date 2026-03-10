"use client"

import { Button } from "@/components/ui/button"
import { VisitList } from "./VisitList"

type Visit = {
  id: string
  visitDate: string
  chiefComplaint?: string
  diagnosis?: string
  treatmentPlan?: string
  doctor?: string
}

type Props = {
  patientId: string
}

export function VisitsTab({ patientId }: Props) {

  // mock data مؤقتة
  const visits: Visit[] = [
    {
      id: "1",
      visitDate: "12 May 2026",
      chiefComplaint: "Tooth pain",
      diagnosis: "Dental Caries",
      treatmentPlan: "Composite Filling",
      doctor: "Dr. Ahmed"
    },
    {
      id: "2",
      visitDate: "20 April 2026",
      chiefComplaint: "Routine Check",
      diagnosis: "Healthy",
      treatmentPlan: "Cleaning",
      doctor: "Dr. Sara"
    }
  ]

  return (
    <div className="space-y-6">

      <div className="flex justify-between items-center">

        <h3 className="text-lg font-semibold text-foreground">
          Visits
        </h3>

        <Button>
          New Visit
        </Button>

      </div>

      <VisitList visits={visits} />

    </div>
  )
}