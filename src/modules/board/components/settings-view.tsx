"use client";

import Link from "next/link";
import { useMemo } from "react";
import { ArrowLeftIcon } from "lucide-react";
import { useAppSelector } from "@/shared/hooks/use-app-selector";
import { selectCurrentUser } from "@/features/auth";
import { useGetWorkspaceQuery, useListMembersQuery } from "@/features/workspace";
import { WorkspaceSettingsView } from "./workspace-settings-view";
import { MemberView } from "./member-view";

export function SettingsView({ workspaceId }: { workspaceId: string }) {
  const currentUser = useAppSelector(selectCurrentUser);
  const {
    data: workspace,
    isLoading,
    isError,
    refetch,
  } = useGetWorkspaceQuery(workspaceId);
  const { data: members } = useListMembersQuery(workspaceId);

  const isOwner = useMemo(
    () =>
      members?.some(
        (member) => member.user.id === currentUser?.id && member.role === "OWNER",
      ) ?? false,
    [members, currentUser],
  );

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <div className="h-8 w-64 animate-pulse rounded-lg bg-muted/50" />
        <div className="h-40 animate-pulse rounded-2xl border border-border/60 bg-muted/50" />
      </div>
    );
  }

  if (isError || !workspace) {
    return (
      <div className="rounded-2xl border border-dashed border-border/60 p-8 text-center text-sm text-muted-foreground">
        Workspace not found, or you don&apos;t have access to it.{" "}
        <button
          type="button"
          onClick={() => refetch()}
          className="font-medium text-foreground underline underline-offset-2"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link
          href={`/workspaces/${workspaceId}`}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeftIcon className="size-4" />
          Back to Board
        </Link>
        <h1 className="mt-3 font-heading text-2xl font-bold">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">{workspace.name}</p>
      </div>

      {isOwner ? (
        <WorkspaceSettingsView workspace={workspace} />
      ) : (
        <p className="rounded-2xl border border-dashed border-border/60 p-6 text-sm text-muted-foreground">
          Only the Owner can edit Workspace settings.
        </p>
      )}

      <div>
        <h2 className="mb-3 font-heading text-sm font-semibold tracking-wide text-muted-foreground uppercase">
          Member
        </h2>
        <MemberView workspaceId={workspaceId} />
      </div>
    </div>
  );
}
