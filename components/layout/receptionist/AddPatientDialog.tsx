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
import { createPatient } from "@/lib/actions/patientActions";
import { Info } from "lucide-react";
import { toast } from "sonner";
import { useSelectorHook } from "@/hooks/useSelector";
import { redirect } from "next/navigation";
import { logoutAction } from "@/lib/actions/auth-action";
import { PatientFormState } from "@/type/types";

type AddPatientDialogProps = {
  onAdd?: () => void;
};

export function AddPatientDialog({ onAdd }: AddPatientDialogProps) {
  const [open, setOpen] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const user  = useSelectorHook((state) => state.authReducer);
  const initialState: PatientFormState = {
    success: false,
    error: undefined,
  };

  const [state, formAction, pending] = useActionState(
    createPatient.bind(null, user?.data?.id || ""),
    initialState,
  );

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset();

      onAdd?.();
      toast.success("create new patient success", { position: "top-left" });
      const timeout = setTimeout(() => {
        setOpen(false);
      }, 1000);

      return () => clearTimeout(timeout);
    } else if (!state.success && state.error !== "redirect" && state.error) {
      toast.error(state.error, { position: "top-left" });
    } else if (!state.success && state.error === "redirect") {
      toast.error("you are not authorized", { position: "top-left" });
      const timeout = setTimeout(async () => {
        await logoutAction();
        redirect("/");
      }, 1500);
      return () => clearTimeout(timeout);
    }
  }, [state, onAdd]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add Patient</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Patient</DialogTitle>

          <div className={`h-6 text-sm 'text-destructive'`}>
            {!state.success && state.error}
          </div>
        </DialogHeader>

        <form ref={formRef} action={formAction}>
          <div className="mt-4">
            <div>
              <Label>Name</Label>
              <Input
                placeholder="Patient name"
                name="name"
                className="mt-1"
                minLength={3}
                required
              />
              <p className="h-5">
                {state.errors && state.errors.username && (
                  <span className="flex w-full justify-center items-center text-xs p-1 gap-0.5 text-destructive">
                    <Info size={13} className="text-destructive" />
                    <span>{state.errors.username}</span>
                  </span>
                )}
              </p>
            </div>

            <div>
              <Label>Phone</Label>
              <Input
                placeholder="01xxxxxxxxx"
                name="phone"
                required
                className="mt-1"
                type="tel"
                pattern="[0-9]*"
                minLength={11}
                maxLength={11}
              />
              <p className="h-5">
                {state.errors && state.errors.phone && (
                  <span className="flex w-full justify-center items-center text-xs p-1 gap-0.5 text-destructive">
                    <Info size={13} className="text-destructive" />
                    <span>{state.errors.phone}</span>
                  </span>
                )}
              </p>
            </div>

            <div>
              <Label>Birthdate</Label>
              <Input type="date" name="date" className="mt-1" />
              <p className="h-5">
                {state.errors && state.errors.birthdate && (
                  <span className="flex w-full justify-center items-center text-xs p-1 gap-0.5 text-destructive">
                    <Info size={13} className="text-destructive" />
                    <span>{state.errors.birthdate}</span>
                  </span>
                )}
              </p>
            </div>

            <div>
              <Label>Address</Label>
              <Input
                placeholder="Patient Address"
                name="address"
                className="mt-1"
              />
              <p className="h-5">
                {state.errors && state.errors.address && (
                  <span className="flex w-full justify-center items-center text-xs p-1 gap-0.5 text-destructive">
                    <Info size={13} className="text-destructive" />
                    <span>{state.errors.address}</span>
                  </span>
                )}
              </p>
            </div>

            <div>
              <Label>Gender</Label>
              <select
                name="gender"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3
                 py-2 text-sm ring-offset-background focus-visible:outline-none 
                 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 mt-1"
                required
              >
                <option value="" disabled>
                  Select Gender
                </option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>

            <Button type="submit" className="w-full mt-5" disabled={pending}>
              {pending ? "Saving..." : "Add Patient"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
