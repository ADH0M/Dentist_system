"use client";

import { lazy, Suspense, useState } from "react";
import { Input } from "@/components/ui/input";
import FallbackPatientList from "./FallbackPatientList";
import { PatientWithUser } from "@/type/types";

const PatientCard = lazy(() => import("./PatientCard"));

type Props = {
  patients: PatientWithUser[];
  componentType: "patient" | "appointment" | "visit";
};

export function PatientList({ patients, componentType = "patient" }: Props) {
  const [search, setSearch] = useState("");

  const filtered = patients.filter(
    (p) =>
      p.user.username.toLowerCase().includes(search.toLowerCase()) ||
      (p.user.phone ?? "").includes(search),
  );

  
  return (
    <div className="space-y-4">
      <Input
        placeholder="Search patient by name or phone..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full max-w-md"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Suspense fallback={<FallbackPatientList />}>
          {patients.length ? (
            filtered.map((patient, ind) => (
              <PatientCard key={patient.id} patient={patient} num={ind} componentType={componentType}/>
            ))
          ) : (
            <div className="text-sm mt-1">
              there are no{" "}
              {componentType === "patient"
                ? "patients"
                : componentType === "appointment"
                  ? "appointments"
                  : "visits"}{" "}
              yet .
            </div>
          )}
        </Suspense>
      </div>
    </div>
  );
}
