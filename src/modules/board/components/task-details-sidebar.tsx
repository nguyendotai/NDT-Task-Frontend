"use client";

import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import type { Task, TaskPriority } from "@/features/task";
import type { WorkspaceColumn, WorkspaceMember } from "@/features/workspace";
import { AssigneeMultiSelect } from "./assignee-multi-select";

export interface TaskDetailsPatch {
  columnId?: string;
  assigneeIds?: string[];
  priority?: TaskPriority;
  startDate?: string;
  dueDate?: string;
  storyPoints?: number;
}

function formatDateTime(value: string): string {
  return new Date(value).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export function TaskDetailsSidebar({
  task,
  columns,
  members,
  memberNameById,
  onChange,
}: {
  task: Task;
  columns: WorkspaceColumn[];
  members: WorkspaceMember[];
  memberNameById: Map<string, string>;
  onChange: (patch: TaskDetailsPatch) => void;
}) {
  const reporterName = memberNameById.get(task.createdBy) ?? "Unknown";

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label>Status</Label>
        <Select<string>
          value={task.columnId}
          onValueChange={(value) => value && onChange({ columnId: value })}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select column" />
          </SelectTrigger>
          <SelectContent>
            {columns.map((column) => (
              <SelectItem key={column.id} value={column.id}>
                {column.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-xl border border-border/60 p-3">
        <p className="mb-3 text-sm font-semibold text-foreground">Details</p>
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs text-muted-foreground">Assignee</Label>
            <AssigneeMultiSelect
              members={members}
              selectedIds={task.assigneeIds}
              onChange={(assigneeIds) => onChange({ assigneeIds })}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label className="text-xs text-muted-foreground">Reporter</Label>
            <p className="text-sm text-foreground">{reporterName}</p>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="task-detail-start" className="text-xs text-muted-foreground">
              Start date
            </Label>
            <Input
              id="task-detail-start"
              type="date"
              defaultValue={task.startDate?.slice(0, 10) ?? ""}
              onBlur={(event) => {
                if (event.target.value) onChange({ startDate: event.target.value });
              }}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="task-detail-due" className="text-xs text-muted-foreground">
              Due date
            </Label>
            <Input
              id="task-detail-due"
              type="date"
              defaultValue={task.dueDate?.slice(0, 10) ?? ""}
              onBlur={(event) => {
                if (event.target.value) onChange({ dueDate: event.target.value });
              }}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="task-detail-points" className="text-xs text-muted-foreground">
              Story points
            </Label>
            <Input
              id="task-detail-points"
              type="number"
              min={0}
              defaultValue={task.storyPoints ?? ""}
              onBlur={(event) => {
                const value = Number(event.target.value);
                if (event.target.value !== "" && Number.isFinite(value)) {
                  onChange({ storyPoints: value });
                }
              }}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label className="text-xs text-muted-foreground">Priority</Label>
            <Select<string>
              value={task.priority}
              onValueChange={(value) =>
                value && onChange({ priority: value as TaskPriority })
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="LOW">Low</SelectItem>
                <SelectItem value="MEDIUM">Medium</SelectItem>
                <SelectItem value="HIGH">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="text-xs text-muted-foreground">
        <p>Created {formatDateTime(task.createdAt)}</p>
        <p>Updated {formatDateTime(task.updatedAt)}</p>
      </div>
    </div>
  );
}
