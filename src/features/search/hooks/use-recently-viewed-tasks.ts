"use client";

import { useCallback, useEffect, useState } from "react";

export interface RecentlyViewedTask {
  id: string;
  title: string;
  workspaceId: string;
  viewedAt: string;
}

const MAX_ITEMS = 8;
// 1 key toàn cục (không theo từng Workspace nữa) — vì Search giờ dùng được ở
// bất cứ đâu, không chỉ trong 1 Workspace cụ thể. Mỗi item tự lưu kèm
// workspaceId để vẫn điều hướng đúng chỗ.
const STORAGE_KEY = "ndt-recently-viewed";

function readItems(): RecentlyViewedTask[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as RecentlyViewedTask[]) : [];
  } catch {
    return [];
  }
}

// Gọi từ nơi mở Task Detail (không cần render component) — lưu localStorage,
// không đổi Backend/DB theo quyết định của bạn.
export function recordRecentlyViewedTask(task: {
  id: string;
  title: string;
  workspaceId: string;
}): void {
  if (typeof window === "undefined") return;
  const existing = readItems().filter((item) => item.id !== task.id);
  const next = [
    { id: task.id, title: task.title, workspaceId: task.workspaceId, viewedAt: new Date().toISOString() },
    ...existing,
  ].slice(0, MAX_ITEMS);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  window.dispatchEvent(new Event("ndt-recently-viewed-updated"));
}

export function useRecentlyViewedTasks(): RecentlyViewedTask[] {
  const [items, setItems] = useState<RecentlyViewedTask[]>([]);

  const refresh = useCallback(() => {
    setItems(readItems());
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- localStorage không reactive, cần sync lúc mount
    refresh();
    window.addEventListener("ndt-recently-viewed-updated", refresh);
    return () => window.removeEventListener("ndt-recently-viewed-updated", refresh);
  }, [refresh]);

  return items;
}
