"use client";

import { useState } from "react";
import { useListMembersQuery } from "@/features/workspace";
import { selectCurrentUser } from "@/features/auth";
import { useListSprintsQuery } from "@/features/sprint";
import { useAppSelector } from "@/shared/hooks/use-app-selector";
import { getInitials } from "@/shared/utils/initials";
import { cn } from "@/shared/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { useListSearchLabelsQuery } from "../api/search.api";
import { UPDATED_PRESETS, getUpdatedRangeForPreset, type UpdatedPresetKey } from "../utils/date-presets";
import type { SearchTaskFilters } from "../types/search.types";

const NO_LABEL_VALUE = "__all__";
const NO_SPRINT_VALUE = "__all__";

interface SearchFiltersPanelProps {
  // Không có workspaceId (chế độ Global Search, xuyên nhiều Workspace) — ẩn
  // Assignee/Sprint/Label vì các mục này cần 1 danh sách theo đúng 1
  // Workspace cụ thể mới có ý nghĩa.
  workspaceId?: string;
  filters: SearchTaskFilters;
  onChange: (filters: SearchTaskFilters) => void;
}

export function SearchFiltersPanel({ workspaceId, filters, onChange }: SearchFiltersPanelProps) {
  const currentUser = useAppSelector(selectCurrentUser);
  const { data: members } = useListMembersQuery(workspaceId ?? "", { skip: !workspaceId });
  const { data: labels } = useListSearchLabelsQuery(workspaceId ?? "", { skip: !workspaceId });
  const { data: sprints } = useListSprintsQuery(workspaceId ?? "", { skip: !workspaceId });
  const [activePreset, setActivePreset] = useState<UpdatedPresetKey>("any");

  const toggleAssignee = (userId: string) => {
    onChange({ ...filters, assigneeId: filters.assigneeId === userId ? undefined : userId });
  };

  const setDone = (value: boolean | undefined) => {
    onChange({ ...filters, done: filters.done === value ? undefined : value });
  };

  const toggleReporterIsMe = () => {
    if (!currentUser) return;
    onChange({
      ...filters,
      reporterId: filters.reporterId === currentUser.id ? undefined : currentUser.id,
    });
  };

  const selectPreset = (preset: UpdatedPresetKey) => {
    setActivePreset(preset);
    const { updatedFrom, updatedTo } = getUpdatedRangeForPreset(preset);
    onChange({ ...filters, updatedFrom, updatedTo });
  };

  return (
    <div className="flex w-56 shrink-0 flex-col gap-4 overflow-y-auto border-l border-border/60 p-3">
      <div>
        <p className="mb-1.5 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          Last updated
        </p>
        <div className="flex flex-wrap gap-1.5">
          {UPDATED_PRESETS.map((preset) => (
            <button
              key={preset.key}
              type="button"
              onClick={() => selectPreset(preset.key)}
              className={cn(
                "rounded-full px-2 py-1 text-xs font-medium transition-colors",
                activePreset === preset.key
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/70",
              )}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {workspaceId && sprints && sprints.length > 0 ? (
        <div>
          <p className="mb-1.5 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            Sprint
          </p>
          <Select
            value={filters.sprintId ?? NO_SPRINT_VALUE}
            onValueChange={(value) =>
              onChange({ ...filters, sprintId: !value || value === NO_SPRINT_VALUE ? undefined : value })
            }
          >
            <SelectTrigger size="sm" className="w-full">
              <SelectValue placeholder="Any sprint" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={NO_SPRINT_VALUE}>Any sprint</SelectItem>
              {sprints.map((sprint) => (
                <SelectItem key={sprint.id} value={sprint.id}>
                  {sprint.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ) : null}

      {workspaceId ? (
        <div>
          <p className="mb-1.5 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            Assignee
          </p>
          <div className="flex flex-wrap gap-1.5">
            {members?.map((member) => (
              <button
                key={member.id}
                type="button"
                title={member.user.name}
                onClick={() => toggleAssignee(member.user.id)}
                className={cn(
                  "flex size-7 items-center justify-center overflow-hidden rounded-full text-xs font-medium ring-2 ring-offset-1 ring-offset-background transition-all",
                  filters.assigneeId === member.user.id
                    ? "bg-primary text-primary-foreground ring-primary"
                    : "bg-secondary text-secondary-foreground ring-transparent hover:ring-border",
                )}
              >
                {member.user.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element -- avatar Cloudinary domain chưa cấu hình next/image
                  <img
                    src={member.user.avatarUrl}
                    alt={member.user.name}
                    className="size-full object-cover"
                  />
                ) : (
                  getInitials(member.user.name)
                )}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      <div>
        <p className="mb-1.5 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          Reporter
        </p>
        <label className="flex items-center gap-2 text-sm text-foreground">
          <input
            type="checkbox"
            checked={!!currentUser && filters.reporterId === currentUser.id}
            onChange={toggleReporterIsMe}
            className="size-3.5 accent-primary"
          />
          Reported by me
        </label>
      </div>

      <div>
        <p className="mb-1.5 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          Status
        </p>
        <div className="flex flex-col gap-1">
          <label className="flex items-center gap-2 text-sm text-foreground">
            <input
              type="checkbox"
              checked={filters.done === false}
              onChange={() => setDone(false)}
              className="size-3.5 accent-primary"
            />
            Open
          </label>
          <label className="flex items-center gap-2 text-sm text-foreground">
            <input
              type="checkbox"
              checked={filters.done === true}
              onChange={() => setDone(true)}
              className="size-3.5 accent-primary"
            />
            Done
          </label>
        </div>
      </div>

      {workspaceId ? (
        <div>
          <p className="mb-1.5 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            Label
          </p>
          <Select
            value={filters.label ?? NO_LABEL_VALUE}
            onValueChange={(value) =>
              onChange({ ...filters, label: !value || value === NO_LABEL_VALUE ? undefined : value })
            }
          >
            <SelectTrigger size="sm" className="w-full">
              <SelectValue placeholder="Any label" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={NO_LABEL_VALUE}>Any label</SelectItem>
              {labels?.map((label) => (
                <SelectItem key={label.name} value={label.name}>
                  <span className="flex items-center gap-1.5">
                    <span
                      className="size-2 rounded-full"
                      style={{ backgroundColor: label.color }}
                    />
                    {label.name}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ) : null}
    </div>
  );
}
