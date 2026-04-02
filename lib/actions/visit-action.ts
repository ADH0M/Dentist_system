"use server";
import { Visit, VisitType } from "@/generated/prisma";
import prisma from "../db/db-connection";
import { revalidatePath } from "next/cache";

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
    const type = formData.get("type") as VisitType;
    const totalAmount = formData.get("totalAmount") as string;
    const note_paid = formData.get("note_paid") as string;

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
    if (isNaN(Number(totalAmount)) && Number(totalAmount) < 20)
      return { success: false, error: "totalAmount is not define " };
    if (!createBy) {
      return { success: false, error: "redirect" };
    }
    if (!id) return { success: false, error: "patient not define " };

    await prisma.$transaction(async (x) => {
      const currnetVisit = await x.visit.create({
        data: { patientId: id, type, createdById: createBy },
      });
      const invoiceNumber = `INV-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

      await x.invoice.create({
        data: {
          totalAmount: Number(totalAmount),
          createdById: createBy,
          patientId: currnetVisit.patientId,
          notes: note_paid || "",
          visitId: currnetVisit.id,
          invoiceNumber,
        },
      });
    });

    revalidatePath("/patients");

    return { success: true };
  } catch (error) {
    console.error("Database Error:", error);
    return { success: false, error: "can not create visit " + error };
  }
}

export async function getTodayVisits(): Promise<{
  success: boolean;
  data?: Visit[];
  error?: string;
  count?: number;
}> {
  try {
    const now = new Date();
    const startOfDay = new Date(now.setHours(0, 0, 0, 0));
    const endOfDay = new Date(now.setHours(23, 59, 59, 999));

    const patients = await prisma.visit.findMany({
      where: {
        createdAt: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      orderBy: {
        createdAt: "asc",
      },
      include: {
        patient: true,
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
    return { success: false, error: "redirect" };
  }

  try {
    await prisma.$transaction(async (x) => {
      await x.invoice.delete({ where: { visitId } });
      await x.visit.delete({
        where: { id: visitId },
      });
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
