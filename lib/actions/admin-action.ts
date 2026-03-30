"use server";

import { UserType } from "@/generated/prisma";
import prisma from "@/lib/db/db-connection";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";




export async function deleteUser(userId: string) {
  const cookieStore = await cookies();
  const role = cookieStore.get("role")?.value;

  if (role !== "admin") {
    throw new Error("Unauthorized");
  }

  try {
  
    await prisma.user.delete({
      where: { id: userId },
    });
    revalidatePath("/admin");
  } catch (error) {
    console.error("Failed to delete user:", error);
    throw new Error("Failed to delete user");
  }
}

export async function updateUserRole(userId: string, newRole: UserType) {
  const cookieStore = await cookies();
  const role = cookieStore.get("role")?.value;

  if (role !== "admin") {
    throw new Error("Unauthorized");
  }

  try {
    await prisma.user.update({
      where: { id: userId },
      data: { role: newRole },
    });
    revalidatePath("/admin");
  } catch (error) {
    console.error("Failed to update user role:", error);
    throw new Error("Failed to update user role");
  }
}
