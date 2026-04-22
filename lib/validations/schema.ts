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
  .regex(/^\+?[0-9]{10,15}$/, "Invalid phone number format");

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
