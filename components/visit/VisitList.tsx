import { Visit } from "@/generated/prisma"
import  VisitCard  from "./VisitCard"



export function VisitList({ visits }: { visits: Visit[] |undefined}) {

  if (!visits?.length) {
    return (
      <div className="bg-card border border-border rounded-lg p-6 text-center text-muted-foreground">
        No visits found
      </div>
    )
  }

  return (
    <div className="space-y-4">

      {visits?.map((visit) => (
        <VisitCard
          key={visit.id}
          visit={visit}
        />
      ))}

    </div>
  )
}