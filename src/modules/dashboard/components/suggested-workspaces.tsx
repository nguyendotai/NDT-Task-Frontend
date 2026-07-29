"use client";

import { useListMyWorkspacesQuery } from "@/features/workspace";
import { WorkspaceCard } from "./workspace-card";

const SUGGESTED_LIMIT = 5;

export function SuggestedWorkspaces() {
  const { data: workspaces = [], isLoading, isError, refetch } =
    useListMyWorkspacesQuery();
  const suggested = workspaces.slice(0, SUGGESTED_LIMIT);

  return (
    <section className="flex flex-col gap-3">
      <h2 className="font-heading text-lg font-bold">Suggested workspaces</h2>

      {isLoading ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {Array.from({ length: SUGGESTED_LIMIT }).map((_, index) => (
            <div
              key={index}
              className="h-28 animate-pulse rounded-2xl border border-border/60 bg-muted/50"
            />
          ))}
        </div>
      ) : isError ? (
        <div className="rounded-2xl border border-dashed border-border/60 p-6 text-center text-sm text-muted-foreground">
          Couldn&apos;t load your workspaces.{" "}
          <button
            type="button"
            onClick={() => refetch()}
            className="font-medium text-foreground underline underline-offset-2"
          >
            Retry
          </button>
        </div>
      ) : suggested.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border/60 p-6 text-center text-sm text-muted-foreground">
          You don&apos;t have any workspaces yet — create your first one.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {suggested.map((workspace) => (
            <WorkspaceCard key={workspace.id} workspace={workspace} />
          ))}
        </div>
      )}
    </section>
  );
}
