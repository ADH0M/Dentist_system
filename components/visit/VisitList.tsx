import  VisitCard  from "./VisitCard"

type Visit = {
  id: string
  visitDate: string
  chiefComplaint?: string
  diagnosis?: string
  treatmentPlan?: string
  doctor?: string
}

export function VisitList({ visits }: { visits: Visit[] }) {

  if (!visits.length) {
    return (
      <div className="bg-card border border-border rounded-lg p-6 text-center text-muted-foreground">
        No visits found
      </div>
    )
  }

  return (
    <div className="space-y-4">

      {visits.map((visit) => (
        <VisitCard
          key={visit.id}
          visit={visit}
        />
      ))}

    </div>
  )
}