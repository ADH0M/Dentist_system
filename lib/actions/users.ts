// app/admin/users/actions.ts
"use server";
import { UserType } from "@/generated/prisma";
import prisma from "../db/db-connection";
import bcrypt from "bcryptjs";
import { AddAssistantState } from "@/pages/assistant/AddAssistant";
import { revalidatePath } from "next/cache";

export async function createUser(
  intialState: AddAssistantState,
  formData: FormData,
): Promise<AddAssistantState> {
  // Extract and trim fields
  const username = (formData.get("username") as string)?.trim();
  const email = (formData.get("email") as string)?.trim().toLowerCase();
  const password = formData.get("password") as string;
  const phone = (formData.get("phone") as string)?.trim();
  const role = formData.get("type") as UserType;

  // Helper: Return error response
  const error = (message: string) => ({ success: false, error: message });

  // 1. Validate required fields
  if (!username) {
    return error("Username is required");
  }
  if (!email) {
    return error("Email is required");
  }
  if (!password) {
    return error("Password is required");
  }
  if (!role) {
    return error("User role is required");
  }

  // 2. Validate username length
  if (username.length < 3) {
    return error("Username must be at least 3 characters");
  }
  if (username.length > 30) {
    return error("Username must be less than 30 characters");
  }

  // 3. Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return error("Please enter a valid email address");
  }
  if (email.length > 100) {
    return error("Email is too long");
  }

  // 4. Validate password strength
  if (password.length < 6) {
    return error("Password must be at least 6 characters");
  }

  if (password.length > 50) {
    return error("Password is too long");
  }

  if (phone.length !== 11) {
    return error("phone number must be 11 numbers");
  }
  // 6. Validate role is allowed
  const allowedRoles: UserType[] = [
    "admin",
    "assistant",
    "dentist",
    "receptionist",
  ];
  if (!allowedRoles.includes(role)) {
    return error("Invalid user role");
  }

  // 7. Check for existing user (email)
  let existingEmail = false;
  let existingPhone = false;
  await prisma.$transaction(async (t) => {
    const checkInUser = await t.user.findUnique({
      where: { email },
      select: { id: true },
    });

    const checkPatinet = await t.patient.findFirst({ where: { email } });
    const checkPhone = await t.user.findUnique({ where: { phone } });

    if (checkPhone) existingPhone = true;
    if (checkInUser || checkPatinet) existingEmail = true;
  });

  if (existingEmail) {
    return error("A user with this email already exists");
  }

  if (existingPhone) {
    return error("A user with this phone already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  console.log(username, email, password, hashedPassword);

  // 10. Create user
  await prisma.$transaction(async (t) => {
    const createAsPatient = await t.patient.create({
      data: {
        name: username,
        phone,
        email,
      },
    });

    await t.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        phone,
        patientId: createAsPatient.id,
        role,
      },
    });
  });

  revalidatePath("/admin");
  return { success: true, message: "User created successfully" };
}

export async function toggleUserActive(formData: FormData) {
  const userId = formData.get("userId") as string;
  const isActive = formData.get("isActive") === "true";

  await prisma.user.update({
    where: { id: userId },
    data: { isActive: !isActive },
  });
}

export async function updateUserType(formData: FormData) {
  const userId = formData.get("userId") as string;
  const role = formData.get("type") as UserType;
  if (!role || !userId) return;

  await prisma.user.update({
    where: { id: userId },
    data: { role },
  });
}

export async function deleteUser(formData: FormData) {
  const userId = formData.get("userId") as string;

  await prisma.$transaction(async (t) => {
    const findUser = await t.user.findUnique({
      where: { id: userId },
    });

    if (findUser) {
      await t.user.delete({ where: { id: userId } });
    }
  });
}

export async function getUser(userId: string, email: string) {
  if (!userId || !email) {
    throw new Error("User ID and email are required");
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      username: true,
      email: true,
      photo: true,
      role: true,
      phone: true,
      isActive: true,
    },
  });

  if (!user || user.email !== email) {
    throw new Error("User not found or email mismatch");
  }

  if (!user.isActive) {
    await prisma.user.update({
      where: { id: userId },
      data: { isActive: true },
    });
  }
  return user;
}
