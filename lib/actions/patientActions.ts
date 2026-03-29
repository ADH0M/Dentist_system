"use server";

import { Patient } from "@/generated/prisma";
import prisma from "../db/db-connection";
import { revalidatePath } from "next/cache";

export type PatientFormState = {
  success: boolean;
  error?: string;
};

export async function createPatient(
  prevState: PatientFormState,
  formData: FormData,
): Promise<PatientFormState> {
  try {
    const name = formData.get("name") as string;
    const phone = formData.get("phone") as string;
    const address = formData.get("address") as string | null;
    const birthdate = formData.get("date") as string;

    const gender = (formData.get("gender") as string)?.toLowerCase();

    if (!name || !name.trim() || name.length < 3) {
      return { success: false, error: "اسم المريض مطلوب (3 أحرف على الأقل)" };
    }

    const phoneRegex = /^[0-9]+$/;
    if (!phone || !phoneRegex.test(phone) || phone.length !== 11) {
      return { success: false, error: "رقم الهاتف يجب أن يكون 11 رقماً" };
    }

    if (gender !== "female" && gender !== "male") {
      return { success: false, error: "الجنس يجب أن يكون male أو female" };
    }

    const birthDateValue = birthdate ? new Date(birthdate) : null;

    await prisma.patient.create({
      data: {
        phone,
        name: name.trim(),
        address: address?.trim() || null,
        gender: gender as "male" | "female",
        birthDate: birthDateValue,
      },
    });

    revalidatePath("/patients");

    return { success: true };
  } catch (error) {
    console.error("Database Error:", error);
    return { success: false, error: "فشل إنشاء المريض، حاول مرة أخرى" };
  }
}

export async function getPatient() {
  try {
  } catch (error) {}
}

function getDateRange(daysAgo: number) {
  const now = new Date();

  const targetDate = new Date(now);
  targetDate.setDate(now.getDate() - daysAgo);

  const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
  const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));

  return { startOfDay, endOfDay };
}

export async function getLastDayPatients(): Promise<{
  success: boolean;
  data?: Patient[];
  error?: string;
  count?: number;
}> {
  try {
    // حساب نطاق زمن ليوم أمس
    const { startOfDay, endOfDay } = getDateRange(1);

    const patients = await prisma.patient.findMany({
      where: {
        createdAt: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      orderBy: {
        createdAt: "desc", // الأحدث أولاً
      },
    });

    return {
      success: true,
      data: patients,
      count: patients.length,
    };
  } catch (error) {
    console.error("Error fetching last day patients:", error);
    return {
      success: false,
      error: "can not get patient data",
      data: [],
      count: 0,
    };
  }
}

export async function getTodayPatients(): Promise<{
  success: boolean;
  data?: Patient[];
  error?: string;
  count?: number;
}> {
  try {
    const now = new Date();
    const startOfDay = new Date(now.setHours(0, 0, 0, 0));
    const endOfDay = new Date(now.setHours(23, 59, 59, 999));

    const patients = await prisma.patient.findMany({
      where: {
        createdAt: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return {
      success: true,
      data: patients,
      count: patients.length,
    };
  } catch (error) {
    console.error("Error fetching today patients:", error);
    return {
      success: false,
      error: "can not get patient data",
      data: [],
      count: 0,
    };
  }
}


