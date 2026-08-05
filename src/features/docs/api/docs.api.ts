import { baseApi } from "@/shared/services/base-api";
import type { Doc, DocSummary } from "../types/docs.types";

interface CreateDocRequest {
  workspaceId: string;
  title: string;
  content?: Record<string, unknown>;
}

interface UpdateDocRequest {
  id: string;
  workspaceId: string;
  title?: string;
  content?: Record<string, unknown>;
}

interface DeleteDocRequest {
  id: string;
  workspaceId: string;
}

export const docsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listDocs: builder.query<DocSummary[], string>({
      query: (workspaceId) => `/workspaces/${workspaceId}/docs`,
      providesTags: (_result, _error, workspaceId) => [
        { type: "Doc", id: workspaceId },
      ],
    }),
    getDoc: builder.query<Doc, string>({
      query: (id) => `/docs/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Doc", id }],
    }),
    createDoc: builder.mutation<Doc, CreateDocRequest>({
      query: ({ workspaceId, ...body }) => ({
        url: `/workspaces/${workspaceId}/docs`,
        method: "POST",
        body,
      }),
      invalidatesTags: (_result, _error, { workspaceId }) => [
        { type: "Doc", id: workspaceId },
      ],
    }),
    updateDoc: builder.mutation<Doc, UpdateDocRequest>({
      query: ({ id, title, content }) => ({
        url: `/docs/${id}`,
        method: "PATCH",
        body: { title, content },
      }),
      invalidatesTags: (_result, _error, { id, workspaceId }) => [
        { type: "Doc", id },
        { type: "Doc", id: workspaceId },
      ],
    }),
    deleteDoc: builder.mutation<Record<string, never>, DeleteDocRequest>({
      query: ({ id }) => ({ url: `/docs/${id}`, method: "DELETE" }),
      invalidatesTags: (_result, _error, { id, workspaceId }) => [
        { type: "Doc", id },
        { type: "Doc", id: workspaceId },
      ],
    }),
  }),
});

export const {
  useListDocsQuery,
  useGetDocQuery,
  useCreateDocMutation,
  useUpdateDocMutation,
  useDeleteDocMutation,
} = docsApi;
