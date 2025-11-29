"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";

import { Plus } from "lucide-react";
import { TodoCard } from "@/components/layout/TodoCard";
import { TodoItem } from "@/components/layout/TodoItem";

type Todo = {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
};

const initialTodos: Todo[] = [
  {
    id: "1",
    title: "Design homepage UI",
    completed: true,
    createdAt: new Date(),
  },
  {
    id: "2",
    title: "Write API documentation",
    completed: false,
    createdAt: new Date(),
  },
  {
    id: "3",
    title: "Review pull request #45",
    completed: false,
    createdAt: new Date(),
  },
];

export function TodoList() {
  const [todos, setTodos] = useState<Todo[]>(initialTodos);
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const filteredTodos = useMemo(() => {
    if (filter === "active") return todos.filter((t) => !t.completed);
    if (filter === "completed") return todos.filter((t) => t.completed);
    return todos;
  }, [todos, filter]);

  const completedCount = todos.filter((t) => t.completed).length;

  const handleAddTodo = (title: string, completed: boolean) => {
    setTodos([
      { id: Date.now().toString(), title, completed, createdAt: new Date() },
      ...todos,
    ]);
    setIsAdding(false);
  };

  const handleEditTodo = (id: string, title: string, completed: boolean) => {
    setTodos(todos.map((t) => (t.id === id ? { ...t, title, completed } : t)));
    setEditingId(null);
  };

  const handleDeleteTodo = (id: string) => {
    setTodos(todos.filter((t) => t.id !== id));
    if (editingId === id) setEditingId(null);
  };

  const handleToggleTodo = (id: string, completed: boolean) => {
    setTodos(todos.map((t) => (t.id === id ? { ...t, completed } : t)));
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-5 py-6 md:py-2 relative">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-2xl font-bold text-foreground">My Tasks</h2>
        {!isAdding && (
          <Button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 bg-primary text-primary-foreground hover:opacity-90"
          >
            <Plus className="h-4 w-4" />
            Add Task
          </Button>
        )}
      </div>

      {/* Stats */}
      <div className="px-4 py-3 rounded-lg text-sm bg-muted text-muted-foreground">
        {completedCount} of {todos.length} tasks done
        {todos.length > 0 && (
          <span className="ml-2">
            ({Math.round((completedCount / todos.length) * 100)}%)
          </span>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-1 rtl:space-x-reverse overflow-x-auto pb-1">
        {(["all", "active", "completed"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 text-sm font-medium rounded-md whitespace-nowrap transition-colors ${
              filter === f
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Forms */}
      {isAdding && (
        <div className="animate-in fade-in slide-in-from-top-2">
          <TodoCard
            onSave={handleAddTodo}
            onCancel={() => setIsAdding(false)}
          />
        </div>
      )}

      {editingId && (
        <div className="animate-in fade-in slide-in-from-top-2">
          <TodoCard
            initialTitle={todos.find((t) => t.id === editingId)?.title || ""}
            initialCompleted={
              todos.find((t) => t.id === editingId)?.completed || false
            }
            onSave={(title, completed) =>
              handleEditTodo(editingId, title, completed)
            }
            onCancel={() => setEditingId(null)}
          />
        </div>
      )}

      {/* Todos */}
      <div className="space-y-3">
        {filteredTodos.length === 0 ? (
          <div className="text-center py-10 rounded-lg border border-dashed border-border text-muted-foreground">
            {filter === "completed"
              ? "No completed tasks yet 🎉"
              : filter === "active"
              ? "All tasks are done! 🏁"
              : "No tasks yet — add one to get started!"}
          </div>
        ) : (
          filteredTodos.map((todo) => (
            <TodoItem
              key={todo.id}
              {...todo}
              onToggle={handleToggleTodo}
              onEdit={() => setEditingId(todo.id)}
              onDelete={handleDeleteTodo}
            />
          ))
        )}
      </div>
    </div>
  );
}
