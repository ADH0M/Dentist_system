/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";
import { Prisma, Visit, VisitType } from "@/generated/prisma";
import prisma from "../db/db-connection";
import { revalidatePath } from "next/cache";
import { CreateVisitSchema } from "@/lib/validations/schema";
import { SimpleVisitWithUserType } from "@/type/types";

export type PatientWithVisits = Prisma.PatientGetPayload<{
  include: { visits: true; user: true };
}>;

export type VisitFormState = {
  success: boolean;
  error?: string;
};

// interface VisitForm {
//   id: string;
//   type: VisitType;
//   createdBy: string;
// }

// export async function createPatientVisit(intialstata:PrevStateVisitFormState,
//   {id,type ,createdBy}:PrevStateVisitFormState
// ): Promise<VisitFormState> {
//   if (!id)
//     return {
//       success: false,
//       error: "patient id not correct",
//     };

//   if (
//     !type.trim() &&
//     type !== "Emergency" &&
//     type !== "FollowUp" &&
//     type !== "Initial" &&
//     type !== "Surgery" &&
//     type !== "Cleaning" &&
//     type !== "Consultation"
//   )
//     return {
//       success: false,
//       error: "visit type not correct",
//     };

//   if (!createdBy)
//     return {
//       success: false,
//       error: "assistant not define",
//     };

//   try {
//     // const patient = await prisma.visit.create({
//     //   data: { patientId: id, type, createdById: createdBy },
//     // });

//     // console.log(patient);

//     return {
//       success: true,
//       error: "",
//     };
//   } catch (error) {
//     console.error("Error fetching today patients:", error);
//     return {
//       success: false,
//       error: "can not get patient data",
//     };
//   }
// }

export async function createPatientVisit(
  { createBy, id }: { createBy: string | undefined; id: string },
  prevState: VisitFormState,
  formData: FormData,
): Promise<VisitFormState> {
  try {
    if (!createBy) {
      return { success: false, error: "Unauthorized" };
    }

    if (!id) {
      return { success: false, error: "Patient not defined" };
    }

    const parsed = CreateVisitSchema.safeParse({
      type: formData.get("type"),
      totalAmount: formData.get("totalAmount"),
      note_paid: formData.get("note_paid"),
    });

    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.issues[0].message,
      };
    }

    const { type, totalAmount, note_paid } = parsed.data;

    const startDate = new Date();
    startDate.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const existingVisit = await prisma.visit.findFirst({
      where: {
        patientId: id,
        visitDate: {
          gte: startDate,
          lte: endOfDay,
        },
      },
    });

    if (existingVisit) {
      return {
        success: false,
        error: "Patient already has a visit today",
      };
    }

    const invoiceNumber = `INV-${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 7)
      .toUpperCase()}`;

    try {
      await prisma.$transaction(async (x) => {
        const patient = await x.patient.findUnique({
          where: { id },
        });

        if (!patient) {
          throw new Error("PATIENT_NOT_FOUND");
        }

        const visit = await x.visit.create({
          data: {
            patientId: patient.id,
            type: type,
            createdById: createBy,
          },
        });

        await x.invoice.create({
          data: {
            totalAmount,
            paidAmount: 0,
            createdById: createBy,
            patientId: patient.id,
            visitId: visit.id,
            notes: note_paid || "",
            invoiceNumber,
          },
        });
      });
    } catch (err: any) {
      if (err.message === "PATIENT_NOT_FOUND") {
        return { success: false, error: "Patient not found" };
      }

      // 👇 unique constraint (race condition)
      if (err.code === "P2002") {
        return {
          success: false,
          error: "Patient already has a visit today",
        };
      }

      console.error(err);

      return {
        success: false,
        error: "Failed to create visit",
      };
    }

    revalidatePath("/patients");

    return { success: true };
  } catch (error: any) {
    console.error("Unexpected Error:", error);

    return {
      success: false,
      error: "Something went wrong",
    };
  }
}
export async function prevCreateVisit(
  { id }: { id: string | undefined },
  prevState: VisitFormState,
  formData: FormData,
): Promise<VisitFormState> {
  try {
    const type = formData.get("type") as VisitType;

    const isType = [
      "Initial",
      "FollowUp",
      "Emergency",
      "Cleaning",
      "Consultation",
      "Surgery",
    ];

    if (!isType.includes(type))
      return { success: false, error: "type is not define " };

    if (!id) return { success: false, error: "patient not define " };

    let IdExist = true;
    await prisma.$transaction(async (x) => {
      const patient = false;

      if (patient) {
        await x.visit.create({
          data: { patientId: id, type, createdById: "8989898989898989" },
        });
      } else {
        IdExist = false;
      }
    });

    if (!IdExist) return { success: false, error: "patient not define " };

    revalidatePath("/patients");
    revalidatePath("/assistant");

    return { success: true };
  } catch (error) {
    console.error("Database Error:", error);
    return { success: false, error: "can not create visit " + error };
  }
}

export async function getTodayVisits(): Promise<{
  success: boolean;
  data?: SimpleVisitWithUserType[];
  error?: string;
}> {
  try {
    const now = new Date();
    const startOfDay = new Date(now.setHours(0, 0, 0, 0));
    const endOfDay = new Date(now.setHours(23, 59, 59, 999));

    const visits = await prisma.visit.findMany({
      where: {
        visitDate: { gte: startOfDay, lte: endOfDay },
        OR: [{ deletedAt: null }, { deletedAt: { isSet: false } }],
      },
      include: {
        patient: {
          select: {
            user: {
              select: {
                username: true,
                id: true,
                phone: true,
                gender: true,
              },
            },
          },
        },
      },
    });

    const data = visits.map((user) => ({
      visitId: user.id,
      visitType: user.type,
      patientId: user.patientId,
      username: user.patient.user.username,
      phone: user.patient.user.phone,
      gender: user.patient.user.gender,
      userId: user.patient.user.id,
    })) as SimpleVisitWithUserType[];

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error("Error fetching today patients:", error);
    return {
      success: false,
      error: "can not get patient data",
      data: [],
    };
  }
}

export async function getVisits(): Promise<{
  success: boolean;
  data?: Visit[];
  error?: string;
  count?: number;
}> {
  try {
    const visits = await prisma.visit.findMany({
      include: {
        patient: true,
      },
    });
    return {
      success: true,
      data: visits,
      count: visits.length,
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

export async function deleteVisit({
  visitId,
  deleteBy,
}: {
  visitId: string | undefined;
  deleteBy: string | undefined;
}): Promise<{
  success: boolean;
  error?: string;
}> {
  if (!visitId) {
    return { success: false, error: "visit id not exit" };
  }

  if (!deleteBy) {
    return { success: false, error: "unuthorized" };
  }

  try {
    await prisma.$transaction(async (x) => {
      await x.invoice.update({
        where: { visitId },
        data: { deletedAt: new Date() },
      });
      await x.visit.update({
        where: { id: visitId },
        data: { deletedAt: new Date() },
      });
    });
    revalidatePath("/receptionist");
    revalidatePath("/api/visit");
    return {
      success: true,
    };
  } catch (error) {
    console.error("Error fetching today patients:", error);
    return {
      success: false,
      error: "can not get patient data",
    };
  }
}

export async function updateVisit(
  { visitId }: { visitId: string },
  prevState: VisitFormState,
  formData: FormData,
): Promise<{
  success: boolean;
  error?: string;
}> {
  if (!visitId) {
    return { success: false, error: "redirect" };
  }
  const newType = formData.get("type") as VisitType;
  if (!newType) {
    return { success: false, error: "type of visit is not define" };
  }

  try {
    await prisma.visit.update({
      where: { id: visitId },
      data: { type: newType },
    });
    revalidatePath("patients");
    return {
      success: true,
    };
  } catch (error) {
    console.error("Error fetching today patients:", error);
    return {
      success: false,
      error: "can not get patient data",
    };
  }
}
