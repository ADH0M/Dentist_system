"use client";

import { lazy, Suspense, useEffect } from "react";
import FallbackPatientList from "./FallbackPatientList";
import ReceptionistSearch from "./ReceptionistSearch";
import { useDispatchHook, useSelectorHook } from "@/hooks/useSelector";
import { getVisits } from "@/store/reducers/VisitsReducer";
import { RejectedToast } from "@/lib/utils/toasts";

const VisitCard = lazy(() => import("./ReceptionistVisitCard"));

function VisitList() {
  const dispatch = useDispatchHook();
  const {data , error ,errorMsg} = useSelectorHook((state)=>state.visitsReducer);
  
  
  useEffect(()=>{
    dispatch(getVisits())
  } ,[dispatch]);

  useEffect(()=>{
    if(error && errorMsg){
      RejectedToast(errorMsg)
    }
  },[error ,errorMsg]);

  return (
    <div className="space-y-4">
      <ReceptionistSearch />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Suspense fallback={<FallbackPatientList />}>
          {data ? (
            data.map((patient, ind) => (
              <VisitCard
                key={patient.visitId + " " + patient.userId}
                patient={patient}
                ind={ind}
              />
            ))
          ) : (
            <div className="text-sm mt-1 text-muted-foreground">
              there are no visits yet .
            </div>
          )}
        </Suspense>
      </div>
    </div>
  );
}

export default VisitList;
