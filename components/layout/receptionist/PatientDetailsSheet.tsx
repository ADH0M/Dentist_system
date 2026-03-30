"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { createPatientVisit } from "@/lib/actions/visit-action";
import { memo, useActionState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { redirect } from "next/navigation";
import { useSelectorHook } from "@/hooks/useSelector";
import { VisitType } from "@/generated/prisma";
import { deletePatient } from "@/lib/actions/patientActions";

type Patient = {
  id: string;
  name: string;
  phone?: string;
  gender?: string;
  visits?: VisitType;
};

type Props = {
  patient: Patient;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};
const visitType = [
  "Initial",
  "FollowUp",
  "Emergency",
  "Cleaning",
  "Consultation",
  "Surgery",
];
function PatientDetailsSheet({ patient, open, onOpenChange }: Props) {
  const intialState: { success: boolean; error?: string } = {
    success: false,
    error: "",
  };
  const assistant = useSelectorHook((state) => state.authReducer);
  const createBy = assistant.data?.id;

  const [state, formAction, pending] = useActionState(
    createPatientVisit.bind(null, { id: patient.id, createBy }),
    intialState,
  );

  const [deleteState, deletePatientAction, deletePending] = useActionState(
    deletePatient.bind(null, { id: patient.id }),
    intialState,
  );

  useEffect(() => {
    if (state.success) {
      setTimeout(() => {
        onOpenChange(false);
      }, 1000);
    }

    if (!state.success && state.error === "redirect") {
      redirect("/");
    }
  }, [state.success, state.error, onOpenChange]);

  useEffect(()=>{
    if(!deleteState.success){
      setTimeout(() => {
        onOpenChange(false);
      }, 500);  
    }
  },[deleteState.success,onOpenChange]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-2xl">{patient.name}</SheetTitle>
          
          <form
            action={deletePatientAction}
            className="flex justify-center items-center"
          >
            <button className="bg-red-400 w-fit h-fit px-2 text-sm py-1 rounded-xl cursor-pointer border border-transparent hover:border-border">
              {deletePending ? "wait.." : "delete"}
            </button>
          </form>
        </SheetHeader>

        <div className="space-y-6 px-4">
          <div className="bg-card border border-border rounded-lg p-4">
            <h3 className="font-semibold text-foreground">Patient Info</h3>
            <p className="text-sm text-muted-foreground">
              Phone: {patient.phone ?? "—"}
            </p>
            <p className="text-sm text-muted-foreground">
              gender: {patient.gender ?? "—"}
            </p>
          </div>

          <div className="bg-card border border-border rounded-lg p-4 space-y-2">
            <h3 className="font-semibold text-foreground">Appointments</h3>
            {/* هنا نضيف AppointmentList لل patient */}
            <p className="text-sm text-muted-foreground">No appointments yet</p>
            <Button size="sm" className="mt-2">
              Add Appointment
            </Button>
          </div>

          <div className="bg-card border border-border rounded-lg p-4 space-y-2">
            <h3 className="font-semibold text-foreground">Visits</h3>
            {/* هنا نعرض Visits مختصر مع إمكانية فتح ToothChart */}
            <p className="text-sm text-muted-foreground">
              total visit :{" "}
              {patient.visits?.length
                ? patient.visits?.length
                : "No visits yet"}
            </p>

            <form action={formAction}>
              <Label>Visit Type</Label>
              <select
                name="type"
                className="flex h-10 w-full sm:w-1/2 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 mt-1"
                required
              >
                <option value="" disabled>
                  Select Visit Type
                </option>
                {visitType.map((visit, indx) => (
                  <option value={visit} key={visit + " " + indx}>
                    {visit}
                  </option>
                ))}
              </select>

              <Button type="submit" className="mt-2">
                {pending ? "Saving..." : "Add Visit"}
              </Button>
            </form>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
export default memo(PatientDetailsSheet);
