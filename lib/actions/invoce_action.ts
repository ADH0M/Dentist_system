"use server";

import { PaymentMethod, PaymentStatus } from "@/generated/prisma";
import { VisitFormState } from "./visit-action";
import { revalidatePath } from "next/cache";
import prisma from "../db/db-connection";

export async function createPatientInvoce(
  {
    createBy,
    patientId,
    visitId,
  }: {
    createBy: string | undefined;
    patientId: string | undefined;
    visitId: string | undefined;
  },
  prevState: VisitFormState,
  formData: FormData,
): Promise<VisitFormState> {
  try {
    const paymentMethod = formData.get("paymentMethod") as PaymentMethod;
    const paymentState = formData.get("paymentStatus") as PaymentStatus;
    const totalAmount = formData.get("totalAmount") as string;
    const note_paid = formData.get("note_paid") as string;
    const isPaymentMethod = [
      "Cash",
      "Card",
      "Online",
      "Insurance",
      "Installment",
    ].find((t) => t === paymentMethod);
    const isPaymentStatus = [
      "pending",
      "paid",
      "partially_paid",
      "refunded",
      "cancelled",
      "insurance_pending",
    ].find((t) => t === paymentState);

    if (!isPaymentMethod)
      return { success: false, error: "paymentMethod is not define " };
    if (!isPaymentStatus)
      return { success: false, error: "paymentStatus is not define " };
    if (!createBy) {
      return { success: false, error: "redirect" };
    }
    if (!patientId) return { success: false, error: "patient not define " };
    if (Number(totalAmount) < 1 && !totalAmount.trim())
      return { success: false, error: "totalAmount not define " };
    if (!visitId) return { success: false, error: "visit id  not define " };

    const invoce = await prisma.invoice.create({
      data: {
        patientId: patientId,
        createdById: createBy,
        totalAmount: Number(totalAmount),
        status: paymentState,
        visitId,
      },
    });

    if (!invoce) {
      return {
        success: false,
        error: "there are issuse in create invoce for this patient",
      };
    }

    revalidatePath("/patients");

    return { success: true };
  } catch (error) {
    console.error("Database Error:", error);
    return { success: false, error: "can not create visit " + error };
  }
}
