"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { CircleCheckBig, Circle } from "lucide-react";
import { CustomSwitch } from "./CustomSwitch";

interface TodoCardProps {
  initialTitle?: string;
  initialCompleted?: boolean;
  onSave?: (title: string, completed: boolean) => void;
  onCancel?: () => void;
}

export function TodoCard({
  initialTitle = "",
  initialCompleted = false,
  onSave,
  onCancel,
}: TodoCardProps) {
  const [title, setTitle] = useState(initialTitle);
  const [completed, setCompleted] = useState(initialCompleted);

  return (
    <div className="w-full max-w-lg mx-auto p-5 rounded-xl border bg-card text-card-foreground border-border shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg font-semibold text-foreground">
          {initialTitle ? "Edit Task" : "New Task"}
        </h3>
        <span
          className={`text-xs px-2 py-1 rounded-full ${
            completed
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground"
          }`}
        >
          {completed ? (
            <span className="flex items-center gap-1">
              <CircleCheckBig className="h-3 w-3" />
              Done
            </span>
          ) : (
            <span className="flex items-center gap-1">
              <Circle className="h-3 w-3" />
              Pending
            </span>
          )}
        </span>
      </div>

      {/* Title */}
      <div className="space-y-2 mb-5">
        <Label
          htmlFor="todo-title"
          className="text-sm font-medium text-foreground"
        >
          Task Title
        </Label>
        <Input
          id="todo-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Review design mockups"
          className="bg-input border-border text-foreground"
        />
      </div>

      {/* Completed */}
      <div className="flex items-center justify-between py-3 border-y border-border mb-5">
        <Label
          htmlFor="todo-completed"
          className="text-sm font-medium text-foreground"
        >
          Mark as completed
        </Label>
        <CustomSwitch
          id="todo-completed"
          checked={completed}
          onCheckedChange={setCompleted}
        />
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onCancel}
          className="border-border text-foreground hover:bg-muted"
        >
          Cancel
        </Button>
        <Button
          type="button"
          size="sm"
          onClick={() => onSave?.(title.trim(), completed)}
          disabled={!title.trim()}
          className="bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-60"
        >
          {initialTitle ? "Update" : "Add"} Task
        </Button>
      </div>
    </div>
  );
}
