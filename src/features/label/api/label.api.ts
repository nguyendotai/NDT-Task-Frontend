import { baseApi } from "@/shared/services/base-api";
import type { Label } from "../types/label.types";

interface CreateLabelRequest {
  taskId: string;
  name: string;
  color: string;
}

interface UpdateLabelRequest {
  id: string;
  taskId: string;
  name?: string;
  color?: string;
}

interface DeleteLabelRequest {
  id: string;
  taskId: string;
}

export const labelApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listLabels: builder.query<Label[], string>({
      query: (taskId) => `/tasks/${taskId}/labels`,
      providesTags: (_result, _error, taskId) => [{ type: "Label", id: taskId }],
    }),
    createLabel: builder.mutation<Label, CreateLabelRequest>({
      query: ({ taskId, ...body }) => ({
        url: `/tasks/${taskId}/labels`,
        method: "POST",
        body,
      }),
      invalidatesTags: (_result, _error, { taskId }) => [
        { type: "Label", id: taskId },
      ],
    }),
    updateLabel: builder.mutation<Label, UpdateLabelRequest>({
      query: ({ id, taskId, ...body }) => {
        void taskId;
        return { url: `/labels/${id}`, method: "PATCH", body };
      },
      invalidatesTags: (_result, _error, { taskId }) => [
        { type: "Label", id: taskId },
      ],
    }),
    deleteLabel: builder.mutation<Record<string, never>, DeleteLabelRequest>({
      query: ({ id }) => ({ url: `/labels/${id}`, method: "DELETE" }),
      invalidatesTags: (_result, _error, { taskId }) => [
        { type: "Label", id: taskId },
      ],
    }),
  }),
});

export const {
  useListLabelsQuery,
  useCreateLabelMutation,
  useUpdateLabelMutation,
  useDeleteLabelMutation,
} = labelApi;
