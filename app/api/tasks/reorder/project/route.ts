// app/api/tasks/reorder/route.ts
import prisma from "@/lib/db/db-connection";
import { NextRequest } from "next/server";

// Types matching your Prisma schema
interface ReorderTaskRequest {
  projectId: string;
  newIndex: number; 
}

export async function POST(req: NextRequest) {
  try {
    const { projectId, newIndex }: ReorderTaskRequest =
      await req.json();

    // Validate input
    if (!projectId) {
      return Response.json({ error: "projectId is required" }, { status: 400 });
    }

    // Get the task to move
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: {
        id: true,
        order: true,
        userId: true,
      },
    });

    if (!project) {
      return Response.json({ error: "project not found" }, { status: 404 });
    }

    // Get all tasks in the NEW column (including the moved task if same column)
    const tasksInNewColumn = await prisma.project.findMany({
      where: {
        userId: project.userId,
      },
      orderBy: { order: "asc" },
      select: { id: true, order: true },
    });

    // Calculate new order value using fractional indexing
    let newOrder: number;
    if (newIndex === 0) {
      // Insert at beginning
      const nextOrder =
        tasksInNewColumn.length > 0 ? tasksInNewColumn[0].order : 1.0;
      newOrder = nextOrder / 2;
    } else if (newIndex >= tasksInNewColumn.length) {
      // Insert at end
      const lastOrder =
        tasksInNewColumn.length > 0
          ? tasksInNewColumn[tasksInNewColumn.length - 1].order
          : 0;
      newOrder = lastOrder + 1.0;
    } else {
      // Insert between two items
      const prevOrder = tasksInNewColumn[newIndex - 1].order;
      const nextOrder = tasksInNewColumn[newIndex].order;
      newOrder = (prevOrder + nextOrder) / 2;
    }

    // Update the task
    const updatedTask = await prisma.project.update({
      where: { id: projectId },
      data: {
        order: newOrder,
      },
      select: {
        id: true,
        title: true,
        order: true,
      },
    });

    return Response.json(updatedTask, { status: 200 });
  } catch (error) {
    console.error("Reorder error:", error);
    return Response.json({ error: "Failed to reorder project" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
