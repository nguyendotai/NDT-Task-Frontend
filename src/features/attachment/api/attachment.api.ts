import { baseApi } from "@/shared/services/base-api";
import type { Attachment } from "../types/attachment.types";

interface UploadAttachmentRequest {
  taskId: string;
  file: File;
}

interface DeleteAttachmentRequest {
  id: string;
  taskId: string;
}

interface RenameAttachmentRequest {
  id: string;
  taskId: string;
  fileName: string;
}

export const attachmentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listAttachments: builder.query<Attachment[], string>({
      query: (taskId) => `/tasks/${taskId}/attachments`,
      providesTags: (_result, _error, taskId) => [
        { type: "Attachment", id: taskId },
      ],
    }),
    uploadAttachment: builder.mutation<Attachment, UploadAttachmentRequest>({
      query: ({ taskId, file }) => {
        const formData = new FormData();
        formData.append("file", file);
        return { url: `/tasks/${taskId}/attachments`, method: "POST", body: formData };
      },
      invalidatesTags: (_result, _error, { taskId }) => [
        { type: "Attachment", id: taskId },
      ],
    }),
    deleteAttachment: builder.mutation<
      Record<string, never>,
      DeleteAttachmentRequest
    >({
      query: ({ id }) => ({ url: `/attachments/${id}`, method: "DELETE" }),
      invalidatesTags: (_result, _error, { taskId }) => [
        { type: "Attachment", id: taskId },
      ],
    }),
    renameAttachment: builder.mutation<Attachment, RenameAttachmentRequest>({
      query: ({ id, fileName }) => ({
        url: `/attachments/${id}/rename`,
        method: "PATCH",
        body: { fileName },
      }),
      invalidatesTags: (_result, _error, { taskId }) => [
        { type: "Attachment", id: taskId },
      ],
    }),
  }),
});

export const {
  useListAttachmentsQuery,
  useUploadAttachmentMutation,
  useDeleteAttachmentMutation,
  useRenameAttachmentMutation,
} = attachmentApi;
