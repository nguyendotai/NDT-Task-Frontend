import type { SearchTaskFilters } from "../types/search.types";

// Trỏ tới trang Global Search (`/search`, xuyên suốt tất cả Workspace) — thay
// cho `buildAdvancedSearchUrl` cũ (trỏ tới `/workspaces/:id/search`, không
// còn được SearchBox liên kết tới nữa vì search giờ luôn ở chế độ Global).
export function buildGlobalSearchUrl(q: string, filters: SearchTaskFilters): string {
  const params = new URLSearchParams();
  params.set("q", q);
  if (filters.assigneeId) params.set("assigneeId", filters.assigneeId);
  if (filters.reporterId) params.set("reporterId", filters.reporterId);
  if (filters.done !== undefined) params.set("done", String(filters.done));
  if (filters.label) params.set("label", filters.label);
  if (filters.sprintId) params.set("sprintId", filters.sprintId);
  if (filters.updatedFrom) params.set("updatedFrom", filters.updatedFrom);
  if (filters.updatedTo) params.set("updatedTo", filters.updatedTo);
  return `/search?${params.toString()}`;
}
