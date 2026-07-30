"use client";

import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { getApiErrorMessage } from "@/shared/utils/api-error";
import {
  PRIORITY_BADGE_CLASS,
  PRIORITY_LABEL,
  useListTasksByWorkspaceQuery,
} from "@/features/task";
import type { WorkspaceColumn } from "@/features/workspace";
import {
  useAddSprintTaskMutation,
  useRemoveSprintTaskMutation,
  type Sprint,
} from "@/features/sprint";

interface SprintTaskListProps {
  workspaceId: string;
  sprintId: string;
  columns: WorkspaceColumn[];
  canManage: boolean;
  removable: boolean;
  // Nếu có: cho phép chọn 1 Sprint Planned để thêm Task đang xem (dùng cho
  // Product Backlog) — bỏ trống = không hiện lựa chọn này.
  addToSprintOptions?: Sprint[];
}

export function SprintTaskList({
  workspaceId,
  sprintId,
  columns,
  canManage,
  removable,
  addToSprintOptions,
}: SprintTaskListProps) {
  const { data: tasks, isLoading } = useListTasksByWorkspaceQuery({
    workspaceId,
    sprintId,
  });
  const [removeSprintTask] = useRemoveSprintTaskMutation();
  const [addSprintTask] = useAddSprintTaskMutation();

  const columnNameById = new Map(
    columns.map((column) => [column.id, column.name]),
  );

  const handleRemove = async (taskId: string) => {
    try {
      await removeSprintTask({ sprintId, taskId }).unwrap();
    } catch (error) {
      window.alert(getApiErrorMessage(error as never));
    }
  };

  const handleAddToSprint = async (taskId: string, targetSprintId: string) => {
    try {
      await addSprintTask({ sprintId: targetSprintId, taskId }).unwrap();
    } catch (error) {
      window.alert(getApiErrorMessage(error as never));
    }
  };

  if (isLoading) {
    return <div className="h-16 animate-pulse rounded-xl bg-muted/50" />;
  }

  if (!tasks || tasks.length === 0) {
    return <p className="text-sm text-muted-foreground">No tasks.</p>;
  }

  return (
    <div className="flex flex-col gap-2">
      {tasks.map((task) => (
        <div
          key={task.id}
          className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-border/60 bg-background/50 px-3 py-2"
        >
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-foreground">
              {task.title}
            </p>
            <div className="mt-1 flex flex-wrap items-center gap-1.5">
              <Badge className={PRIORITY_BADGE_CLASS[task.priority]} variant="outline">
                {PRIORITY_LABEL[task.priority]}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {columnNameById.get(task.columnId) ?? task.status}
              </span>
            </div>
          </div>

          {removable && canManage ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => handleRemove(task.id)}
            >
              Remove
            </Button>
          ) : null}

          {addToSprintOptions && canManage ? (
            addToSprintOptions.length > 0 ? (
              <Select<string>
                onValueChange={(value) => {
                  if (value) handleAddToSprint(task.id, value);
                }}
              >
                <SelectTrigger className="w-44">
                  <SelectValue placeholder="Add to sprint" />
                </SelectTrigger>
                <SelectContent>
                  {addToSprintOptions.map((sprint) => (
                    <SelectItem key={sprint.id} value={sprint.id}>
                      {sprint.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <span className="text-xs text-muted-foreground">
                No Planned Sprint
              </span>
            )
          ) : null}
        </div>
      ))}
    </div>
  );
}
