// app/doctor/page.tsx
"use client";

import { useEffect } from "react";
import { RootState } from "@/store/store";

import { Loader2 } from "lucide-react";
import { useDispatchHook, useSelectorHook } from "@/hooks/useSelector";
import { fetchTodayPatients } from "@/store/reducers/doctorSlice";
import TodayPatientsList from "@/components/layout/doctor/TodayPatientsList";
import PatientDetailsModal from "@/components/layout/doctor/PatientDetailsModal";

export default function DoctorPage() {
  const dispatch = useDispatchHook();
  const { todayPatients, loading, error, stats } = useSelectorHook(
    (state: RootState) => state.doctorReducer,
  );

  useEffect(() => {
    dispatch(fetchTodayPatients());

    // Refresh every 30 seconds
    const interval = setInterval(() => {
      dispatch(fetchTodayPatients());
    }, 30000);

    return () => clearInterval(interval);
  }, [dispatch]);

  if (loading && todayPatients.length === 0) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)]">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={() => dispatch(fetchTodayPatients())}
          className="px-4 py-2 bg-primary text-white rounded-lg"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="p-6 space-y-6">
        {/* Header with Stats */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-muted-foreground">Today&lsquo;s Patients</h1>
            <p className="text-gray-500 mt-1">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>

          {/* Quick Stats */}
          <div className="flex gap-1 sm:gap-4 border border-border px-2 sm:px-3 py-1 rounded-lg">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">
                {stats.totalPatients}
              </p>
              <p className="text-xs text-gray-500">Patients</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {stats.totalVisits}
              </p>
              <p className="text-xs text-gray-500">Visits</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-600">
                {stats.pendingVisits}
              </p>
              <p className="text-xs text-gray-500">Pending</p>
            </div>
          </div>
        </div>

        {/* Patients List */}
        {todayPatients.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500">No patients have been seen today</p>
            <p className="text-sm text-gray-400 mt-2">
              Click the + button to add a new visit
            </p>
          </div>
        ) : (
          <TodayPatientsList patients={todayPatients} />
        )}
      </div>
      <PatientDetailsModal />
    </>
  );
}
