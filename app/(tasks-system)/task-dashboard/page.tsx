"use client";
import { getColumnsAction } from "@/lib/actions/notes-action";
import { useState, DragEvent, useEffect } from "react";

// ✅ Define a Task (what appears as a draggable "card")
interface Task {
  title: string;
  id: string;
  content: string | null;
  favorite: boolean | null;
  order: number;
  userId: string;
  columnId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// ✅ Define a Column (which contains many Tasks)
interface ColumnData {
  title: string;
  id: string;
  order: number;
  userId: string;
  tasks: Task[];
}

// --- Component Props ---
interface ColumnProps {
  title: string;
  headingColor: string;
  columns?: ColumnData[];
  tasks: Task[]; // 👈 not "cards"
  columnId: string; // 👈 use actual column ID, not title
  setColumns: React.Dispatch<React.SetStateAction<ColumnData[]>>; // 👈 update full columns
}

interface DropIndicatorProps {
  beforeId: string | null;
  columnId: string; // better than "column"
}

interface AddCardProps {
  columnId: string;
  setColumns: React.Dispatch<React.SetStateAction<ColumnData[]>>;
}

interface BurnBarrelProps {
  setColumns: React.Dispatch<React.SetStateAction<ColumnData[]>>;
}

interface NearestIndicatorResult {
  offset: number;
  element: HTMLElement;
}

const CustomKanban = () => {
  return (
    <div className="h-screen w-full bg-neutral-900 text-neutral-50">
      <Board />
    </div>
  );
};

export default CustomKanban;

// --- Board ---
const Board = () => {
  const [columns, setColumns] = useState<ColumnData[]>([]);

  useEffect(() => {
    const fetchColumns = async () => {
      try {
        const data = await getColumnsAction("6921e882a82c382cb3d920db");
        // Ensure data is properly shaped as ColumnData[]
        setColumns(data);
      } catch (error) {
        console.error("Failed to fetch columns:", error);
      }
    };
    fetchColumns();
  }, []);

  return (
    <div className="flex h-full w-full gap-3 overflow-scroll p-12">
      {columns.map((col) => (
        <div key={col.id}>
          <Column
            title={col.title}
            columnId={col.id}
            headingColor="text-neutral-500"
            tasks={col.tasks}
            columns={columns}
            setColumns={setColumns}
          />
        </div>
      ))}
      <BurnBarrel setColumns={setColumns} />
    </div>
  );
};

// --- Column ---
const Column = ({
  title,
  headingColor,
  tasks,
  columnId,
  columns,
  setColumns,
}: ColumnProps) => {
  const [active, setActive] = useState(false);

  const clearHighlights = () => {
    getIndicators().forEach((i) => ((i as HTMLElement).style.opacity = "0"));
  };

  const getNearestIndicator = (
    e: DragEvent,
    indicators: Element[]
  ): NearestIndicatorResult => {
    const DISTANCE_OFFSET = 50;
    return indicators.reduce<NearestIndicatorResult>(
      (closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = e.clientY - (box.top + DISTANCE_OFFSET);
        if (offset < 0 && offset > closest.offset) {
          return { offset, element: child as HTMLElement };
        }
        return closest;
      },
      {
        offset: Number.NEGATIVE_INFINITY,
        element: indicators[indicators.length - 1] as HTMLElement,
      }
    );
  };

  const getIndicators = (): Element[] => {
    return Array.from(document.querySelectorAll(`[data-column="${columnId}"]`));
  };

  const highlightIndicator = (e: DragEvent) => {
    const indicators = getIndicators();
    clearHighlights();
    const el = getNearestIndicator(e, indicators);
    el.element.style.opacity = "1";
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    highlightIndicator(e);
    setActive(true);
  };

  const handleDragLeave = () => {
    clearHighlights();
    setActive(false);
  };

  function moveTask(
    columns: ColumnData[],
    sourceColumnId: string,
    targetColumnId: string,
    taskId: string,
    newIndex: number
  ): ColumnData[] {
    // Remove from source
    const updatedColumns = columns.map((col) =>
      col.id === sourceColumnId
        ? { ...col, tasks: col.tasks.filter((t) => t.id !== taskId) }
        : col
    );

    // Add to target
    const taskToMove = columns
      .find((col) => col.id === sourceColumnId)
      ?.tasks.find((t) => t.id === taskId);

    if (!taskToMove) return updatedColumns;

    const targetColIndex = updatedColumns.findIndex(
      (col) => col.id === targetColumnId
    );
    if (targetColIndex === -1) return updatedColumns;

    const newTask = { ...taskToMove, columnId: targetColumnId };
    const targetTasks = [...updatedColumns[targetColIndex].tasks];

    // Insert at new index
    targetTasks.splice(newIndex, 0, newTask);

    updatedColumns[targetColIndex] = {
      ...updatedColumns[targetColIndex],
      tasks: targetTasks,
    };

    return updatedColumns;
  }

  const handleDragEnd = async (e: DragEvent, columnId: string | null) => {
    const taskId = e.dataTransfer.getData("taskId");
    const sourceColumnId = e.dataTransfer.getData("sourceColumnId");

    setActive(false);
    clearHighlights();

    const indicators = getIndicators();
    const { element } = getNearestIndicator(e, indicators);
    const beforeId = element.dataset.before || "-1";

    // Find current task and columns
    const allColumns = columns!;
    const sourceColumn = allColumns.find((col) => col.id === sourceColumnId);

    const taskToMove = sourceColumn?.tasks.find((t) => t.id === taskId);

    if (!taskToMove) return;

    // Determine target column and new index
    const targetColumn = allColumns.find((col) => col.id === columnId);
    if (!targetColumn) return;

    let newIndex: number;
    if (beforeId === "-1") {
      // Drop at end
      newIndex = targetColumn.tasks.length;
    } else {
      // Find position of "before" task
      const beforeIndex = targetColumn.tasks.findIndex(
        (t) => t.id === beforeId
      );
      newIndex = beforeIndex >= 0 ? beforeIndex : targetColumn.tasks.length;
    }

    // Optimistic UI update
    const updatedColumns = moveTask(
      allColumns,
      sourceColumnId,
      columnId!,
      taskId,
      newIndex
    );
    setColumns(updatedColumns);

    // Sync with backend
    try {
      const res = await fetch("/api/tasks/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          taskId,
          newColumnId: columnId,
          newIndex,
        }),
      });

      if (!res.ok) {
        // Revert on error
        setColumns(allColumns);
        const error = await res.json();
        console.error("Reorder failed:", error);
      }
    } catch (error) {
      console.error("Network error:", error);
      setColumns(allColumns); // Revert
    }
  };

  return (
    <div className="w-56 shrink-0">
      <div className="mb-3 flex items-center justify-between">
        <h3 className={`font-medium ${headingColor}`}>{title}</h3>
        <span className="rounded text-sm text-neutral-400">{tasks.length}</span>
      </div>
      <div
        className={`h-full w-full transition-colors ${
          active ? "bg-neutral-800/50" : "bg-neutral-800/0"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={(e) => handleDragEnd(e, tasks[0].columnId)}
      >
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
        <DropIndicator beforeId={null} columnId={columnId} />
        <AddCard columnId={columnId} setColumns={setColumns} />
      </div>
    </div>
  );
};

// --- Task Card ---
const TaskCard = ({ task }: { task: Task }) => {
  const handleDragStart = (
    e: DragEvent<HTMLDivElement>,
    taskId: string,
    columnId: string
  ) => {
    e.dataTransfer.setData("taskId", taskId);
    e.dataTransfer.setData("sourceColumnId", columnId);
  };
  return (
    <>
      <DropIndicator beforeId={task.id} columnId={task.columnId || ""} />
      <div
        id={task.id}
        draggable
        onDragStart={(e) => handleDragStart(e, task.id, task.columnId || "")}
        className="cursor-grab rounded border border-neutral-700 bg-neutral-800 p-3 active:cursor-grabbing"
      >
        <p className="text-sm text-neutral-100">{task.title}</p>
      </div>
    </>
  );
};

// --- Drop Indicator ---
const DropIndicator = ({ beforeId, columnId }: DropIndicatorProps) => {
  return (
    <div
      data-before={beforeId || "-1"}
      data-column={columnId}
      className="my-0.5 h-0.5 w-full bg-violet-400 opacity-0"
    />
  );
};

// --- Burn Barrel ---
const BurnBarrel = ({ setColumns }: BurnBarrelProps) => {
  const [active, setActive] = useState(false);

  // In BurnBarrel component
  const handleDragEnd = async (e: DragEvent) => {
    const taskId = e.dataTransfer.getData("taskId");
    const sourceColumnId = e.dataTransfer.getData("sourceColumnId");

    // Optimistic delete
    setColumns((prev) =>
      prev.map((col) =>
        col.id === sourceColumnId
          ? { ...col, tasks: col.tasks.filter((t) => t.id !== taskId) }
          : col
      )
    );
    setActive(false);

    // Delete from DB
    try {
      await fetch(`/api/tasks/${taskId}`, {
        method: "POST",
      });
    } catch (error) {
      console.error("Delete failed:", error);
      // Revert optimistic update if needed
    }
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    setActive(true);
  };

  const handleDragLeave = () => setActive(false);
  return (
    <div
      className={`mt-10 grid h-56 w-56 shrink-0 place-content-center rounded border text-3xl ${
        active
          ? "border-red-800 bg-red-800/20 text-red-500"
          : "border-neutral-500 bg-neutral-500/20 text-neutral-500"
      }`}
      onDrop={handleDragEnd}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      {active ? "Drop to delete" : "🗑️ Burn Barrel"}
    </div>
  );
};

// --- Add Task ---
const AddCard = ({ columnId, setColumns }: AddCardProps) => {
  const [text, setText] = useState("");
  const [adding, setAdding] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    const newTask: Task = {
      id: Math.random().toString(36).substring(2, 9),
      title: text.trim(),
      content: null,
      favorite: false,
      order: Date.now(),
      userId: "6921e882a82c382cb3d920db", // TODO: get from auth
      columnId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setColumns((prev) =>
      prev.map((col) =>
        col.id === columnId ? { ...col, tasks: [...col.tasks, newTask] } : col
      )
    );

    setText("");
    setAdding(false);
  };

  return adding ? (
    <form onSubmit={handleSubmit} className="mt-2">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        autoFocus
        placeholder="Add new task..."
        className="w-full rounded border border-violet-400 bg-violet-400/20 p-2 text-sm text-neutral-50 placeholder-violet-300 focus:outline-0"
      />
      <div className="mt-1.5 flex justify-end gap-1.5">
        <button
          type="button"
          onClick={() => setAdding(false)}
          className="text-xs text-neutral-400 hover:text-neutral-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="rounded bg-violet-500 px-2 py-1 text-xs text-white hover:bg-violet-600"
        >
          Add
        </button>
      </div>
    </form>
  ) : (
    <button
      type="button"
      onClick={() => setAdding(true)}
      className="mt-2 w-full text-left text-xs text-neutral-400 hover:text-neutral-50"
    >
      + Add task
    </button>
  );
};
