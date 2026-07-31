import { baseApi } from "@/shared/services/base-api";
import type { ChecklistItem } from "../types/checklist.types";

interface CreateChecklistItemRequest {
  taskId: string;
  title: string;
}

interface UpdateChecklistItemRequest {
  id: string;
  taskId: string;
  title: string;
}

interface ChecklistItemActionRequest {
  id: string;
  taskId: string;
}

interface ReorderChecklistRequest {
  taskId: string;
  orderedChecklistIds: string[];
}

export const checklistApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listChecklistItems: builder.query<ChecklistItem[], string>({
      query: (taskId) => `/tasks/${taskId}/checklists`,
      providesTags: (_result, _error, taskId) => [
        { type: "Checklist", id: taskId },
      ],
    }),
    createChecklistItem: builder.mutation<
      ChecklistItem,
      CreateChecklistItemRequest
    >({
      query: ({ taskId, title }) => ({
        url: `/tasks/${taskId}/checklists`,
        method: "POST",
        body: { title },
      }),
      invalidatesTags: (_result, _error, { taskId }) => [
        { type: "Checklist", id: taskId },
      ],
    }),
    updateChecklistItem: builder.mutation<
      ChecklistItem,
      UpdateChecklistItemRequest
    >({
      query: ({ id, title }) => ({
        url: `/checklists/${id}`,
        method: "PATCH",
        body: { title },
      }),
      invalidatesTags: (_result, _error, { taskId }) => [
        { type: "Checklist", id: taskId },
      ],
    }),
    completeChecklistItem: builder.mutation<
      ChecklistItem,
      ChecklistItemActionRequest
    >({
      query: ({ id }) => ({ url: `/checklists/${id}/complete`, method: "PATCH" }),
      invalidatesTags: (_result, _error, { taskId }) => [
        { type: "Checklist", id: taskId },
      ],
    }),
    reopenChecklistItem: builder.mutation<
      ChecklistItem,
      ChecklistItemActionRequest
    >({
      query: ({ id }) => ({ url: `/checklists/${id}/reopen`, method: "PATCH" }),
      invalidatesTags: (_result, _error, { taskId }) => [
        { type: "Checklist", id: taskId },
      ],
    }),
    reorderChecklistItems: builder.mutation<
      ChecklistItem[],
      ReorderChecklistRequest
    >({
      query: ({ taskId, orderedChecklistIds }) => ({
        url: `/tasks/${taskId}/checklists/reorder`,
        method: "PATCH",
        body: { orderedChecklistIds },
      }),
      invalidatesTags: (_result, _error, { taskId }) => [
        { type: "Checklist", id: taskId },
      ],
    }),
    deleteChecklistItem: builder.mutation<
      Record<string, never>,
      ChecklistItemActionRequest
    >({
      query: ({ id }) => ({ url: `/checklists/${id}`, method: "DELETE" }),
      invalidatesTags: (_result, _error, { taskId }) => [
        { type: "Checklist", id: taskId },
      ],
    }),
  }),
});

export const {
  useListChecklistItemsQuery,
  useCreateChecklistItemMutation,
  useUpdateChecklistItemMutation,
  useCompleteChecklistItemMutation,
  useReopenChecklistItemMutation,
  useReorderChecklistItemsMutation,
  useDeleteChecklistItemMutation,
} = checklistApi;
