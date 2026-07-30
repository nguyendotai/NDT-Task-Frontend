import { baseApi } from "@/shared/services/base-api";
import type { Sprint } from "../types/sprint.types";

interface CreateSprintRequest {
  workspaceId: string;
  name: string;
  goal?: string;
  startDate: string;
  endDate: string;
}

interface UpdateSprintRequest {
  id: string;
  name?: string;
  goal?: string;
  startDate?: string;
  endDate?: string;
}

interface AddSprintTaskRequest {
  sprintId: string;
  taskId: string;
}

interface RemoveSprintTaskRequest {
  sprintId: string;
  taskId: string;
}

export const sprintApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listSprints: builder.query<Sprint[], string>({
      query: (workspaceId) => `/workspaces/${workspaceId}/sprints`,
      providesTags: ["Sprint"],
    }),
    getSprint: builder.query<Sprint, string>({
      query: (id) => `/sprints/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Sprint", id }],
    }),
    createSprint: builder.mutation<Sprint, CreateSprintRequest>({
      query: ({ workspaceId, ...body }) => ({
        url: `/workspaces/${workspaceId}/sprints`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Sprint"],
    }),
    updateSprint: builder.mutation<Sprint, UpdateSprintRequest>({
      query: ({ id, ...body }) => ({
        url: `/sprints/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Sprint"],
    }),
    startSprint: builder.mutation<Sprint, string>({
      query: (id) => ({ url: `/sprints/${id}/start`, method: "POST" }),
      invalidatesTags: ["Sprint", "Task"],
    }),
    completeSprint: builder.mutation<Sprint, string>({
      query: (id) => ({ url: `/sprints/${id}/complete`, method: "POST" }),
      invalidatesTags: ["Sprint", "Task"],
    }),
    addSprintTask: builder.mutation<Record<string, never>, AddSprintTaskRequest>({
      query: ({ sprintId, taskId }) => ({
        url: `/sprints/${sprintId}/tasks`,
        method: "POST",
        body: { taskId },
      }),
      invalidatesTags: ["Task"],
    }),
    removeSprintTask: builder.mutation<
      Record<string, never>,
      RemoveSprintTaskRequest
    >({
      query: ({ sprintId, taskId }) => ({
        url: `/sprints/${sprintId}/tasks/${taskId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Task"],
    }),
  }),
});

export const {
  useListSprintsQuery,
  useGetSprintQuery,
  useCreateSprintMutation,
  useUpdateSprintMutation,
  useStartSprintMutation,
  useCompleteSprintMutation,
  useAddSprintTaskMutation,
  useRemoveSprintTaskMutation,
} = sprintApi;
