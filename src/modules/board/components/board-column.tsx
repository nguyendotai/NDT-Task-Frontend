"use client";

import { useDroppable } from "@dnd-kit/core";
import { PlusIcon } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import type { WorkspaceColumn } from "@/features/workspace";
import type { Task } from "@/features/task";
import { BoardTaskCard } from "./board-task-card";

const COLUMN_DOT_CLASS: Record<string, string> = {
  "to do": "bg-blue-400",
  "in progress": "bg-amber-500",
  done: "bg-green-500",
};

function getColumnDotClass(name: string) {
  return COLUMN_DOT_CLASS[name.trim().toLowerCase()] ?? "bg-primary";
}

export function BoardColumn({
  column,
  tasks,
  assigneeNameById,
  onAddTask,
  onTaskClick,
}: {
  column: WorkspaceColumn;
  tasks: Task[];
  assigneeNameById: Map<string, string>;
  onAddTask: () => void;
  onTaskClick: (task: Task) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id });

  return (
    <div className="flex h-[calc(100vh-22rem)] min-h-[560px] w-72 shrink-0 flex-col gap-3 rounded-2xl border border-border/60 bg-muted/30 p-3">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <span className={`size-2 rounded-full ${getColumnDotClass(column.name)}`} />
          <p className="text-sm font-semibold text-foreground">{column.name}</p>
        </div>
        <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
          {tasks.length}
        </span>
      </div>

      <div
        ref={setNodeRef}
        className={
          "flex min-h-24 flex-1 flex-col gap-2 overflow-y-auto rounded-xl transition-colors " +
          (isOver ? "bg-primary/5 ring-2 ring-primary/30" : "")
        }
      >
        {tasks.map((task) => (
          <BoardTaskCard
            key={task.id}
            task={task}
            assigneeName={task.assigneeId ? assigneeNameById.get(task.assigneeId) : undefined}
            onClick={() => onTaskClick(task)}
          />
        ))}
        {tasks.length === 0 ? (
          <p className="px-1 py-2 text-center text-xs text-muted-foreground">
            No tasks
          </p>
        ) : null}
      </div>

      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="justify-start gap-1.5 text-muted-foreground"
        onClick={onAddTask}
      >
        <PlusIcon className="size-3.5" />
        Add task
      </Button>
    </div>
  );
}
