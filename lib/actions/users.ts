// app/admin/users/actions.ts
"use server";
import prisma from "../db/db-connection";

export async function createUser(formData: FormData) {
  const username = formData.get("username") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const phone = formData.get("phone") as string | null;
  const type = formData.get("type") as "customer" | "admin";

  const hashedPassword = password;
  await prisma.user.create({
    data: {
      username,
      email,
      password: hashedPassword,
      phone: phone || undefined,
      type,
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
  const type = formData.get("type") as "customer" | "admin";

  await prisma.user.update({
    where: { id: userId },
    data: { type },
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
      type: true,
      phone: true,
      isActive: true,
    },
  });

  if (!user || user.email !== email) {
    throw new Error("User not found or email mismatch");
  }

  return user;
}
