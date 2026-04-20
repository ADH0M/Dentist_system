/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import prisma from "../db/db-connection";
import bcrypt from "bcryptjs";
import { signToken, type JwtPayload } from "../utils/jwt";

export type SignupFormState = {
  message?: string;
  errors?: {
    username?: string[];
    email?: string[];
    phone?: string[];
    password?: string[];
    confirmPassword?: string[];
    general?: string;
  };
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

  // Validation
  const errors: {
    phone?: string[];
    username?: string[];
    email?: string[];
    password?: string[];
    confirmPassword?: string[];
    general?: string;
  } = {};

  let hasErrors = false;

  if (!username || username.length < 2) {
    errors.username = ["Username must be at least 2 characters long."];
    hasErrors = true;
  }

  const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  if (!email || !emailRegex.test(email)) {
    errors.email = ["Please enter a valid email address."];
    hasErrors = true;
  }

  if (!password || password.length < 6) {
    errors.password = ["Password must be at least 6 characters long."];
    hasErrors = true;
  }

  if (password !== confirmPassword) {
    errors.confirmPassword = ["Passwords do not match."];
    hasErrors = true;
  }

  if (phone.length !== 11) {
    errors.phone = ["phone must be 11 numbers."];
    hasErrors = true;
  }

  if (hasErrors) {
    return { message: "Validation failed.", errors };
  }

  try {
    let existingUser = false;
    await prisma.$transaction(async (t) => {
      const findUser = await prisma.user.findUnique({ where: { email } });
      const findPatinet = await prisma.user.findFirst({ where: { email } });

      if (findPatinet || findUser) existingUser = true;
    });

    if (existingUser) {
      return {
        message: "User already exists.",
        errors: {
          general: "An account with this email already exists.",
        },
      };
    }

    let existingPhone = false;
    await prisma.$transaction(async (t) => {
      const findUser = await prisma.user.findUnique({ where: { phone } });
      const findPatinet = await prisma.user.findFirst({ where: { phone } });

      if (findPatinet || findUser) existingPhone = true;
    });

    if (existingPhone) {
      return {
        message: "P already exists.",
        errors: {
          general: "An account with this phone already exists.",
        },
      };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.$transaction(async (t) => {
      const patient = await t.patient.create({
        data: {
          email,
          name: username,
          phone,
        },
      });
      await t.user.create({
        data: {
          email,
          username,
          password: hashedPassword,
          role: "patient",
          patientId: patient.id,
          phone,
        },
      });
    });
  } catch (error: any) {
    console.error("Signup error:", error);
    return {
      message: "Something went wrong.",
      errors: {
        general: "Failed to create account. Please try again later.",
      },
    };
  }

  redirect("/login");
}

export async function loginUpAction(
  prevState: SignupFormState,
  formData: FormData,
): Promise<SignupFormState> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  // Validation
  const errors: {
    email?: string[];
    password?: string[];
    general?: string;
  } = {};

  let hasErrors = false;

  const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  if (!email || !emailRegex.test(email)) {
    errors.email = ["Please enter a valid email address."];
    hasErrors = true;
  }

  if (!password || password.length < 6) {
    errors.password = ["Password must be at least 6 characters long."];
    hasErrors = true;
  }

  if (hasErrors) {
    return { message: "Validation failed.", errors };
  }

  try {
    const cookieStore = await cookies();

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return { errors: { general: "Invalid credentials" } };
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return { errors: { general: "Invalid credentials" } };
    }

    const tokenPayload: Omit<JwtPayload, "iat" | "exp"> = {
      userId: user.id,
      username: user.username,
      email: user.email,
      phone: user.phone || undefined,
      role: user.role,
      patientId: user.patientId || undefined,
    };

    const token =await signToken(tokenPayload);

    cookieStore.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
      sameSite: "strict",
      path: "/",
    });

    cookieStore.set("userId", user.id);
    cookieStore.set("email", user.email);
    cookieStore.set("username", user.username);
    cookieStore.set("role", user.role);
  } catch (error: any) {
    console.error("Login error:", error);
    return {
      message: "Something went wrong.",
      errors: {
        general: "Failed to login. Please try again later.",
      },
    };
  }

  redirect("/");
}

export async function logoutAction() {
  try {
    const cookieStore = await cookies();
    const email = cookieStore.get("email")?.value as string;
    if (email) {
      await prisma.user.update({
        where: { email: email },
        data: { isActive: false },
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
    redirect("/login");
  }
}
