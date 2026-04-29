"use server";

import { Gender, Patient } from "@/generated/prisma";
import prisma from "../db/db-connection";
import { revalidatePath } from "next/cache";
import { NewPatientValid } from "../validations/schema";
import { isExistPhone } from "./auth-action";
import bcrypt from "bcryptjs";
import { generatePassword, getDateRange } from "../utils";
import {
  GetPatientType,
  PatientError,
  PatientFormState,
  PatientWithUser,
} from "@/type/types";

export async function createPatient(
  createBy: string,
  prevState: PatientFormState,
  formData: FormData,
): Promise<PatientFormState> {
  try {
    const username = formData.get("name") as string;
    const phone = formData.get("phone") as string;
    const address = formData.get("address") as string | null;
    const birthdate = formData.get("date") as string;
    const gender = (formData.get("gender") as Gender)?.toLowerCase();
    const parseDate = new Date(birthdate);
    const errors: PatientError = {};
    const patientData = {
      username,
      phone,
      address: address ? address.trim() : undefined,
      birthdate:
        parseDate && !isNaN(parseDate.getTime()) ? parseDate : undefined,
      gender,
    };

    if (!createBy) return { success: false, error: "redirect" };
    const validation = NewPatientValid.safeParse(patientData);
    if (!validation.success) {
      validation.error.issues.forEach((er) => {
        const message = er.message;
        const path = er.path[0] as keyof PatientError;
        errors[path] = message;
      });
      return { success: false, errors };
    }

    const phoneIsExist = await isExistPhone(validation.data.phone);
    if (phoneIsExist) {
      return { success: false, error: "user phone exists" };
    }

    const password = generatePassword();
    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.$transaction(async (t) => {
      const user = await t.user.create({
        data: {
          username,
          phone,
          password: hashedPassword,
          gender: validation.data.gender,
        },
      });
      await t.patient.create({
        data: {
          createdById: createBy,
          userId: user.id,
        },
      });
    });

    revalidatePath("/patients");

    return { success: true };
  } catch (error) {
    console.error("Database Error:", error);
    return { success: false, error: "can't to create patient right now" };
  }
}

export async function getPatient(id: string): Promise<GetPatientType> {
  if (!id) {
    return {
      success: false,
      error: true,
      msg: "patient id not exist",
      redirect: true,
    };
  }

  try {
    const pateint = await prisma.patient.findUnique({
      where: { id },
      include: {
        visits: true,
        images: true,
        invoices: true,
      },
    });

    if (!pateint) {
      return {
        success: false,
        msg: "patient not exist",
        redirect: true,
        error: false,
      };
    }

    console.log(pateint);

    return { success: true, data: pateint };
  } catch (error) {
    return { success: false, msg: "try again ", error: true };
  }
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
  data?: PatientWithUser[];
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
      select: {
        id:true ,
        createdAt:true,
        user:{
          select:{
            id:true,
            username:true,
            email:true,
            phone:true,
            gender:true,
          }
        },
      }
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

export async function deletePatient({
  id,
}: {
  id: string;
}): Promise<PatientFormState> {
  if (!id) {
    return { success: false, error: "patient id not exist or name" };
  }

  try {
    await prisma.$transaction(async (x) => {});

    revalidatePath("/patients");
    revalidatePath("/admin");

    return { success: true };
  } catch (error) {
    console.error("Database Error:", error);
    return { success: false, error: "Fail to delete patient" };
  }
}
