"use client";

import { StarIcon } from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { useStarTaskMutation, useUnstarTaskMutation, type Task } from "@/features/task";

const PRIORITY_LABEL: Record<Task["priority"], string> = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
};

export function TaskListItem({ task }: { task: Task }) {
  const [star] = useStarTaskMutation();
  const [unstar] = useUnstarTaskMutation();

  return (
    <div className="flex items-center gap-3 rounded-xl border border-border/60 bg-card px-4 py-3">
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-foreground">{task.title}</p>
        <p className="truncate text-xs text-muted-foreground">{task.workspaceName}</p>
      </div>
      <Badge variant="outline" className="hidden sm:inline-flex">
        {PRIORITY_LABEL[task.priority]}
      </Badge>
      <Badge variant="secondary">{task.status}</Badge>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        aria-label={task.isStarred ? "Unstar" : "Star"}
        onClick={() => (task.isStarred ? unstar(task.id) : star(task.id))}
      >
        <StarIcon
          className={
            task.isStarred ? "size-4 fill-yellow-400 text-yellow-400" : "size-4"
          }
        />
      </Button>
    </div>
  );
}
