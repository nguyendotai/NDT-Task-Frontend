"use client";

import { useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { MoreHorizontalIcon, PlusIcon } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { getApiErrorMessage } from "@/shared/utils/api-error";
import {
  useDeleteColumnMutation,
  type WorkspaceColumn,
  type WorkspaceMember,
} from "@/features/workspace";
import type { Task } from "@/features/task";
import { BoardTaskCard } from "./board-task-card";
import { ColumnFormDialog } from "./column-form-dialog";

function getColumnDotClass(isDoneColumn: WorkspaceColumn["isDoneColumn"]) {
  return isDoneColumn ? "bg-green-500" : "bg-muted-foreground/40";
}

export function BoardColumn({
  workspaceId,
  column,
  tasks,
  members,
  onAddTask,
  onTaskClick,
}: {
  workspaceId: string;
  column: WorkspaceColumn;
  tasks: Task[];
  members: WorkspaceMember[];
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

  const [isEditing, setEditing] = useState(false);
  const [deleteColumn] = useDeleteColumnMutation();

  const taskIds = tasks.map((task) => task.id);

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
          <span
            className={`size-2 shrink-0 rounded-full ${getColumnDotClass(column.isDoneColumn)}`}
          />
          <p className="truncate text-sm font-semibold text-foreground">{column.name}</p>
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
            <DropdownMenuItem onClick={() => setEditing(true)}>Edit</DropdownMenuItem>
            <DropdownMenuItem variant="destructive" onClick={handleDelete}>
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

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
              workspaceId={workspaceId}
              members={members}
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

      <ColumnFormDialog
        workspaceId={workspaceId}
        open={isEditing}
        onOpenChange={setEditing}
        column={column}
      />
    </div>
  );
}
