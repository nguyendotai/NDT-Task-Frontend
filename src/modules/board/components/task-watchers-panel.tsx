"use client";

import { EyeIcon, XIcon } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { getApiErrorMessage } from "@/shared/utils/api-error";
import { useAppSelector } from "@/shared/hooks/use-app-selector";
import { selectCurrentUser } from "@/features/auth";
import {
  useAddWatcherMutation,
  useListWatchersQuery,
  useRemoveWatcherMutation,
} from "@/features/task";
import type { WorkspaceMember } from "@/features/workspace";

export function TaskWatchersPanel({
  taskId,
  members,
}: {
  taskId: string;
  members: WorkspaceMember[];
}) {
  const currentUser = useAppSelector(selectCurrentUser);
  const { data: watchers, isLoading } = useListWatchersQuery(taskId);
  const [addWatcher] = useAddWatcherMutation();
  const [removeWatcher] = useRemoveWatcherMutation();

  const currentMember = members.find((member) => member.user.id === currentUser?.id);
  const canManage = currentMember?.role === "OWNER" || currentMember?.role === "ADMIN";
  const watcherIds = new Set((watchers ?? []).map((watcher) => watcher.userId));
  const isSelfWatching = currentUser ? watcherIds.has(currentUser.id) : false;
  const memberNameById = new Map(members.map((member) => [member.user.id, member.user.name]));
  const addableMembers = members.filter((member) => !watcherIds.has(member.user.id));

  const handleToggleSelf = async () => {
    if (!currentUser) return;
    try {
      if (isSelfWatching) {
        await removeWatcher({ taskId, userId: currentUser.id }).unwrap();
      } else {
        await addWatcher({ taskId }).unwrap();
      }
    } catch (error) {
      window.alert(getApiErrorMessage(error as never));
    }
  };

  const handleAddMember = async (userId: string) => {
    try {
      await addWatcher({ taskId, userId }).unwrap();
    } catch (error) {
      window.alert(getApiErrorMessage(error as never));
    }
  };

  const handleRemoveMember = async (userId: string) => {
    try {
      await removeWatcher({ taskId, userId }).unwrap();
    } catch (error) {
      window.alert(getApiErrorMessage(error as never));
    }
  };

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
          <EyeIcon className="size-3.5" />
          Watchers
        </div>
        <Button type="button" variant="ghost" size="sm" onClick={handleToggleSelf}>
          {isSelfWatching ? "Unwatch" : "Watch"}
        </Button>
      </div>

      {isLoading ? (
        <div className="h-6 w-24 animate-pulse rounded-full bg-muted/50" />
      ) : watchers && watchers.length > 0 ? (
        <div className="flex flex-wrap gap-1.5">
          {watchers.map((watcher) => (
            <span
              key={watcher.userId}
              className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground"
            >
              {memberNameById.get(watcher.userId) ?? "Unknown"}
              {canManage || watcher.userId === currentUser?.id ? (
                <button
                  type="button"
                  aria-label={`Remove watcher ${memberNameById.get(watcher.userId) ?? ""}`}
                  onClick={() => handleRemoveMember(watcher.userId)}
                >
                  <XIcon className="size-3" />
                </button>
              ) : null}
            </span>
          ))}
        </div>
      ) : (
        <p className="text-xs text-muted-foreground">None</p>
      )}

      {canManage && addableMembers.length > 0 ? (
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button type="button" variant="outline" size="sm" className="self-start">
                Add watcher
              </Button>
            }
          />
          <DropdownMenuContent align="start">
            {addableMembers.map((member) => (
              <DropdownMenuItem
                key={member.user.id}
                onClick={() => handleAddMember(member.user.id)}
              >
                {member.user.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      ) : null}
    </div>
  );
}
