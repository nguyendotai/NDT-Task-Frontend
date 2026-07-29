"use client";

import { useMemo, useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { useListTasksByWorkspaceQuery, type Task } from "@/features/task";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function dateKey(date: Date) {
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
}

export function CalendarView({ workspaceId }: { workspaceId: string }) {
  const { data: tasks, isLoading } = useListTasksByWorkspaceQuery({ workspaceId });
  const [cursor, setCursor] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  const tasksByDay = useMemo(() => {
    const map = new Map<string, Task[]>();
    for (const task of tasks ?? []) {
      if (!task.dueDate) continue;
      const key = dateKey(new Date(task.dueDate));
      const list = map.get(key) ?? [];
      list.push(task);
      map.set(key, list);
    }
    return map;
  }, [tasks]);

  const cells = useMemo(() => {
    const firstDayOfMonth = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
    const startOffset = firstDayOfMonth.getDay();
    const gridStart = new Date(firstDayOfMonth);
    gridStart.setDate(gridStart.getDate() - startOffset);

    return Array.from({ length: 42 }).map((_, index) => {
      const date = new Date(gridStart);
      date.setDate(date.getDate() + index);
      return date;
    });
  }, [cursor]);

  if (isLoading) {
    return <div className="h-96 animate-pulse rounded-2xl bg-muted/50" />;
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-foreground">
          {cursor.toLocaleDateString(undefined, { month: "long", year: "numeric" })}
        </p>
        <div className="flex gap-1">
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))}
          >
            <ChevronLeftIcon />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))}
          >
            <ChevronRightIcon />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1.5 text-center text-xs font-medium text-muted-foreground">
        {WEEKDAYS.map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1.5">
        {cells.map((date) => {
          const isCurrentMonth = date.getMonth() === cursor.getMonth();
          const dayTasks = tasksByDay.get(dateKey(date)) ?? [];
          return (
            <div
              key={date.toISOString()}
              className={
                "flex min-h-20 flex-col gap-1 rounded-lg border border-border/60 p-1.5 text-left " +
                (isCurrentMonth ? "bg-card" : "bg-muted/20 text-muted-foreground")
              }
            >
              <span className="text-xs font-medium">{date.getDate()}</span>
              {dayTasks.slice(0, 2).map((task) => (
                <span
                  key={task.id}
                  className="truncate rounded bg-primary/10 px-1 py-0.5 text-[10px] text-primary"
                  title={task.title}
                >
                  {task.title}
                </span>
              ))}
              {dayTasks.length > 2 ? (
                <span className="text-[10px] text-muted-foreground">
                  +{dayTasks.length - 2} more
                </span>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
