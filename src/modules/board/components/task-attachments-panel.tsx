"use client";

import { useRef, useState } from "react";
import { PaperclipIcon, PlusIcon, XIcon } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { getApiErrorMessage } from "@/shared/utils/api-error";
import {
  useDeleteAttachmentMutation,
  useListAttachmentsQuery,
  useUploadAttachmentMutation,
} from "@/features/attachment";

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function TaskAttachmentsPanel({ taskId }: { taskId: string }) {
  const { data: attachments, isLoading } = useListAttachmentsQuery(taskId);
  const [uploadAttachment, { isLoading: isUploading }] =
    useUploadAttachmentMutation();
  const [deleteAttachment] = useDeleteAttachmentMutation();
  const [isDragging, setDragging] = useState(false);
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
          {attachments.map((attachment) => (
            <div
              key={attachment.id}
              className="flex items-center justify-between gap-2 rounded-xl border border-border/60 bg-background/50 px-3 py-2"
            >
              <a
                href={attachment.fileUrl}
                target="_blank"
                rel="noreferrer"
                className="min-w-0 flex-1 truncate text-sm font-medium text-foreground hover:underline"
              >
                {attachment.fileName}
              </a>
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
          ))}
        </div>
      )}
    </div>
  );
}
