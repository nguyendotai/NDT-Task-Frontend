"use client";

import { useEffect, useMemo, useState } from "react";
import { MoreHorizontalIcon } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { Textarea } from "@/shared/components/ui/textarea";
import { getApiErrorMessage } from "@/shared/utils/api-error";
import {
  useDeleteTaskMutation,
  useGetTaskQuery,
  useUpdateTaskMutation,
} from "@/features/task";
import { useListMembersQuery, type WorkspaceColumn } from "@/features/workspace";
import { TaskAttachmentsPanel } from "./task-attachments-panel";
import { TaskActivityPanel } from "./task-activity-panel";
import { TaskDetailsSidebar, type TaskDetailsPatch } from "./task-details-sidebar";

interface TaskDetailModalProps {
  workspaceId: string;
  taskId: string | null;
  columns: WorkspaceColumn[];
  onOpenChange: (open: boolean) => void;
}

export function TaskDetailModal({
  workspaceId,
  taskId,
  columns,
  onOpenChange,
}: TaskDetailModalProps) {
  const { data: task } = useGetTaskQuery(taskId ?? "", { skip: !taskId });
  const { data: members = [] } = useListMembersQuery(workspaceId, {
    skip: !taskId,
  });
  const [updateTask] = useUpdateTaskMutation();
  const [deleteTask] = useDeleteTaskMutation();

  const [titleDraft, setTitleDraft] = useState("");
  const [descriptionDraft, setDescriptionDraft] = useState("");

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTitleDraft(task?.title ?? "");
    setDescriptionDraft(task?.description ?? "");
  }, [task]);

  const memberNameById = useMemo(() => {
    const map = new Map<string, string>();
    for (const member of members) map.set(member.user.id, member.user.name);
    return map;
  }, [members]);

  if (!task) return null;

  const handlePatch = async (patch: TaskDetailsPatch) => {
    try {
      await updateTask({ id: task.id, workspaceId, ...patch }).unwrap();
    } catch (error) {
      window.alert(getApiErrorMessage(error as never));
    }
  };

  const handleTitleBlur = async () => {
    const value = titleDraft.trim();
    if (!value || value === task.title) return;
    try {
      await updateTask({ id: task.id, workspaceId, title: value }).unwrap();
    } catch (error) {
      window.alert(getApiErrorMessage(error as never));
    }
  };

  const handleDescriptionBlur = async () => {
    if (descriptionDraft === (task.description ?? "")) return;
    try {
      await updateTask({
        id: task.id,
        workspaceId,
        description: descriptionDraft,
      }).unwrap();
    } catch (error) {
      window.alert(getApiErrorMessage(error as never));
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Delete task "${task.title}"?`)) return;
    try {
      await deleteTask(task.id).unwrap();
      onOpenChange(false);
    } catch (error) {
      window.alert(getApiErrorMessage(error as never));
    }
  };

  return (
    <Dialog open={!!taskId} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[85vh] w-full max-w-5xl flex-col gap-0 overflow-hidden p-0 sm:max-w-5xl">
        <div className="flex items-center justify-between border-b border-border/60 px-5 py-3">
          <DialogTitle className="text-sm font-medium text-muted-foreground">
            Task
          </DialogTitle>
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button type="button" variant="ghost" size="icon-sm" className="mr-8">
                  <MoreHorizontalIcon className="size-4" />
                </Button>
              }
            />
            <DropdownMenuContent align="end">
              <DropdownMenuItem variant="destructive" onClick={handleDelete}>
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="grid flex-1 grid-cols-1 gap-6 overflow-y-auto px-5 py-4 sm:grid-cols-[1fr_280px]">
          <div className="flex min-w-0 flex-col gap-5">
            <textarea
              value={titleDraft}
              onChange={(event) => setTitleDraft(event.target.value)}
              onBlur={handleTitleBlur}
              rows={1}
              className="resize-none border-none bg-transparent font-heading text-2xl font-bold text-foreground outline-none"
            />

            <div className="flex flex-col gap-1.5">
              <p className="text-sm font-semibold text-foreground">Description</p>
              <Textarea
                placeholder="Add a description..."
                rows={4}
                value={descriptionDraft}
                onChange={(event) => setDescriptionDraft(event.target.value)}
                onBlur={handleDescriptionBlur}
              />
            </div>

            <TaskAttachmentsPanel taskId={task.id} />

            <TaskActivityPanel taskId={task.id} memberNameById={memberNameById} />
          </div>

          <TaskDetailsSidebar
            task={task}
            columns={columns}
            members={members}
            memberNameById={memberNameById}
            onChange={handlePatch}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
