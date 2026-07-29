"use client";

import { useMemo, useState } from "react";
import { DndContext, DragOverlay, type DragEndEvent, type DragStartEvent } from "@dnd-kit/core";
import { useGetWorkspaceBoardQuery, useListMembersQuery } from "@/features/workspace";
import {
  useListTasksByWorkspaceQuery,
  useUpdateTaskMutation,
  type Task,
} from "@/features/task";
import { BoardColumn } from "./board-column";
import { BoardTaskCard } from "./board-task-card";
import { TaskFormDialog } from "./task-form-dialog";

export function BoardView({ workspaceId }: { workspaceId: string }) {
  const { data: board, isLoading: isBoardLoading } = useGetWorkspaceBoardQuery(workspaceId);
  const { data: tasks, isLoading: isTasksLoading } = useListTasksByWorkspaceQuery({
    workspaceId,
  });
  const { data: members } = useListMembersQuery(workspaceId);
  const [updateTask] = useUpdateTaskMutation();

  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [createColumnId, setCreateColumnId] = useState<string | null>(null);
  const [editTask, setEditTask] = useState<Task | null>(null);

  const assigneeNameById = useMemo(() => {
    const map = new Map<string, string>();
    for (const member of members ?? []) map.set(member.user.id, member.user.name);
    return map;
  }, [members]);

  const tasksByColumn = useMemo(() => {
    const map = new Map<string, Task[]>();
    for (const task of tasks ?? []) {
      const list = map.get(task.columnId) ?? [];
      list.push(task);
      map.set(task.columnId, list);
    }
    return map;
  }, [tasks]);

  function handleDragStart(event: DragStartEvent) {
    setActiveTask((event.active.data.current?.task as Task | undefined) ?? null);
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveTask(null);
    const { active, over } = event;
    if (!over) return;
    const task = active.data.current?.task as Task | undefined;
    if (!task || task.columnId === over.id) return;
    updateTask({ id: task.id, workspaceId, columnId: String(over.id) });
  }

  if (isBoardLoading || isTasksLoading) {
    return (
      <div className="flex gap-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="h-64 w-72 shrink-0 animate-pulse rounded-2xl border border-border/60 bg-muted/50"
          />
        ))}
      </div>
    );
  }

  if (!board || board.columns.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-border/60 p-8 text-center text-sm text-muted-foreground">
        This Board has no columns yet.
      </p>
    );
  }

  return (
    <>
      <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {board.columns
            .slice()
            .sort((a, b) => a.order - b.order)
            .map((column) => (
              <BoardColumn
                key={column.id}
                column={column}
                tasks={tasksByColumn.get(column.id) ?? []}
                assigneeNameById={assigneeNameById}
                onAddTask={() => setCreateColumnId(column.id)}
                onTaskClick={(task) => setEditTask(task)}
              />
            ))}
        </div>

        <DragOverlay>
          {activeTask ? (
            <BoardTaskCard
              task={activeTask}
              assigneeName={
                activeTask.assigneeId ? assigneeNameById.get(activeTask.assigneeId) : undefined
              }
              onClick={() => {}}
            />
          ) : null}
        </DragOverlay>
      </DndContext>

      <TaskFormDialog
        workspaceId={workspaceId}
        columns={board.columns}
        open={createColumnId !== null}
        onOpenChange={(open) => !open && setCreateColumnId(null)}
        defaultColumnId={createColumnId ?? undefined}
      />

      <TaskFormDialog
        workspaceId={workspaceId}
        columns={board.columns}
        open={editTask !== null}
        onOpenChange={(open) => !open && setEditTask(null)}
        task={editTask ?? undefined}
      />
    </>
  );
}
