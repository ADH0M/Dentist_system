import { Prisma } from "@/generated/prisma";

// ===========================================================================
//                              Patients Types
export type PatientWithVisits = Prisma.PatientGetPayload<{
  include: { visits: true };
}>;

export type PatientWithUser = Prisma.PatientGetPayload<{
  include: { user:true};
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