import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { CustomSwitch } from "./CustomSwitch";

interface TodoItemProps {
  id: string;
  title: string;
  completed: boolean;
  onToggle: (id: string, completed: boolean) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export function TodoItem({ id, title, completed, onToggle, onEdit, onDelete }: TodoItemProps) {
  return (
    <div
      className={`group flex items-start gap-4 p-4 rounded-lg border transition-all ${
        completed
          ? "bg-muted border-border"
          : "bg-card border-border"
      }`}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3">
          <CustomSwitch
            checked={completed}
            onCheckedChange={(checked) => onToggle(id, checked)}
            aria-label={`Mark task "${title}" as ${completed ? "completed" : "incomplete"}`}
          />
          <h4
            className={`font-medium wrap-break-word ${
              completed
                ? "line-through text-muted-foreground"
                : "text-foreground"
            }`}
          >
            {title}
          </h4>
        </div>
      </div>

      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          size="icon"
          variant="ghost"
          onClick={() => onEdit(id)}
          aria-label="Edit task"
          className="h-8 w-8 text-foreground hover:bg-muted rounded-md"
        >
          <Pencil className="h-3.5 w-3.5" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          onClick={() => onDelete(id)}
          aria-label="Delete task"
          className="h-8 w-8 text-destructive hover:bg-destructive/10 rounded-md"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}