"use client";

import { useListMembersQuery } from "@/features/workspace";
import { selectCurrentUser } from "@/features/auth";
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
import type { SearchTaskFilters } from "../types/search.types";

const NO_LABEL_VALUE = "__all__";

interface SearchFiltersPanelProps {
  workspaceId: string;
  filters: SearchTaskFilters;
  onChange: (filters: SearchTaskFilters) => void;
}

export function SearchFiltersPanel({ workspaceId, filters, onChange }: SearchFiltersPanelProps) {
  const currentUser = useAppSelector(selectCurrentUser);
  const { data: members } = useListMembersQuery(workspaceId);
  const { data: labels } = useListSearchLabelsQuery(workspaceId);

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

  return (
    <div className="flex w-56 shrink-0 flex-col gap-4 overflow-y-auto border-l border-border/60 p-3">
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
                "flex size-7 items-center justify-center rounded-full text-xs font-medium ring-2 ring-offset-1 ring-offset-background transition-all",
                filters.assigneeId === member.user.id
                  ? "bg-primary text-primary-foreground ring-primary"
                  : "bg-secondary text-secondary-foreground ring-transparent hover:ring-border",
              )}
            >
              {getInitials(member.user.name)}
            </button>
          ))}
        </div>
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
    </div>
  );
}
