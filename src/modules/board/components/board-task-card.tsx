"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { CalendarIcon } from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";
import { getInitials } from "@/shared/utils/initials";
import { PRIORITY_BADGE_CLASS, PRIORITY_LABEL, type Task } from "@/features/task";

function formatShortDate(value: string) {
  return new Date(value).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

export function BoardTaskCard({
  task,
  assigneeNames,
  onClick,
}: {
  task: Task;
  assigneeNames?: string[];
  onClick: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: task.id, data: { type: "task", task } });

  return (
    <button
      type="button"
      ref={setNodeRef}
      onClick={onClick}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={
        "flex w-full flex-col gap-2 rounded-2xl border border-border/60 bg-card p-3 text-left shadow-sm transition-opacity " +
        (isDragging ? "opacity-40" : "opacity-100")
      }
      {...listeners}
      {...attributes}
    >
      <p className="text-sm font-medium text-foreground">{task.title}</p>
      <div className="flex flex-wrap items-center gap-1.5">
        <Badge className={PRIORITY_BADGE_CLASS[task.priority]} variant="outline">
          {PRIORITY_LABEL[task.priority]}
        </Badge>
        {task.dueDate ? (
          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
            <CalendarIcon className="size-3" />
            {formatShortDate(task.dueDate)}
          </span>
        ) : null}
      </div>
      {assigneeNames && assigneeNames.length > 0 ? (
        <div className="flex -space-x-2">
          {assigneeNames.slice(0, 3).map((name) => (
            <span
              key={name}
              title={name}
              className="flex size-5 items-center justify-center rounded-full border-2 border-card bg-secondary text-[10px] font-semibold text-secondary-foreground"
            >
              {getInitials(name)}
            </span>
          ))}
          {assigneeNames.length > 3 ? (
            <span className="flex size-5 items-center justify-center rounded-full border-2 border-card bg-muted text-[10px] font-semibold text-muted-foreground">
              +{assigneeNames.length - 3}
            </span>
          ) : null}
        </div>
      ) : null}
    </button>
  );
}
