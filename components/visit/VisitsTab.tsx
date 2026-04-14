"use client"

import { Button } from "@/components/ui/button"
import { VisitList } from "./VisitList"
import { Visit } from "@/generated/prisma"


export function VisitsTab({ visit }:{visit:Visit[]|undefined}) {


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

      <VisitList visits={visit} />

    </div>
  )
}