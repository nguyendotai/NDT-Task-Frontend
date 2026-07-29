"use client";

import Link from "next/link";
import { StarIcon } from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
  useStarWorkspaceMutation,
  useUnstarWorkspaceMutation,
} from "@/features/workspace";

interface WorkspaceCardProps {
  workspace: {
    id: string;
    name: string;
    type?: string;
    myRole?: string;
    isStarred?: boolean;
  };
}

export function WorkspaceCard({ workspace }: WorkspaceCardProps) {
  const [star] = useStarWorkspaceMutation();
  const [unstar] = useUnstarWorkspaceMutation();
  const canToggleStar = workspace.isStarred !== undefined;

  return (
    <div className="group relative rounded-2xl border border-border/60 bg-card p-4 transition-colors hover:border-border">
      <Link
        href={`/workspaces/${workspace.id}`}
        className="flex flex-col gap-2.5"
      >
        <div className="flex items-center justify-between">
          <span className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-violet-500 text-sm font-bold text-white">
            {workspace.name.charAt(0).toUpperCase()}
          </span>
          {workspace.type ? (
            <Badge variant="outline">{workspace.type}</Badge>
          ) : null}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-foreground">
            {workspace.name}
          </p>
          {workspace.myRole ? (
            <p className="text-xs text-muted-foreground">{workspace.myRole}</p>
          ) : null}
        </div>
      </Link>
      {canToggleStar ? (
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="absolute top-2 right-2"
          aria-label={workspace.isStarred ? "Bỏ đánh dấu sao" : "Đánh dấu sao"}
          onClick={() =>
            workspace.isStarred ? unstar(workspace.id) : star(workspace.id)
          }
        >
          <StarIcon
            className={
              workspace.isStarred
                ? "size-4 fill-yellow-400 text-yellow-400"
                : "size-4"
            }
          />
        </Button>
      ) : null}
    </div>
  );
}
