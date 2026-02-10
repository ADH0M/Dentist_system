"use server";
import { redirect } from "next/navigation";
import prisma from "../db/db-connection";
import { revalidatePath, revalidateTag } from "next/cache";

export async function createTask(userId: string, order: number, title: string) {
  if (!userId) redirect("/login");
  if (!order) {
    order = 10000;
  }
  if (title) return;

  try {
    await prisma.project.create({
      data: {
        title,
        userId,
        order: order + 2000,
      },
    });
  } catch (error) {}

  revalidatePath("/(tasks-system)/", "layout");
  revalidatePath("/", "layout");
}

export async function updateTask(
  taskId: string,
  userId: string,
  title: string
) {
  if (!taskId || !userId) {
    redirect("/");
  }

  if (!title || title.length <= 2) {
    return;
  }

  await prisma.project.update({
    where: { id: taskId, userId },
    data: { title },
  });
  revalidatePath("/", "layout");
}

export async function deleteTask(
  userId: string,
  projectId: string,
  taskId: string
) {
  if (!projectId || !userId) {
    redirect("/");
  }

  if (!taskId) return;

  await prisma.task.delete({
    where: { id: taskId, userId, projectId },
  });

  revalidatePath("/", "layout");
}

export async function getTasks(userId: string, projectId: string) {
  if (!userId) {
    throw new Error("User ID is required");
  }

  try {
    const tasks = await prisma.task.findMany({
      where: { userId, projectId },
      orderBy: { order: "asc" },
      select: {
        id: true,
        order: true,
        title: true,
        createdAt: true,
        userId: true,
        state: true,
      },
    });
    revalidateTag("projects", "max");

    return tasks.map((pr) => ({
      ...pr,
      createdAt: pr.createdAt.toISOString(),
    }));
  } catch (err) {
    console.error("Error fetching task:", err);
    throw new Error("Could not fetch projects");
  }
}
