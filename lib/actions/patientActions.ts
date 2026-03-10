"use server";

import prisma from "../db/db-connection";


export type PatientFormState = {
  success: boolean;
  error?: string;
};

export async function createPatient(
  prevState: PatientFormState,
  formData: FormData
): Promise<PatientFormState> {
  try {
    const name = formData.get("name") as string;
    const phone = formData.get("phone") as string ;
    const email = formData.get("email") as string | null;
    const address = formData.get("address") as string | null;
    const birthdate = formData.get("birthdate") as string;
    const gender = formData.get("gender") as "male" | "female";



    // validation
    if (!name) {
      return { success: false, error: "Patient name is required" };
    }

    await prisma.patient.create({
      data: {
        phone,
        name,
        address: address || undefined,
        gender,
        birthDate:birthdate,
        email
      },
    });

    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Failed to create patient" };
  }
}