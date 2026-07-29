"use client";

import { Badge } from "@/shared/components/ui/badge";
import { useGetWorkspaceBoardQuery, useGetWorkspaceQuery } from "@/features/workspace";

export function WorkspaceDetailView({ workspaceId }: { workspaceId: string }) {
  const {
    data: workspace,
    isLoading,
    isError,
    refetch,
  } = useGetWorkspaceQuery(workspaceId);
  const { data: board } = useGetWorkspaceBoardQuery(workspaceId, {
    skip: !workspace,
  });

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <div className="h-8 w-64 animate-pulse rounded-lg bg-muted/50" />
        <div className="h-24 animate-pulse rounded-2xl border border-border/60 bg-muted/50" />
      </div>
    );
  }

  if (isError || !workspace) {
    return (
      <div className="rounded-2xl border border-dashed border-border/60 p-8 text-center text-sm text-muted-foreground">
        Không tìm thấy Workspace hoặc bạn không có quyền truy cập.{" "}
        <button
          type="button"
          onClick={() => refetch()}
          className="font-medium text-foreground underline underline-offset-2"
        >
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="font-heading text-2xl font-bold">{workspace.name}</h1>
          <Badge variant="outline">{workspace.type}</Badge>
        </div>
        {workspace.description ? (
          <p className="mt-1 text-sm text-muted-foreground">{workspace.description}</p>
        ) : null}
        <p className="mt-2 text-xs text-muted-foreground">
          {workspace.membersCount} thành viên
        </p>
      </div>

      {board ? (
        <div>
          <h2 className="mb-2 font-heading text-sm font-semibold tracking-wide text-muted-foreground uppercase">
            Board: {board.name}
          </h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {board.columns.map((column) => (
              <div
                key={column.id}
                className="rounded-2xl border border-border/60 bg-card p-4"
              >
                <p className="text-sm font-medium text-foreground">{column.name}</p>
                <p className="mt-1 text-xs text-muted-foreground">Chưa có Task</p>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      <p className="text-sm text-muted-foreground">
        Quản lý chi tiết Task/Board sẽ được bổ sung ở phần Board Management sau này.
      </p>
    </div>
  );
}
