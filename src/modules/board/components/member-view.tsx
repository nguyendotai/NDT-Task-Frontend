"use client";

import { useMemo, useState } from "react";
import { MoreHorizontalIcon, PlusIcon } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { useAppSelector } from "@/shared/hooks/use-app-selector";
import { selectCurrentUser, UserAvatar } from "@/features/auth";
import { usePresence } from "@/features/realtime";
import {
  useListInvitationsQuery,
  useListMembersQuery,
  useRemoveMemberMutation,
  useRevokeInvitationMutation,
  useUpdateMemberRoleMutation,
  type WorkspaceRole,
} from "@/features/workspace";
import { InviteMemberDialog } from "./invite-member-dialog";

export function MemberView({ workspaceId }: { workspaceId: string }) {
  const currentUser = useAppSelector(selectCurrentUser);
  const { data: members, isLoading } = useListMembersQuery(workspaceId);
  const onlineUserIds = usePresence(workspaceId);
  const [updateRole] = useUpdateMemberRoleMutation();
  const [removeMember] = useRemoveMemberMutation();
  const [isInviteOpen, setInviteOpen] = useState(false);

  const currentMember = useMemo(
    () => members?.find((member) => member.user.id === currentUser?.id),
    [members, currentUser],
  );
  const canManage =
    currentMember?.role === "OWNER" || currentMember?.role === "ADMIN";

  const { data: invitations } = useListInvitationsQuery(workspaceId, {
    skip: !canManage,
  });
  const [revokeInvitation] = useRevokeInvitationMutation();

  if (isLoading) {
    return (
      <div className="flex flex-col gap-2">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="h-14 animate-pulse rounded-xl bg-muted/50" />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {members?.length ?? 0} member{(members?.length ?? 0) === 1 ? "" : "s"}
        </p>
        {canManage ? (
          <Button
            type="button"
            size="sm"
            className="gap-1.5"
            onClick={() => setInviteOpen(true)}
          >
            <PlusIcon className="size-3.5" />
            Invite member
          </Button>
        ) : null}
      </div>

      <div className="flex flex-col gap-2">
        {members?.map((member) => {
          const isSelf = member.user.id === currentUser?.id;
          const canEditThisRow = canManage && member.role !== "OWNER" && !isSelf;
          return (
            <div
              key={member.id}
              className="flex items-center gap-3 rounded-xl border border-border/60 bg-card px-4 py-3"
            >
              <span className="relative shrink-0">
                <UserAvatar
                  name={member.user.name}
                  avatarUrl={member.user.avatarUrl ?? null}
                  className="size-8"
                />
                {onlineUserIds.has(member.user.id) ? (
                  <span
                    title="Online"
                    className="absolute right-0 bottom-0 size-2.5 rounded-full border-2 border-card bg-green-500"
                  />
                ) : null}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">
                  {member.user.name}
                  {isSelf ? " (you)" : ""}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {member.user.email}
                </p>
              </div>
              <Badge variant={member.role === "OWNER" ? "default" : "outline"}>
                {member.role}
              </Badge>
              {canEditThisRow ? (
                <DropdownMenu>
                  <DropdownMenuTrigger
                    render={
                      <Button type="button" variant="ghost" size="icon-sm">
                        <MoreHorizontalIcon />
                      </Button>
                    }
                  />
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() =>
                        updateRole({
                          workspaceId,
                          memberId: member.id,
                          role: (member.role === "ADMIN"
                            ? "MEMBER"
                            : "ADMIN") as WorkspaceRole,
                        })
                      }
                    >
                      Make {member.role === "ADMIN" ? "Member" : "Admin"}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      variant="destructive"
                      onClick={() => removeMember({ workspaceId, memberId: member.id })}
                    >
                      Remove from workspace
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : null}
            </div>
          );
        })}
      </div>

      {canManage && invitations && invitations.length > 0 ? (
        <div className="flex flex-col gap-2">
          <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            Pending invitations
          </p>
          {invitations.map((invitation) => (
            <div
              key={invitation.id}
              className="flex items-center gap-3 rounded-xl border border-dashed border-border/60 px-4 py-3"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm text-foreground">{invitation.email}</p>
                <p className="text-xs text-muted-foreground">Invited as {invitation.role}</p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() =>
                  revokeInvitation({ workspaceId, invitationId: invitation.id })
                }
              >
                Revoke
              </Button>
            </div>
          ))}
        </div>
      ) : null}

      <InviteMemberDialog
        workspaceId={workspaceId}
        open={isInviteOpen}
        onOpenChange={setInviteOpen}
      />
    </div>
  );
}
