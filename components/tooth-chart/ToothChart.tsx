"use client"

import { memo, useState } from "react"

type ToothStatus = "healthy" | "caries" | "missing" | "filled" | "crown" | "implant"

type Tooth = {
  number: string
  status: ToothStatus
  surfaces?: string[]
}

type ToothChartProps = {
  chart?: Record<string, Tooth | string>
  onChange?: (updatedChart: Record<string, Tooth | string>) => void
}

const STATUS_ORDER: ToothStatus[] = ["healthy","caries","filled","crown","implant","missing"]

function ToothChart({ chart = {}, onChange }: ToothChartProps) {

  const [teeth, setTeeth] = useState<Record<string, Tooth>>(() => {
    const t: Record<string, Tooth> = {}
    for (let i = 11; i <= 18; i++) t[i] = { number: `${i}`, status: "healthy", surfaces: [] }
    for (let i = 21; i <= 28; i++) t[i] = { number: `${i}`, status: "healthy", surfaces: [] }
    for (let i = 31; i <= 38; i++) t[i] = { number: `${i}`, status: "healthy", surfaces: [] }
    for (let i = 41; i <= 48; i++) t[i] = { number: `${i}`, status: "healthy", surfaces: [] }
    // override with chart
    Object.keys(chart).forEach(num => {
      const val = chart[num]
      if (typeof val === "string") t[num] = { number: num, status: val as ToothStatus, surfaces: [] }
      else t[num] = { number: num, status: val.status, surfaces: val.surfaces || [] }
    })
    return t
  })

  const handleClick = (toothNum: string) => {
    setTeeth(prev => {
      const current = prev[toothNum]
      const currentIndex = STATUS_ORDER.indexOf(current.status)
      const nextStatus = STATUS_ORDER[(currentIndex + 1) % STATUS_ORDER.length]
      const updated = { ...prev, [toothNum]: { ...current, status: nextStatus } }
      return updated
    })
    onChange!(teeth);
  }

  return (
    <div className="grid grid-cols-8 gap-1 justify-center items-center p-4 select-none">

      {/* Upper Right Quadrant 11-18 */}
      {Array.from({ length: 8 }).map((_, i) => {
        const num = (11 + i).toString()
        const tooth = teeth[num]
        return (
          <div
            key={num}
            onClick={() => handleClick(num)}
            className={`cursor-pointer border rounded p-2 text-center text-xs font-semibold 
              ${tooth.status === "healthy" ? "bg-card" : 
                tooth.status === "caries" ? "bg-destructive text-destructive-foreground" :
                tooth.status === "filled" ? "bg-primary text-primary-foreground" :
                tooth.status === "crown" ? "bg-accent text-accent-foreground" :
                tooth.status === "implant" ? "bg-secondary text-secondary-foreground" :
                "bg-muted text-muted-foreground"
              }`}
          >
            {num}<br/>{tooth.status}
          </div>
        )
      })}

      {/* Upper Left Quadrant 21-28 */}
      {Array.from({ length: 8 }).map((_, i) => {
        const num = (21 + i).toString()
        const tooth = teeth[num]
        return (
          <div
            key={num}
            onClick={() => handleClick(num)}
            className={`cursor-pointer border rounded p-2 text-center text-xs font-semibold 
              ${tooth.status === "healthy" ? "bg-card" : 
                tooth.status === "caries" ? "bg-destructive text-destructive-foreground" :
                tooth.status === "filled" ? "bg-primary text-primary-foreground" :
                tooth.status === "crown" ? "bg-accent text-accent-foreground" :
                tooth.status === "implant" ? "bg-secondary text-secondary-foreground" :
                "bg-muted text-muted-foreground"
              }`}
          >
            {num}<br/>{tooth.status}
          </div>
        )
      })}

      {/* Lower Left Quadrant 31-38 */}
      {Array.from({ length: 8 }).map((_, i) => {
        const num = (31 + i).toString()
        const tooth = teeth[num]
        return (
          <div
            key={num}
            onClick={() => handleClick(num)}
            className={`cursor-pointer border rounded p-2 text-center text-xs font-semibold 
              ${tooth.status === "healthy" ? "bg-card" : 
                tooth.status === "caries" ? "bg-destructive text-destructive-foreground" :
                tooth.status === "filled" ? "bg-primary text-primary-foreground" :
                tooth.status === "crown" ? "bg-accent text-accent-foreground" :
                tooth.status === "implant" ? "bg-secondary text-secondary-foreground" :
                "bg-muted text-muted-foreground"
              }`}
          >
            {num}<br/>{tooth.status}
          </div>
        )
      })}

      
      {/* Lower Right Quadrant 41-48 */}
      {Array.from({ length: 8 }).map((_, i) => {
        const num = (41 + i).toString()
        const tooth = teeth[num]
        return (
          <div
            key={num}
            onClick={() => handleClick(num)}
            className={`cursor-pointer border rounded p-2 text-center text-xs font-semibold 
              ${tooth.status === "healthy" ? "bg-card" : 
                tooth.status === "caries" ? "bg-destructive text-destructive-foreground" :
                tooth.status === "filled" ? "bg-primary text-primary-foreground" :
                tooth.status === "crown" ? "bg-accent text-accent-foreground" :
                tooth.status === "implant" ? "bg-secondary text-secondary-foreground" :
                "bg-muted text-muted-foreground"
              }`}
          >
            {num}<br/>{tooth.status}
          </div>
        )
      })}

    </div>
  )
};

export default memo(ToothChart);