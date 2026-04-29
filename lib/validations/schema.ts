import * as z from "zod";

export const userCheckPassword = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[^A-Za-z0-9]/,
        "Password must contain at least one special character",
      ),
    confirmPassword: z.string(),
  })
  .refine((obj) => obj.password === obj.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const usernameValid = z
  .string()
  .min(3, "Username must be at least 3 characters")
  .max(30, "Username must be less than 30 characters")
  .regex(
    /^[a-zA-Z0-9_]+$/,
    "Username can only contain letters, numbers, and underscores",
  );

export const emailValid = z.email("invalid email fromat");
export const phoneValid = z
  .string()
  .regex(/^01[0125][0-9]{8}$/, "Invalid phone number");

export const registrationSchema = z
  .object({
    username: usernameValid,
    email: emailValid,
    phone: phoneValid,
    password: userCheckPassword.shape.password,
    confirmPassword: z.string(),
    terms: z
      .boolean("You must accept the terms")
      .refine((val) => val === true, "You must accept the terms"),
  })
  .refine(
    (data) => data.password === data.confirmPassword,

    {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    },
  );

export const loginSchema = z.object({
  email: z.email("invalid email fromat"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100),
});

export const updateUserInfo = z.object({
  name: z.string().min(3, "your name too short").max(100, "your name too long"),
  phone: z.string,
});

export const NewPatientValid = z.object({
  username: z
    .string()
    .trim()
    .min(3, "patient name too short")
    .max(50, "patient name to long"),
  phone: phoneValid,
  address: z.string().trim().min(3).optional().or(z.literal("")),
  gender: z.enum(["male", "female"]),
  birthdate: z.date().optional().or(z.literal("invalid date")),
});

export type NewPatientType = z.infer<typeof NewPatientValid>;


export const SearchWithPhone = z
  .string()
  .regex(/^01[0125][0-9]{1,8}$/, "Invalid phone number");



export const CreateVisitSchema = z.object({
  type: z.enum([
    "Initial",
    "FollowUp",
    "Emergency",
    "Cleaning",
    "Consultation",
    "Surgery",
  ]),
  totalAmount: z
    .string()
    .transform((val) => Number(val))
    .refine((val) => !isNaN(val) && val >= 20, {
      message: "Amount must be at least 20",
    }),
  note_paid: z.string().optional(),
});