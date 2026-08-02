"use client";

import { ChevronDownIcon, UserPlusIcon } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { UserAvatar } from "@/features/auth";
import type { WorkspaceMember } from "@/features/workspace";

export function AssigneeMultiSelect({
  members,
  selectedIds,
  onChange,
  compact = false,
}: {
  members: WorkspaceMember[];
  selectedIds: string[];
  onChange: (ids: string[]) => void;
  // "compact" = icon-only trigger dùng cho Task Card (không cần label/chevron).
  compact?: boolean;
}) {
  const selectedMembers = members.filter((member) =>
    selectedIds.includes(member.user.id),
  );

  const toggle = (userId: string) => {
    onChange(
      selectedIds.includes(userId)
        ? selectedIds.filter((id) => id !== userId)
        : [...selectedIds, userId],
    );
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          compact ? (
            <button
              type="button"
              aria-label="Assign members"
              onClick={(event) => event.stopPropagation()}
              className="flex shrink-0 items-center rounded-full"
            >
              {selectedMembers.length === 0 ? (
                <span className="flex size-6 items-center justify-center rounded-full border border-dashed border-muted-foreground/50 text-muted-foreground hover:border-foreground hover:text-foreground">
                  <UserPlusIcon className="size-3.5" />
                </span>
              ) : (
                <span className="flex -space-x-2">
                  {selectedMembers.slice(0, 3).map((member) => (
                    <span key={member.user.id} title={member.user.name}>
                      <UserAvatar
                        name={member.user.name}
                        avatarUrl={member.user.avatarUrl ?? null}
                        className="size-6 border-2 border-card text-[10px]"
                      />
                    </span>
                  ))}
                  {selectedMembers.length > 3 ? (
                    <span className="flex size-6 items-center justify-center rounded-full border-2 border-card bg-muted text-[10px] font-semibold text-muted-foreground">
                      +{selectedMembers.length - 3}
                    </span>
                  ) : null}
                </span>
              )}
            </button>
          ) : (
            <Button
              type="button"
              variant="outline"
              className="w-full justify-between font-normal"
            >
              {selectedMembers.length === 0 ? (
                <span className="text-muted-foreground">Unassigned</span>
              ) : (
                <span className="flex -space-x-2">
                  {selectedMembers.slice(0, 4).map((member) => (
                    <span key={member.user.id} title={member.user.name}>
                      <UserAvatar
                        name={member.user.name}
                        avatarUrl={member.user.avatarUrl ?? null}
                        className="size-6 border-2 border-card text-[10px]"
                      />
                    </span>
                  ))}
                  {selectedMembers.length > 4 ? (
                    <span className="flex size-6 items-center justify-center rounded-full border-2 border-card bg-muted text-[10px] font-semibold text-muted-foreground">
                      +{selectedMembers.length - 4}
                    </span>
                  ) : null}
                </span>
              )}
              <ChevronDownIcon className="size-3.5 shrink-0 text-muted-foreground" />
            </Button>
          )
        }
      />
      <DropdownMenuContent className="w-64" onClick={(event) => event.stopPropagation()}>
        {members.map((member) => (
          <DropdownMenuCheckboxItem
            key={member.user.id}
            checked={selectedIds.includes(member.user.id)}
            onCheckedChange={() => toggle(member.user.id)}
          >
            {member.user.name}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
