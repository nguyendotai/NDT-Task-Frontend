"use client";

import { useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { MoreHorizontalIcon, PlusIcon } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { getApiErrorMessage } from "@/shared/utils/api-error";
import {
  useDeleteColumnMutation,
  useRenameColumnMutation,
  type WorkspaceColumn,
} from "@/features/workspace";
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
  const { setNodeRef: setDroppableRef, isOver } = useDroppable({ id: column.id });
  const {
    attributes,
    listeners,
    setNodeRef: setSortableRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: column.id, data: { type: "column", column } });

  const [isRenaming, setRenaming] = useState(false);
  const [name, setName] = useState(column.name);
  const [error, setError] = useState<string | null>(null);
  const [renameColumn, { isLoading: isSaving }] = useRenameColumnMutation();
  const [deleteColumn] = useDeleteColumnMutation();

  const taskIds = tasks.map((task) => task.id);

  const submitRename = async () => {
    const trimmed = name.trim();
    if (!trimmed || trimmed === column.name) {
      setRenaming(false);
      setName(column.name);
      return;
    }
    setError(null);
    try {
      await renameColumn({ id: column.id, name: trimmed }).unwrap();
      setRenaming(false);
    } catch (err) {
      setError(getApiErrorMessage(err as never));
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Delete column "${column.name}"?`)) return;
    try {
      await deleteColumn(column.id).unwrap();
    } catch (err) {
      window.alert(getApiErrorMessage(err as never));
    }
  };

  return (
    <div
      ref={setSortableRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={
        "flex h-[calc(100vh-22rem)] min-h-[560px] w-72 shrink-0 flex-col gap-3 rounded-2xl border border-border/60 bg-muted/30 p-3 transition-opacity " +
        (isDragging ? "opacity-40" : "opacity-100")
      }
    >
      <div className="flex items-center gap-1.5 px-1">
        <div
          className="flex min-w-0 flex-1 cursor-grab items-center gap-2 active:cursor-grabbing"
          {...listeners}
          {...attributes}
        >
          <span className={`size-2 shrink-0 rounded-full ${getColumnDotClass(column.name)}`} />
          {isRenaming ? (
            <Input
              autoFocus
              value={name}
              onChange={(event) => setName(event.target.value)}
              onBlur={submitRename}
              onKeyDown={(event) => {
                if (event.key === "Enter") submitRename();
                if (event.key === "Escape") {
                  setName(column.name);
                  setRenaming(false);
                }
              }}
              onPointerDown={(event) => event.stopPropagation()}
              disabled={isSaving}
              className="h-7 text-sm"
            />
          ) : (
            <p className="truncate text-sm font-semibold text-foreground">{column.name}</p>
          )}
        </div>
        <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
          {tasks.length}
        </span>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button type="button" variant="ghost" size="icon-sm" className="shrink-0">
                <MoreHorizontalIcon className="size-3.5" />
              </Button>
            }
          />
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setRenaming(true)}>Rename</DropdownMenuItem>
            <DropdownMenuItem variant="destructive" onClick={handleDelete}>
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {error ? <p className="px-1 text-xs text-destructive">{error}</p> : null}

      <div
        ref={setDroppableRef}
        className={
          "flex min-h-24 flex-1 flex-col gap-2 overflow-y-auto rounded-xl transition-colors " +
          (isOver ? "bg-primary/5 ring-2 ring-primary/30" : "")
        }
      >
        <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <BoardTaskCard
              key={task.id}
              task={task}
              assigneeName={task.assigneeId ? assigneeNameById.get(task.assigneeId) : undefined}
              onClick={() => onTaskClick(task)}
            />
          ))}
        </SortableContext>
        {tasks.length === 0 ? (
          <p className="px-1 py-2 text-center text-xs text-muted-foreground">No tasks</p>
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
