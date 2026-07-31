"use client";

import { useEffect } from "react";
import { useAppSelector } from "@/shared/hooks/use-app-selector";
import { selectAccessToken } from "@/features/auth";
import { getSocket } from "@/configs/socket.config";

// Quản lý vòng đời kết nối Socket.IO (connect/disconnect) — tách riêng khỏi
// useWorkspaceRealtime (chỉ join/leave room) để chuông thông báo (mount ở
// DashboardHeader, không có workspaceId) vẫn nhận được sự kiện cá nhân dù
// người dùng không mở Workspace nào. Gắn 1 lần ở layout Dashboard.
export function useRealtimeConnection(): void {
  const accessToken = useAppSelector(selectAccessToken);

  useEffect(() => {
    if (!accessToken) return;

    const socket = getSocket();
    socket.auth = { token: accessToken };
    if (!socket.connected) socket.connect();

    return () => {
      socket.disconnect();
    };
  }, [accessToken]);
}
