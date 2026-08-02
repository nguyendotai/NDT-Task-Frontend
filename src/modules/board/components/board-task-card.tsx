"use client";

import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { CalendarIcon, MoreHorizontalIcon } from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { getApiErrorMessage } from "@/shared/utils/api-error";
import {
  PRIORITY_BADGE_CLASS,
  PRIORITY_LABEL,
  TYPE_BADGE_CLASS,
  TYPE_LABEL,
  getTaskKey,
  useDeleteTaskMutation,
  useUpdateTaskMutation,
  type Task,
} from "@/features/task";
import type { WorkspaceColumn, WorkspaceMember } from "@/features/workspace";
import { AssigneeMultiSelect } from "./assignee-multi-select";

function formatShortDate(value: string) {
  return new Date(value).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

export function BoardTaskCard({
  task,
  workspaceId,
  columns,
  members,
  onClick,
}: {
  task: Task;
  workspaceId: string;
  columns: WorkspaceColumn[];
  members: WorkspaceMember[];
  onClick: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: task.id, data: { type: "task", task } });
  const [updateTask] = useUpdateTaskMutation();
  const [deleteTask] = useDeleteTaskMutation();
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [copiedField, setCopiedField] = useState<"key" | "link" | null>(null);

  const handleAssigneeChange = async (assigneeIds: string[]) => {
    try {
      await updateTask({ id: task.id, workspaceId, assigneeIds }).unwrap();
    } catch (error) {
      window.alert(getApiErrorMessage(error as never));
    }
  };

  const handleStatusChange = async (columnId: string) => {
    if (columnId === task.columnId) return;
    try {
      await updateTask({ id: task.id, workspaceId, columnId }).unwrap();
    } catch (error) {
      window.alert(getApiErrorMessage(error as never));
    }
  };

  const copyToClipboard = async (field: "key" | "link", value: string) => {
    await navigator.clipboard.writeText(value);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 1500);
  };

  const handleDelete = async () => {
    if (!window.confirm(`Delete task "${task.title}"?`)) return;
    try {
      await deleteTask(task.id).unwrap();
    } catch (error) {
      window.alert(getApiErrorMessage(error as never));
    }
  };

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      onClick={onClick}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onClick();
        }
      }}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={
        "group relative flex w-full cursor-pointer flex-col gap-2 rounded-2xl border border-border/60 bg-card p-3 text-left shadow-sm transition-opacity " +
        (isDragging ? "opacity-40" : "opacity-100")
      }
    >
      <div className="absolute top-2 right-2" onClick={(event) => event.stopPropagation()}>
        <DropdownMenu onOpenChange={setMenuOpen}>
          <DropdownMenuTrigger
            render={
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                nativeButton={false}
                className={
                  "transition-opacity " +
                  (isMenuOpen ? "opacity-100" : "opacity-0 group-hover:opacity-100")
                }
              >
                <MoreHorizontalIcon className="size-3.5" />
              </Button>
            }
          />
          <DropdownMenuContent align="end">
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>Change status</DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                {columns.map((column) => (
                  <DropdownMenuItem key={column.id} onClick={() => handleStatusChange(column.id)}>
                    {column.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            <DropdownMenuItem onClick={() => copyToClipboard("key", getTaskKey(task))}>
              {copiedField === "key" ? "Copied!" : "Copy key"}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                copyToClipboard(
                  "link",
                  `${window.location.origin}/workspaces/${workspaceId}?taskId=${task.id}`,
                )
              }
            >
              {copiedField === "link" ? "Copied!" : "Copy link"}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onClick}>Edit labels</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" onClick={handleDelete}>
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <p className="pr-6 text-sm font-medium text-foreground">{task.title}</p>
      <div className="flex flex-wrap items-center gap-1.5">
        <Badge className={PRIORITY_BADGE_CLASS[task.priority]} variant="outline">
          {PRIORITY_LABEL[task.priority]}
        </Badge>
        <Badge className={TYPE_BADGE_CLASS[task.type]} variant="outline">
          {TYPE_LABEL[task.type]}
        </Badge>
        <span className="text-xs text-muted-foreground">{getTaskKey(task)}</span>
        {task.dueDate ? (
          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
            <CalendarIcon className="size-3" />
            {formatShortDate(task.dueDate)}
          </span>
        ) : null}
      </div>
      <AssigneeMultiSelect
        members={members}
        selectedIds={task.assigneeIds}
        onChange={handleAssigneeChange}
        compact
      />
    </div>
  );
}
