/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import prisma from "../db/db-connection";
import bcrypt from "bcryptjs";
import { signToken, type JwtPayload } from "../utils/jwt";
import { loginSchema, registrationSchema } from "../validations/schema";

export type SignupErrors = { path: string; message: string };
export type SignupFormState = {
  message?: string;
  path?: string;
  errors?: SignupErrors[];
  success?:boolean;
};

export async function registerAction(
  prevState: SignupFormState,
  formData: FormData,
): Promise<SignupFormState> {
  const username = formData.get("username") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const phone = formData.get("phone") as string;
  const confirmPassword = formData.get("confirmPassword") as string;
  const terms = formData.get("terms") as "on" | "off";

  const userData = {
    username,
    email,
    phone,
    password,
    confirmPassword,
    terms: terms === "on" ? true : "",
  };

  // Validation

  const schema = registrationSchema.safeParse(userData);
  if (!schema.success) {
    console.log(schema.error.issues);
    const validError = schema.error.issues.map((err, ind) => {
      return {
        message: err.message,
        path: (err.path[0] as string) || `${ind}`,
      };
    });
    return { message: "Validation failed.", errors: validError };
  }

  try {
    let existingUser = false;
    let existingPhone = false;
    await prisma.$transaction(async (t) => {
      const findEmail = await t.user.findUnique({ where: { email } });
      const findPhone = await t.user.findUnique({ where: { phone } });

      if (findPhone) existingPhone = true;
      if (findEmail) existingUser = true;
    });

    if (existingUser) {
      return {
        message: "User already exists.",
        path: "An account with this email already exists.",
      };
    }

    if (existingPhone) {
      return {
        message: "Phone already exists.",
        path: "An account with this phone already exists.",
      };
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.$transaction(async (t) => {
      const user = await t.user.create({
        data: {
          email,
          username,
          password: hashedPassword,
          role: "patient",
          phone,
        },
      });

      await t.patient.create({
        data: {
          userId: user.id,
        },
      });

    });

    return {success:true}
  } catch (error: any) {
    console.error("Signup error:", error);
    return {
      message: "Something went wrong.",
      path: "Failed to create account. Please try again later.",
    };
  }
}

export async function loginUpAction(
  prevState: SignupFormState,
  formData: FormData,
): Promise<SignupFormState> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  
  // Validation
  const loginValidation = loginSchema.safeParse({email ,password});

  if(!loginValidation.success){
    const errors = loginValidation.error.issues.map((err)=>({path:err.path[0] as string ,message:err.message}))
    return {errors}
  }

  try {
    const cookieStore = await cookies();

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return { path: "Invalid credentials" ,message: "User Email Not Match Password "};
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return {  path: "Invalid credentials"  ,message: "User Email Not Match Password"} 
    }
    

    const tokenPayload: Omit<JwtPayload, "iat" | "exp"> = {
      userId: user.id,
      username: user.username,
      email: user.email || undefined,
      phone: user.phone || undefined,
      role: user.role,
    };

    const token = await signToken(tokenPayload);

    cookieStore.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
      sameSite: "strict",
      path: "/",
    });

    cookieStore.set("userId", user.id);
    cookieStore.set("email", user.email||'');
    cookieStore.set("username", user.username);
    cookieStore.set("role", user.role);
    return {success:true}
  } catch (error: any) {
    console.error("Login error:", error);
    return {
      message: "Something went wrong.",
       path: "Failed to login. Please try again later.",
    };
  }
}

export async function logoutAction() {
  try {
    const cookieStore = await cookies();
    const email = cookieStore.get("email")?.value as string;
    if (email) {
      await prisma.user.update({
        where: { email: email },
        data: { isOnline: false },
      });
    }
    cookieStore.delete("token");
    cookieStore.delete("userId");
    cookieStore.delete("email");
    cookieStore.delete("username");
    cookieStore.delete("role");
  } catch (error: any) {
    console.error("Logout error:", error);
  } finally {
    redirect("/");
  }
}

export async function isExistEmail(email: string): Promise<boolean> {
  try {
    if (!email) {
      return false;
    }

    const checkEmail = await prisma.user.findUnique({
      where: { email: email },
    });

    return checkEmail ? true : false;
  } catch (error: any) {
    console.error("check is email error:", error);
    return false;
  }
}

export async function isExistPhone(phone: string): Promise<boolean> {
  try {
    if (!phone) {
      return false;
    }

    const checkPhone = await prisma.user.findUnique({
      where: { phone },
    });

    return checkPhone ? true : false;
  } catch (error: any) {
    console.error("check is Phone error:", error);
    return false;
  }
}
