"use client";

import { useEffect } from "react";
import { useAppDispatch } from "@/shared/hooks/use-app-dispatch";
import { useAppSelector } from "@/shared/hooks/use-app-selector";
import { selectAccessToken } from "@/features/auth";
import { getSocket } from "@/configs/socket.config";
import { baseApi } from "@/shared/services/base-api";

const BOARD_SYNC_EVENTS = [
  "task.created",
  "task.updated",
  "task.moved",
  "task.deleted",
  "task.restored",
  "column.created",
  "column.updated",
  "column.deleted",
  "column.moved",
  "sprint.started",
  "sprint.completed",
  "sprint.task_added",
  "sprint.task_removed",
] as const;

// board.md/task.md/sprint.md: đồng bộ Board/Task/Column/Sprint theo thời gian
// thực cho mọi Member đang mở cùng Workspace (Socket.IO Gateway ở Backend,
// modules/realtime/). Không patch cache thủ công theo từng sự kiện — chỉ
// invalidate tag để RTK Query tự refetch, khớp đúng độ chi tiết cache hiện có
// (Task/Workspace/Sprint là tag chung toàn app, không tách theo workspaceId).
export function useWorkspaceRealtime(workspaceId: string | undefined): void {
  const dispatch = useAppDispatch();
  const accessToken = useAppSelector(selectAccessToken);

  useEffect(() => {
    if (!workspaceId || !accessToken) return;

    const socket = getSocket();
    socket.auth = { token: accessToken };
    socket.connect();
    socket.emit("join-workspace", { workspaceId });

    const handleChange = () => {
      dispatch(baseApi.util.invalidateTags(["Task", "Workspace", "Sprint"]));
    };
    for (const event of BOARD_SYNC_EVENTS) {
      socket.on(event, handleChange);
    }

    return () => {
      for (const event of BOARD_SYNC_EVENTS) {
        socket.off(event, handleChange);
      }
      socket.emit("leave-workspace", { workspaceId });
      socket.disconnect();
    };
  }, [workspaceId, accessToken, dispatch]);
}
