"use server";
import { redirect } from "next/navigation";
import prisma from "../db/db-connection";
import { revalidatePath } from "next/cache";

export async function createProject(
  type: "todo" | "project_tracker" | "meeting_notes" | "task_tracker",
  userId: string
) {
  if (!userId) redirect("/login");
  const newProject = await prisma.project.create({
    data: {
      title: type,
      userId,
      type,
    },
  });

  revalidatePath("/projects");
  redirect("/projects/" + newProject.id);
}


export async function updateProject(projectId:string,data) {
  

  await prisma.project.update({
    where: { id: projectId },
    data,
  });
}

export async function deleteProjet(userId:string) {

  await prisma.project.delete({
    where: { id: userId },
  });
}

export async function getProjects(userId: string) {
  if (!userId) {
    throw new Error("User ID is required");
  }

  try {
    const projects = await prisma.project.findMany({
      where: { userId },
      orderBy: { order: "asc" },
      select: {
        id: true,
        order: true,
        title: true,
        type: true,
        createdAt: true,
      },
    });
    return projects.map((pr) => ({
      ...pr,
      createdAt: pr.createdAt.toISOString(),
    }));
  } catch (err) {
    console.error("Error fetching projects:", err);
    throw new Error("Could not fetch projects");
  }
}
