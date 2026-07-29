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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { useGetWorkspaceBoardQuery, useListMembersQuery } from "@/features/workspace";
import {
  useDeleteTaskMutation,
  useListTasksByWorkspaceQuery,
  PRIORITY_BADGE_CLASS,
  PRIORITY_LABEL,
  STATUS_LABEL,
  type Task,
} from "@/features/task";
import { TaskFormDialog } from "./task-form-dialog";

export function ListView({ workspaceId }: { workspaceId: string }) {
  const { data: board } = useGetWorkspaceBoardQuery(workspaceId);
  const { data: tasks, isLoading } = useListTasksByWorkspaceQuery({ workspaceId });
  const { data: members } = useListMembersQuery(workspaceId);
  const [deleteTask] = useDeleteTaskMutation();

  const [isCreateOpen, setCreateOpen] = useState(false);
  const [editTask, setEditTask] = useState<Task | null>(null);

  const columnNameById = useMemo(() => {
    const map = new Map<string, string>();
    for (const column of board?.columns ?? []) map.set(column.id, column.name);
    return map;
  }, [board]);

  const assigneeNameById = useMemo(() => {
    const map = new Map<string, string>();
    for (const member of members ?? []) map.set(member.user.id, member.user.name);
    return map;
  }, [members]);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="h-10 animate-pulse rounded-lg bg-muted/50" />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-end">
        <Button type="button" size="sm" className="gap-1.5" onClick={() => setCreateOpen(true)}>
          <PlusIcon className="size-3.5" />
          New task
        </Button>
      </div>

      {!tasks || tasks.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-border/60 p-8 text-center text-sm text-muted-foreground">
          No tasks yet.
        </p>
      ) : (
        <div className="rounded-2xl border border-border/60">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Column</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Due date</TableHead>
                <TableHead>Assignee</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {tasks.map((task) => (
                <TableRow key={task.id} className="cursor-pointer" onClick={() => setEditTask(task)}>
                  <TableCell className="max-w-64 truncate font-medium text-foreground">
                    {task.title}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {columnNameById.get(task.columnId) ?? "—"}
                  </TableCell>
                  <TableCell>
                    <Badge className={PRIORITY_BADGE_CLASS[task.priority]} variant="outline">
                      {PRIORITY_LABEL[task.priority]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{STATUS_LABEL[task.status]}</Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "—"}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {task.assigneeId ? assigneeNameById.get(task.assigneeId) ?? "—" : "—"}
                  </TableCell>
                  <TableCell onClick={(event) => event.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        render={
                          <Button type="button" variant="ghost" size="icon-sm">
                            <MoreHorizontalIcon />
                          </Button>
                        }
                      />
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => setEditTask(task)}>Edit</DropdownMenuItem>
                        <DropdownMenuItem
                          variant="destructive"
                          onClick={() => deleteTask(task.id)}
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {board ? (
        <>
          <TaskFormDialog
            workspaceId={workspaceId}
            columns={board.columns}
            open={isCreateOpen}
            onOpenChange={setCreateOpen}
          />
          <TaskFormDialog
            workspaceId={workspaceId}
            columns={board.columns}
            open={editTask !== null}
            onOpenChange={(open) => !open && setEditTask(null)}
            task={editTask ?? undefined}
          />
        </>
      ) : null}
    </div>
  );
}
