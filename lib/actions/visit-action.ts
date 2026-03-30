'use server';
import { VisitType } from "@/generated/prisma";
import prisma from "../db/db-connection";

type VisitFormState = {
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
  { createBy, id }: { createBy: string |undefined; id: string },
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
    ].find((t) => t === type);

    if (!isType) return { success: false, error: "type is not define " };
    if (!createBy) {
      return { success: false, error: "redirect" };
    }
    if (!id) return { success: false, error: "patient not define " };

    const createVisit = await prisma.visit.create({
      data: { patientId: id, type, createdById: createBy },
    });
    console.log(createVisit);

    return { success: true };
  } catch (error) {
    console.error("Database Error:", error);
    return { success: false, error: "can not create visit " + error };
  }
}
