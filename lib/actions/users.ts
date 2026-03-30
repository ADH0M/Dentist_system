// app/admin/users/actions.ts
"use server";
import { UserType } from "@/generated/prisma";
import prisma from "../db/db-connection";

export async function createUser(formData: FormData) {
  const username = formData.get("username") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const phone = formData.get("phone") as string | null;
  const role = formData.get("type") as UserType;

  const hashedPassword = password;
  await prisma.user.create({
    data: {
      username,
      email,
      password: hashedPassword,
      phone: phone || undefined,
      role,
      isActive: false,
    },
  });

  return { success: true };
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
  if(!role || !userId)return

  await prisma.user.update({
    where: { id: userId },
    data: { role },
  });
}

export async function deleteUser(formData: FormData) {
  const userId = formData.get("userId") as string;

  await prisma.user.delete({
    where: { id: userId },
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
