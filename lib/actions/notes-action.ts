"use server";

import prisma from "@/lib/db/db-connection";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export async function createColumn(formData: FormData) {
  const title = formData.get("title") as string;
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value;

  if (!userId || !title) return;

  try {
    await prisma.column.create({
      data: {
        title,
        userId,
      },
    });
    revalidatePath("/notes");
  } catch (error) {
    console.error("Failed to create column:", error);
  }
}

export async function deleteColumn(columnId: string) {
  try {
    await prisma.column.delete({
      where: { id: columnId },
    });
    revalidatePath("/notes");
  } catch (error) {
    console.error("Failed to delete column:", error);
  }
}

export async function createTask(formData: FormData) {
  const title = formData.get("title") as string;
  const columnId = formData.get("columnId") as string;
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value;

  if (!userId || !title || !columnId) return;

  try {
    await prisma.task.create({
      data: {
        title,
        columnId,
        userId,
      },
    });
    revalidatePath("/notes");
  } catch (error) {
    console.error("Failed to create task:", error);
  }
}

export async function deleteTask(taskId: string) {
  try {
    await prisma.task.delete({
      where: { id: taskId },
    });
    revalidatePath("/notes");
  } catch (error) {
    console.error("Failed to delete task:", error);
  }
}

export async function updateTaskColumn(taskId: string, newColumnId: string) {
    try {
        await prisma.task.update({
            where: { id: taskId },
            data: { columnId: newColumnId }
        });
        revalidatePath("/notes");
    } catch (error) {
        console.error("Failed to move task:", error);
    }
}
