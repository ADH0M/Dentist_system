"use server";

import { UserType } from "@/generated/prisma";
import prisma from "@/lib/db/db-connection";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { PatientFormState } from "./patientActions";

export async function deleteUser({
  id,
}: {
  id: string;
}): Promise<PatientFormState> {
  const cookieStore = await cookies();
  const role = cookieStore.get("role")?.value;

  if (role !== "admin") {
    return {
      success: false,
      error: "user id is required",
    };
  }

  if (!id)
    return {
      success: false,
      error: "user id is required",
    };

  try {
    await prisma.user.delete({
      where: { id: id },
    });
    revalidatePath("/admin");
    return {
      success: true,
    };
  } catch (error) {
    console.error("Failed to delete user:", error);
    return {
      success: false,
      error: "error",
    };
  }
}

export async function updateUserRole(userId: string, newRole: UserType) {
  const cookieStore = await cookies();
  const role = cookieStore.get("role")?.value;

  if (role !== "admin") {
    throw new Error("Unauthorized");
  };
  
  if(!userId){
    throw new Error('user undefined');
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
