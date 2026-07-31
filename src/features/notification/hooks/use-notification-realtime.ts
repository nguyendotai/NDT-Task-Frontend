"use client";

import { useEffect } from "react";
import { useAppDispatch } from "@/shared/hooks/use-app-dispatch";
import { getSocket } from "@/configs/socket.config";
import { baseApi } from "@/shared/services/base-api";

// notification.md #11: chuông thông báo cập nhật tức thời thay vì chờ poll
// 30s — server tự join mỗi socket vào room riêng theo userId ngay khi xác
// thực xong (RealtimeGateway), nên ở đây chỉ cần lắng nghe, không cần "join"
// gì thêm. Không cần workspaceId — dùng được ở mọi trang trong Dashboard.
export function useNotificationRealtime(): void {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const socket = getSocket();
    const handleNotificationCreated = () => {
      dispatch(baseApi.util.invalidateTags(["Notification"]));
    };
    socket.on("notification.created", handleNotificationCreated);

    return () => {
      socket.off("notification.created", handleNotificationCreated);
    };
  }, [dispatch]);
}
