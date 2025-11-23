import prisma from "@/lib/db/db-connection";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createColumn, deleteColumn, createTask, deleteTask } from "@/lib/actions/notes-action";

async function getData(userId: string) {
  const columns = await prisma.column.findMany({
    where: { userId },
    include: {
      tasks: true,
    },
    orderBy: { order: 'asc' }
  });
  return columns;
}

export default async function NotesPage() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value;

  if (!userId) {
    redirect("/login");
  }

  const columns = await getData(userId);
  return (
    <div className="p-6 h-screen flex flex-col">
      <h1 className="text-3xl font-bold mb-6 text-accent-foreground">My Notes Board</h1>
      
      {/* Add Column Form */}
      <form action={createColumn} className="mb-8 flex gap-2 max-w-md">
        <input
          type="text"
          name="title"
          placeholder="New Column Name (e.g. To Do)"
          className="flex-1 p-2 border border-border rounded-lg bg-background"
          required
        />
        <button type="submit" className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors">
          Add Column
        </button>
      </form>

      {/* Kanban Board */}
      <div className="flex-1 overflow-x-auto flex gap-6 pb-4">
        {columns.map((column) => (
          <div key={column.id} className="min-w-[300px] w-[300px] bg-card rounded-xl shadow-sm border border-border flex flex-col max-h-full">
            {/* Column Header */}
            <div className="p-4 border-b border-border flex justify-between items-center bg-muted/30">
              <h3 className="font-semibold text-lg">{column.title}</h3>
              <form action={deleteColumn.bind(null, column.id)}>
                <button type="submit" className="text-muted-foreground hover:text-red-500 transition-colors" title="Delete Column">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                </button>
              </form>
            </div>

            {/* Tasks List */}
            <div className="p-4 flex-1 overflow-y-auto space-y-3">
              {column.tasks.map((task) => (
                <div key={task.id} className="bg-background p-3 rounded-lg border border-border shadow-sm hover:shadow-md transition-shadow group">
                  <div className="flex justify-between items-start gap-2">
                    <p className="text-sm font-medium wrap-break-word">{task.title}</p>
                    <form action={deleteTask.bind(null, task.id)}>
                      <button type="submit" className="text-muted-foreground hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                      </button>
                    </form>
                  </div>
                </div>
              ))}
              
              {column.tasks.length === 0 && (
                <p className="text-center text-xs text-muted-foreground py-4 italic">No tasks yet</p>
              )}
            </div>

            {/* Add Task Form */}
            <div className="p-4 border-t border-border bg-muted/10">
              <form action={createTask} className="flex gap-2">
                <input type="hidden" name="columnId" value={column.id} />
                <input
                  type="text"
                  name="title"
                  placeholder="Add a task..."
                  className="flex-1 p-2 text-sm border border-border rounded-md bg-background"
                  required
                />
                <button type="submit" className="p-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                </button>
              </form>
            </div>
          </div>
        ))}

        {columns.length === 0 && (
          <div className="flex flex-col items-center justify-center w-full h-64 text-muted-foreground border-2 border-dashed border-border rounded-xl">
            <p>No columns yet. Create one to get started!</p>
          </div>
        )}
      </div>
    </div>
  );
}
