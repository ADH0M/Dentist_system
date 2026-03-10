"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { PatientCard } from "./PatientCard"

type Patient = {
  id: string
  name: string
  phone?: string
  lastVisit?: string
}

type Props = {
  patients: Patient[]
}

export function PatientList({ patients }: Props) {
  const [search, setSearch] = useState("")

  const filtered = patients.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    (p.phone ?? "").includes(search)
  )

  return (
    <div className="space-y-4">
      <Input
        placeholder="Search patient by name or phone..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="w-full max-w-md"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(patient => (
          <PatientCard key={patient.id} patient={patient} />
        ))}
      </div>
    </div>
  )
}