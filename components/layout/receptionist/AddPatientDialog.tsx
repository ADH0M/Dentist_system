"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createPatient, PatientFormState } from "@/lib/actions/patientActions";

type AddPatientDialogProps = {
  onAdd?: () => void;
};

export function AddPatientDialog({ onAdd }: AddPatientDialogProps) {
  const [open, setOpen] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const initialState: PatientFormState = {
    success: false,
    error: undefined,
  };

  const [state, formAction, pending] = useActionState(
    createPatient,
    initialState,
  );

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset();

      onAdd?.();

      setTimeout(() => {
        setOpen(false);
      }, 1000);
    }
  }, [state.success, onAdd]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add Patient</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Patient</DialogTitle>

          {/* عرض الرسائل */}
          <div
            className={`h-6 text-sm ${
              state.error
                ? "text-red-500"
                : state.success
                  ? "text-green-500"
                  : "text-transparent"
            }`}
          >
            {state.error}
          </div>
        </DialogHeader>

        <form ref={formRef} action={formAction}>
          <div className="space-y-4 mt-4">
            <div>
              <Label>Name</Label>
              <Input
                placeholder="Patient name"
                name="name"
                className="mt-1"
                required
                minLength={3}
              />
            </div>

            <div>
              <Label>Phone</Label>
              <Input
                placeholder="01xxxxxxxxx"
                name="phone"
                className="mt-1"
                type="tel"
                pattern="[0-9]*"
                required
                minLength={11}
                maxLength={11}
              />
            </div>

            <div>
              <Label>Birthdate</Label>
              <Input type="date" name="date" className="mt-1" />
            </div>

            <div>
              <Label>Address</Label>
              <Input
                placeholder="Patient Address"
                name="address"
                className="mt-1"
              />
            </div>

            <div>
              <Label>Gender</Label>
              <select
                name="gender"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 mt-1"
                required
              >
                <option value="" disabled>
                  Select Gender
                </option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>

            <Button type="submit" className="w-full" disabled={pending}>
              {pending ? "Saving..." : "Add Patient"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
