"use client";

import { CreateWorkspaceDialog, useListMyWorkspacesQuery } from "@/features/workspace";
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
        <h1 className="font-heading text-2xl font-bold">Workspace của tôi</h1>
        <CreateWorkspaceDialog />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="h-28 animate-pulse rounded-2xl border border-border/60 bg-muted/50"
            />
          ))}
        </div>
      ) : isError ? (
        <div className="rounded-2xl border border-dashed border-border/60 p-8 text-center text-sm text-muted-foreground">
          Không tải được danh sách Workspace.{" "}
          <button
            type="button"
            onClick={() => refetch()}
            className="font-medium text-foreground underline underline-offset-2"
          >
            Thử lại
          </button>
        </div>
      ) : workspaces.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border/60 p-8 text-center text-sm text-muted-foreground">
          Bạn chưa có Workspace nào.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {workspaces.map((workspace) => (
            <WorkspaceCard key={workspace.id} workspace={workspace} />
          ))}
        </div>
      )}
    </div>
  );
}
