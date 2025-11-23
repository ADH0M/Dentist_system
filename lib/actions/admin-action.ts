"use server";

import prisma from "@/lib/db/db-connection";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

// Define UserType enum to match Prisma schema if not importing directly
enum UserType {
  customer = "customer",
  admin = "admin",
}

export async function deleteUser(userId: string) {
  const cookieStore = await cookies();
  const role = cookieStore.get("role")?.value;

  if (role !== "admin") {
    throw new Error("Unauthorized");
  }

  try {
    // Delete user's tasks and columns first (cascade delete might handle this depending on schema, but explicit is safer)
    await prisma.task.deleteMany({ where: { userId } });
    await prisma.column.deleteMany({ where: { userId } });
    
    await prisma.user.delete({
      where: { id: userId },
    });
    revalidatePath("/admin");
  } catch (error) {
    console.error("Failed to delete user:", error);
    throw new Error("Failed to delete user");
  }
}

export async function updateUserRole(userId: string, newRole: "admin" | "customer") {
  const cookieStore = await cookies();
  const role = cookieStore.get("role")?.value;

  if (role !== "admin") {
    throw new Error("Unauthorized");
  }

  try {
    await prisma.user.update({
      where: { id: userId },
      data: { type: newRole },
    });
    revalidatePath("/admin");
  } catch (error) {
    console.error("Failed to update user role:", error);
    throw new Error("Failed to update user role");
  }
}
