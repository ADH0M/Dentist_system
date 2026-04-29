"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { memo, useEffect } from "react";
import { useDispatchHook, useSelectorHook } from "@/hooks/useSelector";
import { RejectedToast, SuccessToast } from "@/lib/utils/toasts";
import { SimpleVisitWithUserType } from "@/type/types";
import { CalendarIcon, CircleDollarSign, UserIcon } from "lucide-react";
import { getPatientVisitsAction } from "@/store/reducers/patientVisitReducer";
import { deleteVisit } from "@/lib/actions/visit-action";
import { useRouter } from "next/navigation";

type Props = {
  patient: SimpleVisitWithUserType;
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

function ReceptionistVisitSheet({ patient, open, onOpenChange }: Props) {
  const router = useRouter();
  const assistant = useSelectorHook((state) => state.authReducer);
  const createBy = assistant?.data?.id;
  const dispatch = useDispatchHook();
  const { data, loading, error, errorMsg } = useSelectorHook(
    (state) => state.patientVisitReducer,
  );


  const handleDeleteVisit = async (data: {
    visitId: string;
    deleteBy: string;
  }) => {
    if (!data.deleteBy) return;
    if (!data.visitId) return;

    const delVisit = await deleteVisit(data);
    if (delVisit.success) {
      SuccessToast("delete visit successfuly");
      router.refresh();
    } else if (delVisit.error && !delVisit.success) {
      RejectedToast(delVisit.error);
    }
  };

  useEffect(() => {
    if (error && errorMsg && !loading) {
      RejectedToast(errorMsg);
    }
  }, [error, errorMsg, loading]);

  useEffect(() => {
    dispatch(getPatientVisitsAction(patient.patientId));
  }, [dispatch, patient.patientId]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-xl overflow-y-auto border-border">
        <SheetHeader>
          <SheetTitle className="text-2xl bg-secondary p-2 text-center mt-6 rounded-2xl">
            <div className="flex gap-2 items-center justify-center">
              <UserIcon className="text-primary" />
              <span className="text-muted-foreground">{patient.username}</span>
            </div>
          </SheetTitle>
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

          <div className="bg-card border border-border rounded-lg p-4 space-y-2 relative w-full">
            <h3 className="font-semibold text-foreground">Visits</h3>
            <p className="text-sm text-muted-foreground">
              total visit : {data.length ? data.length : "No visits yet"}
            </p>

            <div className="border-border border-t border-b max-h-40 min-h-20 overflow-x-hidden overflow-y-scroll">
              {data.length > 0 &&
                data.toReversed().map((visit, ind) => (
                  <div
                    key={visit.id}
                    className="p-2 relative h-fit  flex gap-2 justify-around  items-center overflow-hidden border-b
                       border-transparent hover:border-border"
                  >
                    <p className="text-sm  h-6 text-primary">
                      {ind + 1}: visit type : {visit.type || ""}
                    </p>

                    <p className="flex gap-1 items-center">
                      <CalendarIcon size={14} className="text-secondary" />
                      <span
                        className={` text-xs
                          ${new Date(visit.createdAt).toLocaleDateString() === new Date().toLocaleDateString() ? "text-chart-5" : "text-muted-foreground"}
                        `}
                      >
                        {new Date(visit.createdAt).toLocaleDateString() ||
                          new Date().toLocaleDateString()}
                      </span>
                    </p>

                    <p className="flex gap-1 items-center">
                      <CircleDollarSign size={14} className="text-secondary" />
                      <span className="text-muted-foreground text-xs">
                        {visit.invoice?.totalAmount || "--"}
                      </span>
                    </p>

                    <div
                      className={` 
                              w-fit  text-sm h-fit `}
                    >
                      <button
                        className={`w-full p-1 rounded-md h-full border border-border
                            ${
                              new Date(visit.createdAt).toLocaleDateString() ===
                              new Date().toLocaleDateString()
                                ? "cursor-pointer"
                                : "cursor-not-allowed"
                            } 
                          ${new Date(visit.createdAt).toLocaleDateString() === new Date().toLocaleDateString() ? " hover:text-destructive hover:border-destructive" : "hover:bg-gray-400"}`}
                        onClick={() => {
                          if (createBy) {
                            handleDeleteVisit({
                              visitId: visit.id,
                              deleteBy: createBy,
                            });
                            onOpenChange(false);
                          }
                        }}
                      >
                        delete
                      </button>
                    </div>
                  </div>
                ))}
            </div>

            {/* <form action={updateFormAction}>
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
              </form>  */}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
export default memo(ReceptionistVisitSheet);
