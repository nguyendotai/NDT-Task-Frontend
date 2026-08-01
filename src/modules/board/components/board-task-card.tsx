"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { CalendarIcon } from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";
import { getApiErrorMessage } from "@/shared/utils/api-error";
import {
  PRIORITY_BADGE_CLASS,
  PRIORITY_LABEL,
  TYPE_BADGE_CLASS,
  TYPE_LABEL,
  getTaskKey,
  useUpdateTaskMutation,
  type Task,
} from "@/features/task";
import type { WorkspaceMember } from "@/features/workspace";
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
  members,
  onClick,
}: {
  task: Task;
  workspaceId: string;
  members: WorkspaceMember[];
  onClick: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: task.id, data: { type: "task", task } });
  const [updateTask] = useUpdateTaskMutation();

  const handleAssigneeChange = async (assigneeIds: string[]) => {
    try {
      await updateTask({ id: task.id, workspaceId, assigneeIds }).unwrap();
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
        "flex w-full cursor-pointer flex-col gap-2 rounded-2xl border border-border/60 bg-card p-3 text-left shadow-sm transition-opacity " +
        (isDragging ? "opacity-40" : "opacity-100")
      }
    >
      <p className="text-sm font-medium text-foreground">{task.title}</p>
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
