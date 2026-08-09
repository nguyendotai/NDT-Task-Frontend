"use client";

import { useState } from "react";
import {
  CheckSquareIcon,
  Columns3Icon,
  FileTextIcon,
  FolderKanbanIcon,
  HistoryIcon,
  MessageSquareIcon,
  PaperclipIcon,
  UsersIcon,
  ZapIcon,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { useListWorkspaceActivityQuery } from "@/features/activity";
import { useListMembersQuery } from "@/features/workspace";

const PAGE_SIZE = 50;

// Nhãn hiển thị cho từng action — mirror đúng pattern ACTION_LABELS đã có ở
// task-activity-panel.tsx, mở rộng đủ cho toàn bộ action ghi Activity Log
// trên mọi module (không chỉ Task).
const ACTION_LABELS: Record<string, string> = {
  "workspace.created": "created the Workspace",
  "workspace.updated": "updated the Workspace",
  "workspace.deleted": "archived the Workspace",
  "workspace.restored": "restored the Workspace",
  "workspace.owner_changed": "transferred ownership",
  "member.invited": "invited a member",
  "member.joined": "joined the Workspace",
  "member.left": "left the Workspace",
  "member.removed": "removed a member",
  "member.role_changed": "changed a member's role",
  "member.invitation_revoked": "revoked an invitation",
  "member.invitation_rejected": "rejected an invitation",
  "column.created": "created a Column",
  "column.updated": "renamed a Column",
  "column.deleted": "deleted a Column",
  "column.moved": "reordered Columns",
  "task.created": "created a Task",
  "task.updated": "updated a Task",
  "task.moved": "moved a Task",
  "task.deleted": "archived a Task",
  "task.restored": "restored a Task",
  "task.label_added": "added a Label to a Task",
  "task.label_updated": "updated a Label",
  "task.label_removed": "removed a Label",
  "task.watcher_added": "added a Watcher",
  "task.watcher_removed": "removed a Watcher",
  "checklist.created": "added a checklist item",
  "checklist.updated": "updated a checklist item",
  "checklist.completed": "completed a checklist item",
  "checklist.reopened": "reopened a checklist item",
  "checklist.moved": "reordered checklist items",
  "checklist.deleted": "deleted a checklist item",
  "comment.created": "commented on a Task",
  "comment.updated": "edited a comment",
  "comment.deleted": "deleted a comment",
  "comment.mentioned": "mentioned someone",
  "attachment.uploaded": "uploaded an attachment",
  "attachment.renamed": "renamed an attachment",
  "attachment.deleted": "deleted an attachment",
  "sprint.created": "created a Sprint",
  "sprint.updated": "updated a Sprint",
  "sprint.started": "started a Sprint",
  "sprint.completed": "completed a Sprint",
  "sprint.task_added": "added a Task to a Sprint",
  "sprint.task_removed": "removed a Task from a Sprint",
  "doc.created": "created a Doc",
  "doc.updated": "updated a Doc",
  "doc.deleted": "deleted a Doc",
};

const ENTITY_ICON: Record<string, typeof FolderKanbanIcon> = {
  Workspace: FolderKanbanIcon,
  Member: UsersIcon,
  Column: Columns3Icon,
  Task: CheckSquareIcon,
  Checklist: CheckSquareIcon,
  Comment: MessageSquareIcon,
  Attachment: PaperclipIcon,
  Sprint: ZapIcon,
  Doc: FileTextIcon,
};

function formatDateTime(value: string): string {
  return new Date(value).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export function WorkspaceActivityView({ workspaceId }: { workspaceId: string }) {
  const [limit, setLimit] = useState(PAGE_SIZE);
  const { data: entries, isLoading, isFetching } = useListWorkspaceActivityQuery({
    workspaceId,
    limit,
    offset: 0,
  });
  const { data: members } = useListMembersQuery(workspaceId);

  const memberNameById = new Map(
    (members ?? []).map((member) => [member.user.id, member.user.name]),
  );

  if (isLoading) {
    return (
      <div className="flex flex-col gap-2">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="h-12 animate-pulse rounded-xl bg-muted/50" />
        ))}
      </div>
    );
  }

  if (!entries || entries.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-border/60 p-12 text-center">
        <HistoryIcon className="size-8 text-muted-foreground" />
        <p className="text-sm font-medium text-foreground">No activity yet</p>
        <p className="max-w-sm text-xs text-muted-foreground">
          Every change made in this Workspace will show up here.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-2">
        {entries.map((entry) => {
          const Icon = ENTITY_ICON[entry.entityType] ?? HistoryIcon;
          const label = ACTION_LABELS[entry.action] ?? entry.action;
          const actorName = memberNameById.get(entry.actorId) ?? "Someone";
          return (
            <div
              key={entry.id}
              className="flex items-start gap-3 rounded-xl border border-border/60 bg-card px-3 py-2.5"
            >
              <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-md bg-muted">
                <Icon className="size-3.5 text-muted-foreground" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm text-foreground">
                  <span className="font-medium">{actorName}</span> {label}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {formatDateTime(entry.createdAt)}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {entries.length === limit ? (
        <div className="flex justify-center">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={isFetching}
            onClick={() => setLimit((prev) => prev + PAGE_SIZE)}
          >
            {isFetching ? "Loading..." : "Load more"}
          </Button>
        </div>
      ) : null}
    </div>
  );
}
