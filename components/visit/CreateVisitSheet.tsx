"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { prevCreateVisit } from "@/lib/actions/visit-action";
import { memo, useActionState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { redirect } from "next/navigation";

type Patient = {
  id: string |undefined;
  name: string | undefined;
  phone: string | undefined;
  gender: "male" | "female" | null;
  totalVisits: number | undefined;
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

function CreateVisitSheet({ patient, open, onOpenChange }: Props) {
  const intialState: { success: boolean; error?: string } = {
    success: false,
    error: "",
  };

  const [state, formAction, pending] = useActionState(
    prevCreateVisit.bind(null, { id: patient.id, }),
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

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-2xl">{patient.name}</SheetTitle>
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
            <h3 className="font-semibold text-foreground">Visits</h3>
            <p className="text-sm text-muted-foreground">
              total visit :{" "}
              {patient.totalVisits ? patient.totalVisits : "No visits yet"}
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
export default memo(CreateVisitSheet);
