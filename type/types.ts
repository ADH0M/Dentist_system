import { Gender, Prisma } from "@/generated/prisma";

// ===========================================================================
//                              Patients Types
export type PatientWithVisits = Prisma.PatientGetPayload<{
  include: { visits: true };
}>;

export type PatientWithUser = Prisma.PatientGetPayload<{
  select: {
    id: true;
    createdAt: true;
    user: {
      select: {
        id: true;
        username: true;
        email: true;
        phone: true;
        gender: true;
      };
    };
  };
}>;

export type PatientError = {
  username?: string;
  phone?: string;
  gender?: string;
  address?: string;
  birthdate?: string;
};

export type PatientFormState = {
  success: boolean;
  error?: string;
  message?: string;
  errors?: PatientError;
};

export type GetPatientType = {
  success: boolean;
  data?: P_VisitsInvoicesImages;
  msg?: string;
  error?: boolean;
  redirect?: boolean;
};

export type P_VisitsInvoicesImages = Prisma.PatientGetPayload<{
  include: { visits: true; images: true; invoices: true };
}>;

// ===========================================================================
//                                 User
export type UserInfo =Prisma.UserGetPayload<{select:{id:true ,username:true , gender:true ,phone:true}}>





// =============================================================================
//                                 Visits

export type SimpleVisitWithUserType = {
visitId:string;
visitType:string;
patientId:string;
username:string;
phone:string;
gender:Gender;
userId:string;
};

export type SimplePatientVisitType = Prisma.VisitGetPayload<{
  select:{
    id:true,
    createdAt:true,
    deletedAt:true,
    type:true,
    patientId:true,
    invoice:{
      select:{
        paidAmount:true,
        totalAmount:true,
      }
    }
  }
}>