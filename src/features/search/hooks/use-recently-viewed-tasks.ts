"use client";

import { useCallback, useEffect, useState } from "react";

export interface RecentlyViewedTask {
  id: string;
  title: string;
  viewedAt: string;
}

const MAX_ITEMS = 8;

function storageKey(workspaceId: string): string {
  return `ndt-recently-viewed:${workspaceId}`;
}

function readItems(workspaceId: string): RecentlyViewedTask[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(storageKey(workspaceId));
    return raw ? (JSON.parse(raw) as RecentlyViewedTask[]) : [];
  } catch {
    return [];
  }
}

// Gọi từ nơi mở Task Detail (không cần render component) — lưu localStorage,
// không đổi Backend/DB theo quyết định của bạn.
export function recordRecentlyViewedTask(
  workspaceId: string,
  task: { id: string; title: string },
): void {
  if (typeof window === "undefined") return;
  const existing = readItems(workspaceId).filter((item) => item.id !== task.id);
  const next = [{ id: task.id, title: task.title, viewedAt: new Date().toISOString() }, ...existing].slice(
    0,
    MAX_ITEMS,
  );
  window.localStorage.setItem(storageKey(workspaceId), JSON.stringify(next));
  window.dispatchEvent(new Event("ndt-recently-viewed-updated"));
}

export function useRecentlyViewedTasks(workspaceId: string | undefined): RecentlyViewedTask[] {
  const [items, setItems] = useState<RecentlyViewedTask[]>([]);

  const refresh = useCallback(() => {
    setItems(workspaceId ? readItems(workspaceId) : []);
  }, [workspaceId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- localStorage không reactive, cần sync lúc mount
    refresh();
    window.addEventListener("ndt-recently-viewed-updated", refresh);
    return () => window.removeEventListener("ndt-recently-viewed-updated", refresh);
  }, [refresh]);

  return items;
}
