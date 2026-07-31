"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getSocket } from "@/configs/socket.config";

const OWN_TYPING_TIMEOUT_MS = 3000;
// Tự hết hạn nếu không nhận thêm typing.start (phòng trường hợp mất kết nối
// giữa chừng, không kịp gửi typing.stop) — cùng bậc với thời gian debounce
// phía gửi để không tắt sớm hơn người thật vẫn đang gõ.
const REMOTE_TYPING_EXPIRY_MS = 5000;

interface TypingPayload {
  taskId?: string;
  userId?: string;
  userName?: string;
}

// Typing Indicator (Task Detail Modal) — không lưu DB, chỉ relay qua
// RealtimeGateway. notifyTyping() nên gọi ở mỗi lần gõ (component tự debounce
// gọi lại), notifyStoppedTyping() gọi khi gửi Comment xong.
export function useTypingIndicator(
  workspaceId: string,
  taskId: string,
): {
  typingUserNames: string[];
  notifyTyping: () => void;
  notifyStoppedTyping: () => void;
} {
  const [typingUsers, setTypingUsers] = useState<Map<string, string>>(new Map());
  const expiryTimers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());
  const ownTypingTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const socket = getSocket();
    const timers = expiryTimers.current;

    const handleStart = (payload: TypingPayload) => {
      if (payload?.taskId !== taskId || !payload.userId) return;
      const userId = payload.userId;
      setTypingUsers((prev) => new Map(prev).set(userId, payload.userName ?? "Someone"));
      const existing = timers.get(userId);
      if (existing) clearTimeout(existing);
      timers.set(
        userId,
        setTimeout(() => {
          setTypingUsers((prev) => {
            const next = new Map(prev);
            next.delete(userId);
            return next;
          });
        }, REMOTE_TYPING_EXPIRY_MS),
      );
    };

    const handleStop = (payload: TypingPayload) => {
      if (payload?.taskId !== taskId || !payload.userId) return;
      const userId = payload.userId;
      const existing = timers.get(userId);
      if (existing) clearTimeout(existing);
      timers.delete(userId);
      setTypingUsers((prev) => {
        const next = new Map(prev);
        next.delete(userId);
        return next;
      });
    };

    socket.on("typing.start", handleStart);
    socket.on("typing.stop", handleStop);

    return () => {
      socket.off("typing.start", handleStart);
      socket.off("typing.stop", handleStop);
      for (const timer of timers.values()) clearTimeout(timer);
      timers.clear();
      setTypingUsers(new Map());
    };
  }, [taskId]);

  const notifyTyping = useCallback(() => {
    const socket = getSocket();
    socket.emit("typing.start", { workspaceId, taskId });
    if (ownTypingTimeout.current) clearTimeout(ownTypingTimeout.current);
    ownTypingTimeout.current = setTimeout(() => {
      socket.emit("typing.stop", { workspaceId, taskId });
    }, OWN_TYPING_TIMEOUT_MS);
  }, [workspaceId, taskId]);

  const notifyStoppedTyping = useCallback(() => {
    if (ownTypingTimeout.current) {
      clearTimeout(ownTypingTimeout.current);
      ownTypingTimeout.current = null;
    }
    getSocket().emit("typing.stop", { workspaceId, taskId });
  }, [workspaceId, taskId]);

  useEffect(() => {
    return () => {
      if (ownTypingTimeout.current) clearTimeout(ownTypingTimeout.current);
    };
  }, []);

  return {
    typingUserNames: Array.from(typingUsers.values()),
    notifyTyping,
    notifyStoppedTyping,
  };
}
