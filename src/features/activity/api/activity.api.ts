import { baseApi } from "@/shared/services/base-api";
import type { ActivityLogEntry } from "../types/activity.types";

interface ListWorkspaceActivityParams {
  workspaceId: string;
  limit?: number;
  offset?: number;
}

// Không cache tag — trang Audit Log chỉ đọc, không có mutation nào cần
// invalidate lại nó (cùng cách tiếp cận với features/search/).
export const activityApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listWorkspaceActivity: builder.query<ActivityLogEntry[], ListWorkspaceActivityParams>({
      query: ({ workspaceId, limit, offset }) => ({
        url: `/workspaces/${workspaceId}/activity`,
        params: {
          ...(limit !== undefined ? { limit: String(limit) } : {}),
          ...(offset !== undefined ? { offset: String(offset) } : {}),
        },
      }),
    }),
  }),
});

export const { useListWorkspaceActivityQuery } = activityApi;
