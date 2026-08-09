"use client";

import { useRef, useState } from "react";
import { FileTextIcon, PaperclipIcon, PlusIcon, XIcon } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { getApiErrorMessage } from "@/shared/utils/api-error";
import {
  useDeleteAttachmentMutation,
  useListAttachmentsQuery,
  useUploadAttachmentMutation,
  type Attachment,
} from "@/features/attachment";

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function isPreviewable(mimeType: string): boolean {
  return mimeType.startsWith("image/") || mimeType === "application/pdf";
}

export function TaskAttachmentsPanel({ taskId }: { taskId: string }) {
  const { data: attachments, isLoading } = useListAttachmentsQuery(taskId);
  const [uploadAttachment, { isLoading: isUploading }] =
    useUploadAttachmentMutation();
  const [deleteAttachment] = useDeleteAttachmentMutation();
  const [isDragging, setDragging] = useState(false);
  const [previewAttachment, setPreviewAttachment] = useState<Attachment | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    for (const file of Array.from(files)) {
      try {
        await uploadAttachment({ taskId, file }).unwrap();
      } catch (error) {
        window.alert(getApiErrorMessage(error as never));
      }
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteAttachment({ id, taskId }).unwrap();
    } catch (error) {
      window.alert(getApiErrorMessage(error as never));
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
          <PaperclipIcon className="size-4" />
          Attachments
        </div>
        <Button
          type="button"
          size="sm"
          className="gap-1.5"
          disabled={isUploading}
          onClick={() => fileInputRef.current?.click()}
        >
          <PlusIcon className="size-3.5" />
          {isUploading ? "Uploading..." : "Add"}
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={(event) => {
            handleFiles(event.target.files);
            event.target.value = "";
          }}
        />
      </div>

      <div
        className={
          "rounded-xl border border-dashed p-4 text-center text-xs text-muted-foreground transition-colors " +
          (isDragging ? "border-primary bg-primary/5" : "border-border/60")
        }
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          handleFiles(event.dataTransfer.files);
        }}
      >
        Drop files here, paste screenshots, or select files.
      </div>

      {isLoading ? (
        <div className="h-12 animate-pulse rounded-xl bg-muted/50" />
      ) : !attachments || attachments.length === 0 ? (
        <p className="text-sm text-muted-foreground">No attachments yet.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {attachments.map((attachment) => {
            const previewable = isPreviewable(attachment.mimeType);
            const isImage = attachment.mimeType.startsWith("image/");
            return (
              <div
                key={attachment.id}
                className="flex items-center justify-between gap-2 rounded-xl border border-border/60 bg-background/50 px-3 py-2"
              >
                <button
                  type="button"
                  onClick={
                    previewable
                      ? () => setPreviewAttachment(attachment)
                      : () => window.open(attachment.fileUrl, "_blank", "noreferrer")
                  }
                  className="flex min-w-0 flex-1 items-center gap-2 text-left"
                >
                  {isImage ? (
                    // eslint-disable-next-line @next/next/no-img-element -- ảnh Cloudinary bên ngoài domain, next/image cần cấu hình remotePatterns không cần thiết cho thumbnail nhỏ này
                    <img
                      src={attachment.fileUrl}
                      alt={attachment.fileName}
                      className="size-9 shrink-0 rounded-md object-cover"
                    />
                  ) : (
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-muted">
                      <FileTextIcon className="size-4 text-muted-foreground" />
                    </span>
                  )}
                  <span className="min-w-0 truncate text-sm font-medium text-foreground hover:underline">
                    {attachment.fileName}
                  </span>
                </button>
                <span className="shrink-0 text-xs text-muted-foreground">
                  {formatFileSize(attachment.fileSize)}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Delete attachment"
                  onClick={() => handleDelete(attachment.id)}
                >
                  <XIcon className="size-3.5" />
                </Button>
              </div>
            );
          })}
        </div>
      )}

      <Dialog
        open={previewAttachment !== null}
        onOpenChange={(open) => !open && setPreviewAttachment(null)}
      >
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle className="truncate">{previewAttachment?.fileName}</DialogTitle>
          </DialogHeader>
          {previewAttachment?.mimeType.startsWith("image/") ? (
            // eslint-disable-next-line @next/next/no-img-element -- ảnh Cloudinary bên ngoài domain, preview kích thước gốc không cần tối ưu qua next/image
            <img
              src={previewAttachment.fileUrl}
              alt={previewAttachment.fileName}
              className="mx-auto max-h-[75vh] w-auto rounded-lg object-contain"
            />
          ) : previewAttachment ? (
            <iframe
              src={previewAttachment.fileUrl}
              title={previewAttachment.fileName}
              className="h-[75vh] w-full rounded-lg border border-border/60"
            />
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
