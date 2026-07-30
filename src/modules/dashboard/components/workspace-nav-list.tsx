"use client";

import Link from "next/link";
import { ChevronDownIcon, FolderKanbanIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import {
  getWorkspaceAvatarGradient,
  useListMyWorkspacesQuery,
  type WorkspaceSummary,
} from "@/features/workspace";

const RECENT_LIMIT = 4;

function WorkspaceAvatar({ workspace }: { workspace: WorkspaceSummary }) {
  return (
    <span
      className={`flex size-5 shrink-0 items-center justify-center rounded-md bg-gradient-to-br text-xs ${getWorkspaceAvatarGradient(
        workspace.avatarColor ?? "blue",
      )}`}
    >
      {workspace.avatarEmoji ?? "📁"}
    </span>
  );
}

export function WorkspaceNavList() {
  const { data: workspaces = [] } = useListMyWorkspacesQuery();
  const recent = workspaces.slice(0, RECENT_LIMIT);
  const more = workspaces.slice(RECENT_LIMIT);

  return (
    <div className="flex flex-col gap-0.5">
      <div className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
        <FolderKanbanIcon className="size-3.5" />
        Workspace
      </div>

      {recent.length === 0 ? (
        <p className="px-3 py-1.5 pl-7 text-xs text-muted-foreground">
          No workspaces yet
        </p>
      ) : (
        recent.map((workspace) => (
          <Link
            key={workspace.id}
            href={`/workspaces/${workspace.id}`}
            className="flex items-center gap-2 truncate rounded-lg py-1.5 pr-3 pl-7 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <WorkspaceAvatar workspace={workspace} />
            <span className="truncate">{workspace.name}</span>
          </Link>
        ))
      )}

      {more.length > 0 ? (
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <button
                type="button"
                className="flex items-center gap-1.5 rounded-lg py-1.5 pr-3 pl-7 text-left text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <ChevronDownIcon className="size-3.5" />
                More workspace
              </button>
            }
          />
          <DropdownMenuContent align="start" className="w-56">
            {more.map((workspace) => (
              <DropdownMenuItem
                key={workspace.id}
                render={<Link href={`/workspaces/${workspace.id}`} />}
              >
                <WorkspaceAvatar workspace={workspace} />
                <span className="truncate">{workspace.name}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      ) : null}
    </div>
  );
}
