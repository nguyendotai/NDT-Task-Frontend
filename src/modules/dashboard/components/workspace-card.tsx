"use client";

import Link from "next/link";
import { ChevronRightIcon, GlobeIcon, LayoutGridIcon, StarIcon } from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
  getWorkspaceAvatarGradient,
  useStarWorkspaceMutation,
  useUnstarWorkspaceMutation,
} from "@/features/workspace";

interface WorkspaceCardProps {
  workspace: {
    id: string;
    name: string;
    type?: string;
    shortCode?: string;
    avatarEmoji?: string;
    avatarColor?: string;
    tasksCount?: number;
    isStarred?: boolean;
  };
}

export function WorkspaceCard({ workspace }: WorkspaceCardProps) {
  const [star] = useStarWorkspaceMutation();
  const [unstar] = useUnstarWorkspaceMutation();
  const canToggleStar = workspace.isStarred !== undefined;
  const showStats = workspace.tasksCount !== undefined;

  return (
    <div className="group relative flex flex-col gap-3 rounded-2xl border border-border/60 bg-card p-4 transition-colors hover:border-border">
      {canToggleStar ? (
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="absolute top-3 right-3 z-10"
          aria-label={workspace.isStarred ? "Unstar" : "Star"}
          onClick={() =>
            workspace.isStarred ? unstar(workspace.id) : star(workspace.id)
          }
        >
          <StarIcon
            className={
              workspace.isStarred ? "size-4 fill-yellow-400 text-yellow-400" : "size-4"
            }
          />
        </Button>
      ) : null}

      <Link href={`/workspaces/${workspace.id}`} className="flex flex-col gap-3">
        {workspace.shortCode ? (
          <div className="flex items-center gap-1.5">
            <GlobeIcon className="size-4 text-muted-foreground" />
            <Badge variant="secondary" className="font-mono text-[10px] tracking-wider">
              {workspace.shortCode}
            </Badge>
          </div>
        ) : null}

        <div className="flex items-center gap-3 pr-6">
          <span
            className={`flex size-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-2xl ${getWorkspaceAvatarGradient(
              workspace.avatarColor ?? "blue",
            )}`}
          >
            {workspace.avatarEmoji ?? "📁"}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-base font-bold text-foreground">
              {workspace.name}
            </p>
            {workspace.type ? (
              <div className="mt-1 flex flex-wrap items-center gap-1.5">
                <Badge variant="secondary" className="gap-1">
                  <LayoutGridIcon className="size-3" />
                  {workspace.type === "KANBAN" ? "Kanban" : "Scrum"}
                </Badge>
                <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                  Active
                </Badge>
              </div>
            ) : null}
          </div>
        </div>

        {showStats ? (
          <>
            <div className="h-px bg-border/60" />
            <div className="flex items-center justify-between">
              <div className="flex gap-6">
                <div>
                  <p className="text-xs text-muted-foreground">Tasks</p>
                  <p className="text-sm font-semibold text-foreground">
                    {workspace.tasksCount}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Docs</p>
                  <p className="text-sm font-semibold text-foreground">0</p>
                </div>
              </div>
              <ChevronRightIcon className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
            </div>
          </>
        ) : null}
      </Link>
    </div>
  );
}
