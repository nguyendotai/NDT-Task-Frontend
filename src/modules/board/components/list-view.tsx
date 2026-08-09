"use client";

import { useMemo, useState } from "react";
import { DownloadIcon, MoreHorizontalIcon, PlusIcon } from "lucide-react";
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
  TYPE_BADGE_CLASS,
  TYPE_LABEL,
  getTaskKey,
  filterTasks,
  tasksToCsv,
  downloadCsv,
  EMPTY_TASK_FILTER_STATE,
  type TaskFilterState,
} from "@/features/task";
import { TaskFilterBar } from "./task-filter-bar";
import { TaskFormDialog } from "./task-form-dialog";
import { TaskDetailModal } from "./task-detail-modal";

export function ListView({ workspaceId }: { workspaceId: string }) {
  const { data: board } = useGetWorkspaceBoardQuery(workspaceId);
  const { data: tasks, isLoading } = useListTasksByWorkspaceQuery({ workspaceId });
  const { data: members } = useListMembersQuery(workspaceId);
  const [deleteTask] = useDeleteTaskMutation();

  const [isCreateOpen, setCreateOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [taskFilters, setTaskFilters] = useState<TaskFilterState>(EMPTY_TASK_FILTER_STATE);

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

  const filteredTasks = useMemo(
    () => filterTasks(tasks ?? [], searchTerm, taskFilters),
    [tasks, searchTerm, taskFilters],
  );

  const handleExportCsv = () => {
    const csv = tasksToCsv(filteredTasks, {
      columnNameById,
      assigneeNameById,
    });
    downloadCsv(csv, `tasks-${new Date().toISOString().slice(0, 10)}.csv`);
  };

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
      <div className="flex items-center justify-between gap-2">
        <TaskFilterBar
          searchTerm={searchTerm}
          onSearchTermChange={setSearchTerm}
          filters={taskFilters}
          onFiltersChange={setTaskFilters}
          columns={board?.columns ?? []}
          members={members ?? []}
        />
        <div className="flex shrink-0 gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="gap-1.5"
            disabled={filteredTasks.length === 0}
            onClick={handleExportCsv}
          >
            <DownloadIcon className="size-3.5" />
            Export CSV
          </Button>
          <Button type="button" size="sm" className="gap-1.5" onClick={() => setCreateOpen(true)}>
            <PlusIcon className="size-3.5" />
            New task
          </Button>
        </div>
      </div>

      {!tasks || tasks.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-border/60 p-8 text-center text-sm text-muted-foreground">
          No tasks yet.
        </p>
      ) : filteredTasks.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-border/60 p-8 text-center text-sm text-muted-foreground">
          No tasks match your search/filter.
        </p>
      ) : (
        <div className="rounded-2xl border border-border/60">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Key</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Column</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Due date</TableHead>
                <TableHead>Assignee</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTasks.map((task) => (
                <TableRow key={task.id} className="cursor-pointer" onClick={() => setSelectedTaskId(task.id)}>
                  <TableCell className="text-muted-foreground">{getTaskKey(task)}</TableCell>
                  <TableCell className="max-w-64 truncate font-medium text-foreground">
                    {task.title}
                  </TableCell>
                  <TableCell>
                    <Badge className={TYPE_BADGE_CLASS[task.type]} variant="outline">
                      {TYPE_LABEL[task.type]}
                    </Badge>
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
                    <Badge variant="secondary">{task.status}</Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "—"}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {task.assigneeIds.length > 0
                      ? task.assigneeIds
                          .map((id) => assigneeNameById.get(id))
                          .filter((name): name is string => !!name)
                          .join(", ") || "—"
                      : "—"}
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
                        <DropdownMenuItem onClick={() => setSelectedTaskId(task.id)}>
                          Edit
                        </DropdownMenuItem>
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
          <TaskDetailModal
            workspaceId={workspaceId}
            taskId={selectedTaskId}
            columns={board.columns}
            onOpenChange={(open) => !open && setSelectedTaskId(null)}
          />
        </>
      ) : null}
    </div>
  );
}
