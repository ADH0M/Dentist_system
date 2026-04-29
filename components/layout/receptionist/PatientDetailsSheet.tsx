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
import { deletePatient } from "@/lib/actions/patientActions";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RejectedToast, SuccessToast } from "@/lib/utils/toasts";
import { UserSimpleInfo } from "./ReceptionistSearch";
import { logoutAction } from "@/lib/actions/auth-action";

type Props = {
  patient: UserSimpleInfo;
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
  const createBy = assistant?.data?.id;

  const [state, formAction, pending] = useActionState(
    createPatientVisit.bind(null, { id: patient.patientId, createBy }),
    intialState,
  );

  const [deleteState, deletePatientAction, deletePending] = useActionState(
    deletePatient.bind(null, { id: patient.userId }),
    intialState,
  );

  const componentType = useSelectorHook(
    (state) => state.receptionistReducer.type,
  );
  useEffect(() => {
    if (state.success) {
      setTimeout(() => {
        onOpenChange(false);
        SuccessToast("create visit successfuly");
      }, 1000);
    } else if (!state.success && state.error) {
      RejectedToast(state.error);
    }

    if (!state.success && state.error === "redirect") {
      redirect("/");
    }
  }, [state.success, state.error, onOpenChange]);

  useEffect(() => {
    if (!deleteState.success) {
      setTimeout(() => {
        onOpenChange(false);
      }, 500);
    }
  }, [deleteState.success, onOpenChange]);

  useEffect(() => {
    if (!state.success && state.error === "Unauthorized") {
      const timeout = setTimeout(() => {
        onOpenChange(false);
        redirect("/");
      }, 500);
      logoutAction();

      return ()=>clearTimeout(timeout);
    }
  }, [state ,onOpenChange]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-xl overflow-y-auto border-border">
        <SheetHeader>
          <SheetTitle className="text-2xl">{patient.username}</SheetTitle>

          {componentType === "patients" && (
            <form
              action={deletePatientAction}
              className="flex justify-center items-center"
            >
              <button className="bg-red-400 w-fit h-fit px-2 text-sm py-1 rounded-xl cursor-pointer border border-transparent hover:border-border">
                {deletePending ? "wait.." : "delete"}
              </button>
            </form>
          )}
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

          {componentType === "appointments" && (
            <div className="bg-card border border-border rounded-lg p-4 space-y-2">
              <h3 className="font-semibold text-foreground">Appointments</h3>
              {/* هنا نضيف AppointmentList لل patient */}
              <p className="text-sm text-muted-foreground">
                No appointments yet
              </p>
              <Button size="sm" className="mt-2">
                Add Appointment
              </Button>
            </div>
          )}

          {componentType === "patients" && (
            <div className="bg-card border border-border rounded-lg p-4 space-y-2">
              <h3 className="font-semibold text-foreground">Visits</h3>
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
                <Label className="mt-2">Paid</Label>
                <Input
                  name="totalAmount"
                  type="number"
                  className="flex h-10 mt-2  w-full sm:w-1/2 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none
                   focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 "
                  max={2000}
                  min={10}
                  required
                  placeholder="amount eg.200"
                />

                <div>
                  <Label className="mt-2">Note for paid</Label>
                  <Textarea
                    name="note_paid"
                    maxLength={200}
                    minLength={4}
                    className="mt-2"
                    placeholder="add note about paid..."
                  ></Textarea>
                </div>

                <Button type="submit" className="mt-2">
                  {pending ? "Saving..." : "Add Visit"}
                </Button>
              </form>
            </div>
          )}

          {componentType === "visits" && (
            <div className="bg-card border border-border rounded-lg p-4 space-y-2 relative w-full">
              <h3 className="font-semibold text-foreground">Visits</h3>
              {/* <p className="text-sm text-muted-foreground">
                total visit :{" "}
                {patient.visits?.length
                  ? patient.visits?.length
                  : "No visits yet"}
              </p> */}

              {/* <div className="border-border border-t border-b max-h-40 min-h-20 overflow-x-hidden overflow-y-scroll">
                {patient.visits.length > 0 &&
                  patient.visits.toReversed().map((visit, ind) => (
                    <div
                      key={visit.id}
                      className="p-2 relative h-fit flex items-center overflow-hidden border-b border-transparent hover:border-border"
                    >
                      <p className="text-sm text-accent-foreground h-6 ">
                        {ind + 1}: visit type : {visit.type || ""}
                      </p>
                      <div
                        className={`absolute top-2 right-2  
                              w-fit  text-sm h-fit `}
                      >
                        <button
                          className={`w-full p-1 rounded-md h-full ${visit.createdAt.toLocaleDateString() === new Date().toLocaleDateString() ? "cursor-pointer" : "cursor-not-allowed"} 
                          ${visit.createdAt.toLocaleDateString() === new Date().toLocaleDateString() ? "hover:bg-red-500" : "hover:bg-gray-400"}`}
                          onClick={() => handleDeleteVisit(visit.id)}
                          disabled={
                            visit.createdAt.toLocaleDateString() !==
                            new Date().toLocaleDateString()
                          }
                        >
                          delete
                        </button>
                      </div>
                    </div>
                  ))}
              </div>

              <form action={updateFormAction}>
                <Label className="text-sm m-1">Update last Visit Type</Label>
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

                <Button
                  type="submit"
                  className="mt-2 hover:text-accent cursor-pointer"
                >
                  {updatePending ? "Saving..." : "Update"}
                </Button>
              </form> */}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
export default memo(PatientDetailsSheet);
