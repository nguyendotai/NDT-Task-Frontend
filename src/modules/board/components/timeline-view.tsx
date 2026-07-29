"use client";

import { useMemo } from "react";
import { useListTasksByWorkspaceQuery, type TaskPriority } from "@/features/task";

const MS_PER_DAY = 24 * 60 * 60 * 1000;

const PRIORITY_BAR_CLASS: Record<TaskPriority, string> = {
  LOW: "bg-blue-400",
  MEDIUM: "bg-amber-500",
  HIGH: "bg-destructive",
};

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function TimelineView({ workspaceId }: { workspaceId: string }) {
  const { data: tasks, isLoading } = useListTasksByWorkspaceQuery({ workspaceId });

  const scheduled = useMemo(
    () => (tasks ?? []).filter((task) => task.startDate || task.dueDate),
    [tasks],
  );

  const range = useMemo(() => {
    if (scheduled.length === 0) return null;
    let min = Infinity;
    let max = -Infinity;
    for (const task of scheduled) {
      const start = startOfDay(new Date(task.startDate ?? task.dueDate!)).getTime();
      const end = startOfDay(new Date(task.dueDate ?? task.startDate!)).getTime();
      min = Math.min(min, start);
      max = Math.max(max, end);
    }
    const totalDays = Math.max(1, Math.round((max - min) / MS_PER_DAY) + 1);
    return { min, max, totalDays };
  }, [scheduled]);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="h-10 animate-pulse rounded-lg bg-muted/50" />
        ))}
      </div>
    );
  }

  if (!range || scheduled.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-border/60 p-8 text-center text-sm text-muted-foreground">
        No task has a start date or due date yet.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{new Date(range.min).toLocaleDateString()}</span>
        <span>{new Date(range.max).toLocaleDateString()}</span>
      </div>
      <div className="flex flex-col gap-2">
        {scheduled.map((task) => {
          const start = startOfDay(new Date(task.startDate ?? task.dueDate!)).getTime();
          const end = startOfDay(new Date(task.dueDate ?? task.startDate!)).getTime();
          const offsetDays = Math.round((start - range.min) / MS_PER_DAY);
          const durationDays = Math.max(1, Math.round((end - start) / MS_PER_DAY) + 1);
          const leftPct = (offsetDays / range.totalDays) * 100;
          const widthPct = (durationDays / range.totalDays) * 100;

          return (
            <div key={task.id} className="flex items-center gap-3">
              <p className="w-40 shrink-0 truncate text-sm text-foreground">{task.title}</p>
              <div className="relative h-6 flex-1 rounded-full bg-muted/50">
                <div
                  className={
                    "absolute top-0 h-6 rounded-full " + PRIORITY_BAR_CLASS[task.priority]
                  }
                  style={{ left: `${leftPct}%`, width: `${Math.max(widthPct, 3)}%` }}
                  title={`${task.startDate ? new Date(task.startDate).toLocaleDateString() : "?"} → ${
                    task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "?"
                  }`}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
