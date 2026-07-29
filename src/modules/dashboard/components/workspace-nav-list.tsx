"use client";

import Link from "next/link";
import { ChevronDownIcon, FolderKanbanIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { useListMyWorkspacesQuery } from "@/features/workspace";

const RECENT_LIMIT = 5;
const MORE_LIMIT = 3;

export function WorkspaceNavList() {
  const { data: workspaces = [] } = useListMyWorkspacesQuery();
  const recent = workspaces.slice(0, RECENT_LIMIT);
  const more = workspaces.slice(RECENT_LIMIT, RECENT_LIMIT + MORE_LIMIT);

  return (
    <div className="flex flex-col gap-0.5">
      <div className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
        <FolderKanbanIcon className="size-3.5" />
        Workspace
      </div>

      {recent.length === 0 ? (
        <p className="px-3 py-1.5 text-xs text-muted-foreground">
          No workspaces yet
        </p>
      ) : (
        recent.map((workspace) => (
          <Link
            key={workspace.id}
            href={`/workspaces/${workspace.id}`}
            className="truncate rounded-lg px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            {workspace.name}
          </Link>
        ))
      )}

      {more.length > 0 ? (
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <button
                type="button"
                className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-left text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <ChevronDownIcon className="size-3.5" />
                More
              </button>
            }
          />
          <DropdownMenuContent align="start" className="w-56">
            {more.map((workspace) => (
              <DropdownMenuItem
                key={workspace.id}
                render={<Link href={`/workspaces/${workspace.id}`} />}
              >
                {workspace.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      ) : null}

      <Link
        href="/workspaces"
        className="rounded-lg px-3 py-1.5 text-sm font-medium text-primary hover:underline"
      >
        View all
      </Link>
    </div>
  );
}
