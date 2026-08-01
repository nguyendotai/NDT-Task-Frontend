"use client";

import Link from "next/link";
import { ClockIcon } from "lucide-react";
import { useListMyWorkspacesQuery } from "@/features/workspace";
import { useRecentlyViewedTasks } from "../hooks/use-recently-viewed-tasks";

const MAX_RECENT_WORKSPACES = 5;

interface SearchRecentPanelProps {
  workspaceId?: string;
  onSelect: () => void;
}

export function SearchRecentPanel({ workspaceId, onSelect }: SearchRecentPanelProps) {
  const recentTasks = useRecentlyViewedTasks();
  const { data: workspaces } = useListMyWorkspacesQuery();
  const recentWorkspaces = (workspaces ?? [])
    .filter((workspace) => workspace.id !== workspaceId)
    .slice(0, MAX_RECENT_WORKSPACES);

  if (recentTasks.length === 0 && recentWorkspaces.length === 0) {
    return (
      <p className="px-3 py-6 text-center text-sm text-muted-foreground">
        Type to search tasks, comments, attachments, members, sprints...
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-3 p-2">
      {recentTasks.length > 0 && (
        <div>
          <p className="flex items-center gap-1.5 px-2 py-1 text-xs font-medium text-muted-foreground">
            <ClockIcon className="size-3.5" />
            Recently viewed
          </p>
          {recentTasks.map((task) => (
            <Link
              key={task.id}
              href={`/workspaces/${task.workspaceId}`}
              onClick={onSelect}
              className="block truncate rounded-md px-2 py-1.5 text-sm text-foreground hover:bg-accent"
            >
              {task.title}
            </Link>
          ))}
        </div>
      )}

      {recentWorkspaces.length > 0 && (
        <div>
          <p className="px-2 py-1 text-xs font-medium text-muted-foreground">Recent workspaces</p>
          {recentWorkspaces.map((workspace) => (
            <Link
              key={workspace.id}
              href={`/workspaces/${workspace.id}`}
              onClick={onSelect}
              className="flex items-center gap-2 truncate rounded-md px-2 py-1.5 text-sm text-foreground hover:bg-accent"
            >
              <span
                className="flex size-5 shrink-0 items-center justify-center rounded-md text-[11px]"
                style={{ backgroundColor: workspace.avatarColor }}
              >
                {workspace.avatarEmoji}
              </span>
              <span className="truncate">{workspace.name}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
