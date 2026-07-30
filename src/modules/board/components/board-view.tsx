"use client";

import { useMemo, useState } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  useGetWorkspaceBoardQuery,
  useListMembersQuery,
  useReorderColumnsMutation,
  type WorkspaceColumn,
} from "@/features/workspace";
import {
  useListTasksByWorkspaceQuery,
  useUpdateTaskMutation,
  type Task,
} from "@/features/task";
import { AddColumnButton } from "./add-column-button";
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
  const [reorderColumns] = useReorderColumnsMutation();
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }));

  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [activeColumn, setActiveColumn] = useState<WorkspaceColumn | null>(null);
  const [createColumnId, setCreateColumnId] = useState<string | null>(null);
  const [editTask, setEditTask] = useState<Task | null>(null);

  const columns = useMemo(
    () => (board?.columns ?? []).slice().sort((a, b) => a.order - b.order),
    [board],
  );
  const columnIds = useMemo(() => columns.map((column) => column.id), [columns]);

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
    for (const list of map.values()) list.sort((a, b) => a.order - b.order);
    return map;
  }, [tasks]);

  function handleDragStart(event: DragStartEvent) {
    const data = event.active.data.current;
    if (data?.type === "column") {
      setActiveColumn((data.column as WorkspaceColumn) ?? null);
    } else if (data?.type === "task") {
      setActiveTask((data.task as Task) ?? null);
    }
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveTask(null);
    setActiveColumn(null);
    if (!over || active.id === over.id) return;

    const activeData = active.data.current;
    const overData = over.data.current;

    if (activeData?.type === "column") {
      const oldIndex = columns.findIndex((column) => column.id === active.id);
      const newIndex = columns.findIndex((column) => column.id === over.id);
      if (oldIndex === -1 || newIndex === -1) return;
      const reordered = arrayMove(columns, oldIndex, newIndex);
      reorderColumns({ workspaceId, orderedColumnIds: reordered.map((column) => column.id) });
      return;
    }

    if (activeData?.type === "task") {
      const task = activeData.task as Task;
      let destinationColumnId: string;
      let destinationOrder: number;

      if (overData?.type === "task") {
        const overTask = overData.task as Task;
        destinationColumnId = overTask.columnId;
        const destinationTasks = tasksByColumn.get(destinationColumnId) ?? [];
        destinationOrder = destinationTasks.findIndex((item) => item.id === overTask.id);
      } else {
        destinationColumnId = String(over.id);
        destinationOrder = (tasksByColumn.get(destinationColumnId) ?? []).length;
      }

      if (destinationColumnId === task.columnId && destinationOrder === task.order) return;
      updateTask({
        id: task.id,
        workspaceId,
        columnId: destinationColumnId,
        order: destinationOrder,
      });
    }
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

  if (!board) {
    return (
      <p className="rounded-2xl border border-dashed border-border/60 p-8 text-center text-sm text-muted-foreground">
        This Board has no columns yet.
      </p>
    );
  }

  return (
    <>
      <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="flex gap-3 overflow-x-auto pb-2">
          <SortableContext items={columnIds} strategy={horizontalListSortingStrategy}>
            {columns.map((column) => (
              <BoardColumn
                key={column.id}
                column={column}
                tasks={tasksByColumn.get(column.id) ?? []}
                assigneeNameById={assigneeNameById}
                onAddTask={() => setCreateColumnId(column.id)}
                onTaskClick={(task) => setEditTask(task)}
              />
            ))}
          </SortableContext>
          <AddColumnButton workspaceId={workspaceId} />
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
          {activeColumn ? (
            <div className="h-[calc(100vh-22rem)] min-h-[560px] w-72 rounded-2xl border border-border/60 bg-muted/60 opacity-80" />
          ) : null}
        </DragOverlay>
      </DndContext>

      <TaskFormDialog
        workspaceId={workspaceId}
        columns={columns}
        open={createColumnId !== null}
        onOpenChange={(open) => !open && setCreateColumnId(null)}
        defaultColumnId={createColumnId ?? undefined}
      />

      <TaskFormDialog
        workspaceId={workspaceId}
        columns={columns}
        open={editTask !== null}
        onOpenChange={(open) => !open && setEditTask(null)}
        task={editTask ?? undefined}
      />
    </>
  );
}
