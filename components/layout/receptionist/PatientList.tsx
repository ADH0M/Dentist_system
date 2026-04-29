"use client";

import { lazy, Suspense } from "react";
import FallbackPatientList from "./FallbackPatientList";
import { PatientWithUser } from "@/type/types";
import ReceptionistSearch, { UserSimpleInfo } from "./ReceptionistSearch";

const PatientCard = lazy(() => import("./PatientCard"));

type Props = {
  patients: PatientWithUser[];
};

export function PatientList({ patients }: Props) {
  const serializePatient = patients.map((patient)=>({
    patientId:patient.id ,
    userId:patient.user.id,
    username:patient.user.username,
    email:patient.user.email,
    gender:patient.user.gender,
    phone:patient.user.phone
  })) as UserSimpleInfo[];

  return (
    <div className="space-y-4">
      <ReceptionistSearch />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Suspense fallback={<FallbackPatientList />}>
          {patients.length ? (
            serializePatient.map((patient, ind) => (
              <PatientCard
                key={patient.patientId+" "+patient.userId}
                patient={patient}
                num={ind}
                componentType={"cards"}
              />
            ))
          ) : (
            <div className="text-sm mt-1">there are no patients yet .</div>
          )}
        </Suspense>
      </div>
    </div>
  );
}
