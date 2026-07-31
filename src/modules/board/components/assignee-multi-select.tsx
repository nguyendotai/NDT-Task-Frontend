"use client";

import { ChevronDownIcon } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { getInitials } from "@/shared/utils/initials";
import type { WorkspaceMember } from "@/features/workspace";

export function AssigneeMultiSelect({
  members,
  selectedIds,
  onChange,
}: {
  members: WorkspaceMember[];
  selectedIds: string[];
  onChange: (ids: string[]) => void;
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
                  <span
                    key={member.user.id}
                    title={member.user.name}
                    className="flex size-6 items-center justify-center rounded-full border-2 border-card bg-secondary text-[10px] font-semibold text-secondary-foreground"
                  >
                    {getInitials(member.user.name)}
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
        }
      />
      <DropdownMenuContent className="w-64">
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
