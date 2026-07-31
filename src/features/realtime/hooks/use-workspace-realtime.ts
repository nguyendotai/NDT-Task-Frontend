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

// Sự kiện gắn với 1 Task cụ thể (Task Detail Modal) — payload luôn có taskId,
// invalidate đúng tag theo taskId (Comment/Checklist/Label/Attachment/Watcher
// đều dùng {type, id: taskId} khi providesTags) thay vì làm mới toàn bộ Task.
const TASK_DETAIL_EVENT_TAGS = {
  "comment.created": "Comment",
  "comment.updated": "Comment",
  "comment.deleted": "Comment",
  "checklist.created": "Checklist",
  "checklist.updated": "Checklist",
  "checklist.completed": "Checklist",
  "checklist.reopened": "Checklist",
  "checklist.moved": "Checklist",
  "checklist.deleted": "Checklist",
  "task.label_added": "Label",
  "task.label_updated": "Label",
  "task.label_removed": "Label",
  "attachment.uploaded": "Attachment",
  "attachment.renamed": "Attachment",
  "attachment.deleted": "Attachment",
  "task.watcher_added": "Watcher",
  "task.watcher_removed": "Watcher",
} as const;

// board.md/task.md/sprint.md: đồng bộ Board/Task/Column/Sprint theo thời gian
// thực cho mọi Member đang mở cùng Workspace (Socket.IO Gateway ở Backend,
// modules/realtime/). Không patch cache thủ công theo từng sự kiện — chỉ
// invalidate tag để RTK Query tự refetch, khớp đúng độ chi tiết cache hiện có
// (Task/Workspace/Sprint là tag chung toàn app, không tách theo workspaceId;
// Comment/Checklist/Label/Attachment/Watcher tách theo taskId nên invalidate
// đúng taskId thay vì làm mới toàn bộ).
export function useWorkspaceRealtime(workspaceId: string | undefined): void {
  const dispatch = useAppDispatch();
  const accessToken = useAppSelector(selectAccessToken);

  useEffect(() => {
    if (!workspaceId || !accessToken) return;

    // Kết nối/xác thực socket do useRealtimeConnection quản lý (gắn ở layout
    // Dashboard) — ở đây chỉ join/leave room theo workspaceId.
    const socket = getSocket();
    socket.emit("join-workspace", { workspaceId });

    const handleBoardChange = () => {
      dispatch(baseApi.util.invalidateTags(["Task", "Workspace", "Sprint"]));
    };
    for (const event of BOARD_SYNC_EVENTS) {
      socket.on(event, handleBoardChange);
    }

    const taskDetailHandlers = Object.entries(TASK_DETAIL_EVENT_TAGS).map(
      ([event, tagType]) => {
        const handler = (payload: { taskId?: string }) => {
          if (!payload?.taskId) return;
          dispatch(
            baseApi.util.invalidateTags([
              { type: tagType, id: payload.taskId },
              { type: "Task", id: `${payload.taskId}-activity` },
            ]),
          );
        };
        socket.on(event, handler);
        return { event, handler };
      },
    );

    return () => {
      for (const event of BOARD_SYNC_EVENTS) {
        socket.off(event, handleBoardChange);
      }
      for (const { event, handler } of taskDetailHandlers) {
        socket.off(event, handler);
      }
      socket.emit("leave-workspace", { workspaceId });
    };
  }, [workspaceId, accessToken, dispatch]);
}
