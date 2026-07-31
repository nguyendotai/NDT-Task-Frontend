import type { SearchEntityType, SearchTaskFilters } from "../types/search.types";

export function buildAdvancedSearchUrl(
  workspaceId: string,
  q: string,
  type: SearchEntityType | undefined,
  filters: SearchTaskFilters,
): string {
  const params = new URLSearchParams();
  params.set("q", q);
  if (type) params.set("type", type);
  if (filters.assigneeId) params.set("assigneeId", filters.assigneeId);
  if (filters.reporterId) params.set("reporterId", filters.reporterId);
  if (filters.done !== undefined) params.set("done", String(filters.done));
  if (filters.label) params.set("label", filters.label);
  if (filters.sprintId) params.set("sprintId", filters.sprintId);
  if (filters.updatedFrom) params.set("updatedFrom", filters.updatedFrom);
  if (filters.updatedTo) params.set("updatedTo", filters.updatedTo);
  return `/workspaces/${workspaceId}/search?${params.toString()}`;
}
