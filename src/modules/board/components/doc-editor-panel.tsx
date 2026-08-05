"use client";

import { useEffect, useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import { PencilIcon, Trash2Icon, XIcon } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { getApiErrorMessage } from "@/shared/utils/api-error";
import {
  useCreateDocMutation,
  useDeleteDocMutation,
  useUpdateDocMutation,
  type Doc,
} from "@/features/docs";
import { DocEditorToolbar } from "./doc-editor-toolbar";

function formatDateTime(value: string): string {
  return new Date(value).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

// docs.md #5: Frontend chỉ ẩn/hiện nút Edit/Delete theo quyền — Backend vẫn
// tự kiểm tra lại (permission.md), không tin tưởng riêng phía Client.
export function DocEditorPanel({
  workspaceId,
  doc,
  authorName,
  canModify,
  isCreating,
  onCreated,
  onDeleted,
  onCancelCreate,
}: {
  workspaceId: string;
  doc: Doc | null;
  authorName: string | undefined;
  canModify: boolean;
  isCreating: boolean;
  onCreated: (docId: string) => void;
  onDeleted: () => void;
  onCancelCreate: () => void;
}) {
  const [isEditing, setIsEditing] = useState(isCreating);
  const [title, setTitle] = useState(doc?.title ?? "");
  const [formError, setFormError] = useState<string | null>(null);
  const [createDoc, { isLoading: isCreatingDoc }] = useCreateDocMutation();
  const [updateDoc, { isLoading: isUpdating }] = useUpdateDocMutation();
  const [deleteDoc, { isLoading: isDeleting }] = useDeleteDocMutation();

  const editor = useEditor({
    extensions: [StarterKit],
    content: doc?.content ?? "",
    editable: isEditing,
    immediatelyRender: false,
  });

  // Đổi Doc đang xem/chuyển sang tạo mới -> reset editor state theo doc mới.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reset state theo prop doc/isCreating đổi, không phải setState tuỳ ý
    setIsEditing(isCreating);
    setTitle(doc?.title ?? "");
    setFormError(null);
    editor?.commands.setContent(doc?.content ?? "");
    editor?.setEditable(isCreating);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- chỉ chạy lại khi đổi doc/isCreating, không phải mỗi lần editor instance đổi
  }, [doc?.id, isCreating]);

  useEffect(() => {
    editor?.setEditable(isEditing);
  }, [isEditing, editor]);

  if (!editor) return null;

  const isSaving = isCreatingDoc || isUpdating;

  const handleSave = async () => {
    if (!title.trim()) {
      setFormError("Title is required");
      return;
    }
    setFormError(null);
    const content = editor.getJSON();
    try {
      if (isCreating) {
        const created = await createDoc({ workspaceId, title, content }).unwrap();
        onCreated(created.id);
      } else if (doc) {
        await updateDoc({ id: doc.id, workspaceId, title, content }).unwrap();
        setIsEditing(false);
      }
    } catch (error) {
      setFormError(getApiErrorMessage(error as never));
    }
  };

  const handleCancel = () => {
    if (isCreating) {
      onCancelCreate();
      return;
    }
    setTitle(doc?.title ?? "");
    editor.commands.setContent(doc?.content ?? "");
    setIsEditing(false);
    setFormError(null);
  };

  const handleDelete = async () => {
    if (!doc) return;
    if (!window.confirm(`Delete doc "${doc.title}"? This cannot be undone.`)) return;
    try {
      await deleteDoc({ id: doc.id, workspaceId }).unwrap();
      onDeleted();
    } catch (error) {
      setFormError(getApiErrorMessage(error as never));
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-start justify-between gap-3">
        {isEditing ? (
          <Input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Doc title"
            className="text-lg font-semibold"
            autoFocus
          />
        ) : (
          <div className="min-w-0">
            <h2 className="truncate text-lg font-semibold text-foreground">
              {doc?.title}
            </h2>
            {doc ? (
              <p className="mt-0.5 text-xs text-muted-foreground">
                {authorName ? `By ${authorName} · ` : ""}
                Updated {formatDateTime(doc.updatedAt)}
              </p>
            ) : null}
          </div>
        )}

        {!isEditing && canModify ? (
          <div className="flex shrink-0 gap-1.5">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => setIsEditing(true)}
            >
              <PencilIcon className="size-3.5" />
              Edit
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="gap-1.5 text-destructive hover:text-destructive"
              disabled={isDeleting}
              onClick={handleDelete}
            >
              <Trash2Icon className="size-3.5" />
              Delete
            </Button>
          </div>
        ) : null}
      </div>

      {formError ? <p className="text-sm text-destructive">{formError}</p> : null}

      <div>
        {isEditing ? <DocEditorToolbar editor={editor} /> : null}
        <EditorContent
          editor={editor}
          className={`doc-editor-content rounded-2xl border border-border/60 bg-card px-4 py-3 text-sm ${
            isEditing ? "rounded-t-none border-t-0" : ""
          }`}
        />
      </div>

      {isEditing ? (
        <div className="flex justify-end gap-2">
          <Button type="button" variant="ghost" size="sm" onClick={handleCancel}>
            <XIcon className="size-3.5" />
            Cancel
          </Button>
          <Button type="button" size="sm" disabled={isSaving} onClick={handleSave}>
            {isSaving ? "Saving..." : "Save"}
          </Button>
        </div>
      ) : null}
    </div>
  );
}
