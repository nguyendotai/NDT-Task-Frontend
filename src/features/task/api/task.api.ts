import { baseApi } from "@/shared/services/base-api";
import type { Task, TaskListScope } from "../types/task.types";

interface ListMyTasksParams {
  done?: boolean;
  starred?: boolean;
  scope?: TaskListScope;
}

function toQueryParams(params?: ListMyTasksParams) {
  if (!params) return undefined;
  const query: Record<string, string> = {};
  if (params.done !== undefined) query.done = String(params.done);
  if (params.starred !== undefined) query.starred = String(params.starred);
  if (params.scope) query.scope = params.scope;
  return query;
}

export const taskApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listMyTasks: builder.query<Task[], ListMyTasksParams | void>({
      query: (params) => ({
        url: "/tasks/me",
        params: toQueryParams(params ?? undefined),
      }),
      providesTags: ["Task"],
    }),
    starTask: builder.mutation<Record<string, never>, string>({
      query: (id) => ({ url: `/tasks/${id}/star`, method: "POST" }),
      invalidatesTags: ["Task"],
    }),
    unstarTask: builder.mutation<Record<string, never>, string>({
      query: (id) => ({ url: `/tasks/${id}/star`, method: "DELETE" }),
      invalidatesTags: ["Task"],
    }),
  }),
});

export const { useListMyTasksQuery, useStarTaskMutation, useUnstarTaskMutation } =
  taskApi;
