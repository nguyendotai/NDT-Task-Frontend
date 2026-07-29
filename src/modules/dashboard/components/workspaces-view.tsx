"use client";

import Link from "next/link";
import { PlusIcon } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { useListMyWorkspacesQuery } from "@/features/workspace";
import { WorkspaceCard } from "./workspace-card";

export function WorkspacesView() {
  const {
    data: workspaces = [],
    isLoading,
    isError,
    refetch,
  } = useListMyWorkspacesQuery();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="font-heading text-2xl font-bold">My workspaces</h1>
        <Button
          render={<Link href="/workspaces/new" />}
          className="gap-1.5 bg-gradient-to-r from-blue-500 to-violet-500 text-white hover:opacity-90"
        >
          <PlusIcon className="size-4" />
          Create Workspace
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="h-40 animate-pulse rounded-2xl border border-border/60 bg-muted/50"
            />
          ))}
        </div>
      ) : isError ? (
        <div className="rounded-2xl border border-dashed border-border/60 p-8 text-center text-sm text-muted-foreground">
          Couldn&apos;t load your workspaces.{" "}
          <button
            type="button"
            onClick={() => refetch()}
            className="font-medium text-foreground underline underline-offset-2"
          >
            Retry
          </button>
        </div>
      ) : workspaces.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border/60 p-8 text-center text-sm text-muted-foreground">
          You don&apos;t have any workspaces yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {workspaces.map((workspace) => (
            <WorkspaceCard key={workspace.id} workspace={workspace} />
          ))}
        </div>
      )}
    </div>
  );
}
