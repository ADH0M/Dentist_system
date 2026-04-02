"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createPatientInvoce } from "@/lib/actions/invoce_action";
import { redirect } from "next/navigation";
import { useActionState, useEffect } from "react";

const paymentStatus = [
  { type: "pending", title: "Pending" },
  { type: "paid", title: "Paid" },
  { type: "partially_paid", title: "Partially Paid" },
  { type: "refunded", title: "Refunded" },
  { type: "cancelled", title: "Cancelled" },
  { type: "insurance_pending", title: "Insurance Pending" },
];

const paymentMethod = ["Cash", "Card", "Online", "Insurance", "Installment"];

const PatientInovice = ({
  patientId,
  createBy,
  visitId,
}: {
  patientId: string;
  createBy: string |undefined;
  visitId: string |undefined;
}) => {
  const intialState: { success: boolean; error?: string } = {
    success: false,
    error: "",
  };

  const [state, formAction, pending] = useActionState(
    createPatientInvoce.bind(null, { patientId, createBy, visitId }),
    intialState,
  );

  useEffect(() => {
    if (!state.success && state.error === "redirect") {
      redirect("/");
    }
  }, [state.success, state.error]);

  return (
    <div>
      <h3 className="text-sm h-fit">Paid Details </h3>
      <p className="text-xs h-8 text-red-500">
        {!state.success && state.error}{" "}
      </p>
      <form action={formAction}>
        <Label>Invoce State</Label>
        <select
          name="payment_status"
          className="flex h-10 w-full sm:w-1/2 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 mt-1"
          required
        >
          <option value="" disabled>
            Select Payment Status
          </option>
          {paymentStatus.map((pState, indx) => (
            <option
              value={pState.type}
              key={pState.type + " " + indx + pState.title}
            >
              {pState.title}
            </option>
          ))}
        </select>

        <Label>Invoce Method </Label>
        <select
          name="payment_method"
          className="flex h-10 w-full sm:w-1/2 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 mt-1"
          required
        >
          <option value="" disabled>
            Select Payment Method
          </option>
          {paymentMethod.map((pState, indx) => (
            <option value={pState} key={pState + " " + indx + pState}>
              {pState}
            </option>
          ))}
        </select>
        <Label>Paid Amount </Label>
        <Input name="totalAmount" className="border border-input" />

        <Button type="submit" className="mt-2">
          {pending ? "Saving..." : "create invoce"}
        </Button>
      </form>
    </div>
  );
};

export default PatientInovice;
