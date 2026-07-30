"use client";

import { useState } from "react";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { Textarea } from "@/shared/components/ui/textarea";
import { useAppSelector } from "@/shared/hooks/use-app-selector";
import { selectCurrentUser } from "@/features/auth";
import { getInitials } from "@/shared/utils/initials";
import { getApiErrorMessage } from "@/shared/utils/api-error";
import {
  useCreateCommentMutation,
  useDeleteCommentMutation,
  useListCommentsQuery,
  useUpdateCommentMutation,
} from "@/features/comment";
import { useListTaskActivityQuery } from "@/features/task";

function formatDateTime(value: string): string {
  return new Date(value).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

// activity-log.md #4.5/#4.8/#4.9 — nhãn hiển thị cho tab History.
const ACTION_LABELS: Record<string, string> = {
  "task.created": "created this task",
  "task.updated": "updated this task",
  "task.moved": "moved this task",
  "task.deleted": "deleted this task",
  "task.restored": "restored this task",
  "comment.created": "commented",
  "comment.updated": "edited a comment",
  "comment.deleted": "deleted a comment",
  "comment.mentioned": "mentioned someone",
  "attachment.uploaded": "uploaded an attachment",
  "attachment.deleted": "deleted an attachment",
};

function humanizeAction(action: string): string {
  return ACTION_LABELS[action] ?? action;
}

export function TaskActivityPanel({
  taskId,
  memberNameById,
}: {
  taskId: string;
  memberNameById: Map<string, string>;
}) {
  const currentUser = useAppSelector(selectCurrentUser);
  const { data: comments, isLoading: isCommentsLoading } =
    useListCommentsQuery(taskId);
  const { data: activity, isLoading: isActivityLoading } =
    useListTaskActivityQuery(taskId);
  const [createComment, { isLoading: isPosting }] = useCreateCommentMutation();
  const [updateComment] = useUpdateCommentMutation();
  const [deleteComment] = useDeleteCommentMutation();

  const [draft, setDraft] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState("");

  const handleSubmit = async () => {
    if (!draft.trim()) return;
    try {
      await createComment({ taskId, content: draft.trim() }).unwrap();
      setDraft("");
    } catch (error) {
      window.alert(getApiErrorMessage(error as never));
    }
  };

  const handleUpdate = async (id: string) => {
    if (!editDraft.trim()) return;
    try {
      await updateComment({ id, taskId, content: editDraft.trim() }).unwrap();
      setEditingId(null);
    } catch (error) {
      window.alert(getApiErrorMessage(error as never));
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this comment?")) return;
    try {
      await deleteComment({ id, taskId }).unwrap();
    } catch (error) {
      window.alert(getApiErrorMessage(error as never));
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-sm font-semibold text-foreground">Activity</h3>
      <Tabs defaultValue="comments">
        <TabsList className="h-auto gap-0.5 rounded-full bg-muted p-1">
          <TabsTrigger
            value="comments"
            className="rounded-full px-3 py-1.5 text-xs data-active:shadow-sm"
          >
            Comments
          </TabsTrigger>
          <TabsTrigger
            value="history"
            className="rounded-full px-3 py-1.5 text-xs data-active:shadow-sm"
          >
            History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="comments" className="mt-3 flex flex-col gap-3">
          <div className="flex gap-2">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-semibold text-secondary-foreground">
              {getInitials(currentUser?.name ?? "?")}
            </span>
            <div className="flex flex-1 flex-col gap-2">
              <Textarea
                placeholder="Add a comment... (@ to mention)"
                rows={2}
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    handleSubmit();
                  }
                }}
              />
              {draft ? (
                <Button
                  type="button"
                  size="sm"
                  className="self-end"
                  disabled={isPosting}
                  onClick={handleSubmit}
                >
                  Comment
                </Button>
              ) : null}
            </div>
          </div>

          {isCommentsLoading ? (
            <div className="h-16 animate-pulse rounded-xl bg-muted/50" />
          ) : !comments || comments.length === 0 ? (
            <p className="text-sm text-muted-foreground">No comments yet.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {comments.map((comment) => {
                const authorName =
                  memberNameById.get(comment.authorId) ?? "Unknown";
                const canModify = comment.authorId === currentUser?.id;
                return (
                  <div key={comment.id} className="flex gap-2">
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-semibold text-secondary-foreground">
                      {getInitials(authorName)}
                    </span>
                    <div className="min-w-0 flex-1 rounded-xl border border-border/60 bg-background/50 p-2.5">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-baseline gap-2">
                          <span className="text-sm font-medium text-foreground">
                            {authorName}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {formatDateTime(comment.createdAt)}
                          </span>
                        </div>
                        {canModify ? (
                          <div className="flex shrink-0 gap-2">
                            <button
                              type="button"
                              className="text-xs text-muted-foreground hover:text-foreground"
                              onClick={() => {
                                setEditingId(comment.id);
                                setEditDraft(comment.content);
                              }}
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              className="text-xs text-muted-foreground hover:text-destructive"
                              onClick={() => handleDelete(comment.id)}
                            >
                              Delete
                            </button>
                          </div>
                        ) : null}
                      </div>
                      {editingId === comment.id ? (
                        <div className="mt-2 flex flex-col gap-2">
                          <Textarea
                            rows={2}
                            value={editDraft}
                            onChange={(event) => setEditDraft(event.target.value)}
                          />
                          <div className="flex justify-end gap-2">
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => setEditingId(null)}
                            >
                              Cancel
                            </Button>
                            <Button
                              type="button"
                              size="sm"
                              onClick={() => handleUpdate(comment.id)}
                            >
                              Save
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <p className="mt-1 whitespace-pre-wrap text-sm text-foreground">
                          {comment.content}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="history" className="mt-3">
          {isActivityLoading ? (
            <div className="h-16 animate-pulse rounded-xl bg-muted/50" />
          ) : !activity || activity.length === 0 ? (
            <p className="text-sm text-muted-foreground">No history yet.</p>
          ) : (
            <div className="flex flex-col gap-2">
              {activity.map((entry) => (
                <div key={entry.id} className="flex items-center gap-2 text-sm">
                  <Badge variant="secondary" className="shrink-0 text-[10px]">
                    {formatDateTime(entry.createdAt)}
                  </Badge>
                  <span className="text-muted-foreground">
                    <span className="font-medium text-foreground">
                      {memberNameById.get(entry.actorId) ?? "Someone"}
                    </span>{" "}
                    {humanizeAction(entry.action)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
