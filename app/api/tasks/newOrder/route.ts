// app/api/tasks/reorder/route.ts
import prisma from "@/lib/db/db-connection";
import { NextRequest } from "next/server";

interface ReorderTaskRequest {
  taskId: string;
  newColumnId: string | null;
  newIndex: number; // Position in new column (0-based)
}

export async function POST(req: NextRequest) {
  try {
    const { taskId, newColumnId, newIndex }: ReorderTaskRequest =
      await req.json();
    if (!taskId || !newColumnId || !newIndex) {
      return Response.json(
        { error: "your are not authorized" },
        { status: 404 }
      );
    }

    const getTask = await prisma.task.findUnique({
      where: { id: taskId },
      select: { userId: true, id: true },
    });

    if (!getTask) {
      return Response.json({ error: "not found task" }, { status: 404 });
    }

    const tasks = await prisma.task.findMany({
      where: {
        columnId: newColumnId,
        userId: getTask.userId,
      },
    });

    if (!tasks) {
      return Response.json({ error: "not found tasks" }, { status: 404 });
    }
    let newOrder;

    // index =>  0  ;
    // index => -1  ;
    // index => mid ;

    if (newIndex === 0) {
      const firstInext = tasks.length > 0 ? tasks[0].order : 1.0;
      newOrder = firstInext / 2;
    } else if (newIndex >= tasks.length) {
      const lastIndex = tasks.length > 0 ? tasks[tasks.length - 1].order : 0;
      newOrder = lastIndex + 1.0;
    } else {
      const prevIndex = tasks[newIndex - 1].order;
      const currIndex = tasks[newIndex].order;
      newOrder = (prevIndex + currIndex) / 2;
    }

    const updateTask = await prisma.task.update({
      where: { id: taskId },
      data: {
        columnId: newColumnId,
        order: newOrder,
      },
    });

    return Response.json(null, { status: 200 });
  } catch (error) {
    console.error("Reorder error:", error);
    return Response.json({ error: "Failed to reorder task" }, { status: 500 });
  }
}
