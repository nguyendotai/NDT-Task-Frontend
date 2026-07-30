import { baseApi } from "@/shared/services/base-api";
import type { Comment } from "../types/comment.types";

interface CreateCommentRequest {
  taskId: string;
  content: string;
  mentions?: string[];
}

interface UpdateCommentRequest {
  id: string;
  taskId: string;
  content: string;
}

interface DeleteCommentRequest {
  id: string;
  taskId: string;
}

export const commentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listComments: builder.query<Comment[], string>({
      query: (taskId) => `/tasks/${taskId}/comments`,
      providesTags: (_result, _error, taskId) => [
        { type: "Comment", id: taskId },
      ],
    }),
    createComment: builder.mutation<Comment, CreateCommentRequest>({
      query: ({ taskId, ...body }) => ({
        url: `/tasks/${taskId}/comments`,
        method: "POST",
        body,
      }),
      invalidatesTags: (_result, _error, { taskId }) => [
        { type: "Comment", id: taskId },
      ],
    }),
    updateComment: builder.mutation<Comment, UpdateCommentRequest>({
      query: ({ id, content }) => ({
        url: `/comments/${id}`,
        method: "PATCH",
        body: { content },
      }),
      invalidatesTags: (_result, _error, { taskId }) => [
        { type: "Comment", id: taskId },
      ],
    }),
    deleteComment: builder.mutation<Record<string, never>, DeleteCommentRequest>({
      query: ({ id }) => ({ url: `/comments/${id}`, method: "DELETE" }),
      invalidatesTags: (_result, _error, { taskId }) => [
        { type: "Comment", id: taskId },
      ],
    }),
  }),
});

export const {
  useListCommentsQuery,
  useCreateCommentMutation,
  useUpdateCommentMutation,
  useDeleteCommentMutation,
} = commentApi;
