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
      <h2 className="font-heading text-lg font-bold">Recommend workspaces</h2>

      {isLoading ? (
        <div className="flex gap-3 overflow-x-auto pb-2">
          {Array.from({ length: SUGGESTED_LIMIT }).map((_, index) => (
            <div
              key={index}
              className="h-40 w-64 shrink-0 animate-pulse rounded-2xl border border-border/60 bg-muted/50 sm:w-72"
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
        <div className="flex gap-3 overflow-x-auto pb-2">
          {suggested.map((workspace) => (
            <div key={workspace.id} className="w-64 shrink-0 sm:w-72">
              <WorkspaceCard workspace={workspace} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
