'use client';
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Prisma } from "@/generated/prisma";
import { deleteTask } from "@/lib/actions/notes-action";

type Task = Prisma.TaskGetPayload<object>;

interface TaskCardProps {
  task: Task;
}

const TaskCard = ({ task }: TaskCardProps) => {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: "Task",
      task,
    },
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="bg-background p-3 rounded-lg border border-primary/50 shadow-md opacity-30 h-[60px]"
      />
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-background p-3 rounded-lg border border-border shadow-sm hover:shadow-md transition-shadow group cursor-grab touch-none"
    >
      <div className="flex justify-between items-start gap-2">
        <p className="text-sm font-medium wrap-break-word">{task.title}</p>
        <form action={deleteTask.bind(null, task.id)}>
          <button
            type="submit"
            className="text-muted-foreground hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
            onPointerDown={(e) => e.stopPropagation()} // Prevent drag when clicking delete
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
};

export default TaskCard;
