"use client";

import { useEffect, useState } from "react";
import { getSocket } from "@/configs/socket.config";

// Presence: chấm xanh "đang online" trên avatar thành viên — server tự tính
// theo Set(socketId) mỗi Workspace (RealtimeGateway), ở đây chỉ nhận 3 sự
// kiện (snapshot lúc mới join, online/offline khi người khác vào/ra) để dựng
// lại danh sách userId đang online trong đúng Workspace này.
export function usePresence(workspaceId: string | undefined): Set<string> {
  const [onlineUserIds, setOnlineUserIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!workspaceId) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOnlineUserIds(new Set());

    const socket = getSocket();

    const handleSnapshot = (payload: { onlineUserIds?: string[] }) => {
      setOnlineUserIds(new Set(payload?.onlineUserIds ?? []));
    };
    const handleOnline = (payload: { userId?: string }) => {
      if (!payload?.userId) return;
      setOnlineUserIds((prev) => new Set(prev).add(payload.userId as string));
    };
    const handleOffline = (payload: { userId?: string }) => {
      if (!payload?.userId) return;
      setOnlineUserIds((prev) => {
        const next = new Set(prev);
        next.delete(payload.userId as string);
        return next;
      });
    };

    socket.on("presence.snapshot", handleSnapshot);
    socket.on("presence.online", handleOnline);
    socket.on("presence.offline", handleOffline);

    return () => {
      socket.off("presence.snapshot", handleSnapshot);
      socket.off("presence.online", handleOnline);
      socket.off("presence.offline", handleOffline);
    };
  }, [workspaceId]);

  return onlineUserIds;
}
