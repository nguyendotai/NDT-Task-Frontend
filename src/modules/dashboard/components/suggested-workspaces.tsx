"use client";

import Link from "next/link";
import { ChevronRightIcon } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { useListMyWorkspacesQuery } from "@/features/workspace";
import { WorkspaceCard } from "./workspace-card";

const SUGGESTED_LIMIT = 5;

export function SuggestedWorkspaces() {
  const { data: workspaces = [], isLoading, isError, refetch } =
    useListMyWorkspacesQuery();
  const suggested = workspaces.slice(0, SUGGESTED_LIMIT);

  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-lg font-bold">Recommend workspaces</h2>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="gap-1"
          nativeButton={false}
          render={<Link href="/workspaces" />}
        >
          View all
          <ChevronRightIcon className="size-3.5" />
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-5 gap-3">
          {Array.from({ length: SUGGESTED_LIMIT }).map((_, index) => (
            <div
              key={index}
              className="h-40 animate-pulse rounded-2xl border border-border/60 bg-muted/50"
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
        <div className="grid grid-cols-5 gap-3">
          {suggested.map((workspace) => (
            <WorkspaceCard key={workspace.id} workspace={workspace} />
          ))}
        </div>
      )}
    </section>
  );
}
