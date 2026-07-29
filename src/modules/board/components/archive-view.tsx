"use client";

import { ArchiveRestoreIcon } from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { useListArchivedTasksQuery, useRestoreTaskMutation } from "@/features/task";

export function ArchiveView({ workspaceId }: { workspaceId: string }) {
  const { data: tasks, isLoading, isError } = useListArchivedTasksQuery(workspaceId);
  const [restoreTask, { isLoading: isRestoring }] = useRestoreTaskMutation();

  if (isLoading) {
    return (
      <div className="flex flex-col gap-2">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="h-14 animate-pulse rounded-xl bg-muted/50" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <p className="rounded-2xl border border-dashed border-border/60 p-8 text-center text-sm text-muted-foreground">
        Only Owner/Admin can view archived tasks.
      </p>
    );
  }

  if (!tasks || tasks.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-border/60 p-8 text-center text-sm text-muted-foreground">
        No archived tasks.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {tasks.map((task) => (
        <div
          key={task.id}
          className="flex items-center gap-3 rounded-xl border border-border/60 bg-card px-4 py-3"
        >
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-foreground">{task.title}</p>
            <p className="text-xs text-muted-foreground">{task.workspaceName}</p>
          </div>
          <Badge variant="secondary">{task.status}</Badge>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="gap-1.5"
            disabled={isRestoring}
            onClick={() => restoreTask(task.id)}
          >
            <ArchiveRestoreIcon className="size-3.5" />
            Restore
          </Button>
        </div>
      ))}
    </div>
  );
}
