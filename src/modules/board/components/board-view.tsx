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
  filterTasks,
  EMPTY_TASK_FILTER_STATE,
  type Task,
  type TaskFilterState,
} from "@/features/task";
import { useListSprintsQuery } from "@/features/sprint";
import { AddColumnButton } from "./add-column-button";
import { BoardColumn } from "./board-column";
import { BoardTaskCard } from "./board-task-card";
import { TaskFilterBar } from "./task-filter-bar";
import { TaskFormDialog } from "./task-form-dialog";
import { TaskDetailModal } from "./task-detail-modal";

export function BoardView({
  workspaceId,
  isScrum = false,
  initialTaskId,
}: {
  workspaceId: string;
  isScrum?: boolean;
  initialTaskId?: string;
}) {
  const { data: board, isLoading: isBoardLoading } = useGetWorkspaceBoardQuery(workspaceId);
  // board.md #4: Scrum Board chỉ hiển thị Task thuộc Sprint đang Active —
  // Product Backlog (Task chưa vào Sprint) được quản lý riêng ở tab Sprint.
  const { data: sprints, isLoading: isSprintsLoading } = useListSprintsQuery(
    workspaceId,
    { skip: !isScrum },
  );
  const activeSprint = sprints?.find((sprint) => sprint.status === "ACTIVE");
  const { data: tasks, isLoading: isTasksLoading } = useListTasksByWorkspaceQuery(
    { workspaceId, sprintId: activeSprint?.id },
    { skip: isScrum && !activeSprint },
  );
  const { data: members } = useListMembersQuery(workspaceId);
  const [updateTask] = useUpdateTaskMutation();
  const [reorderColumns] = useReorderColumnsMutation();
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }));

  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [activeColumn, setActiveColumn] = useState<WorkspaceColumn | null>(null);
  const [createColumnId, setCreateColumnId] = useState<string | null>(null);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(initialTaskId ?? null);
  const [searchTerm, setSearchTerm] = useState("");
  const [taskFilters, setTaskFilters] = useState<TaskFilterState>(EMPTY_TASK_FILTER_STATE);

  const columns = useMemo(
    () => (board?.columns ?? []).slice().sort((a, b) => a.order - b.order),
    [board],
  );
  const columnIds = useMemo(() => columns.map((column) => column.id), [columns]);

  const filteredTasks = useMemo(
    () => filterTasks(tasks ?? [], searchTerm, taskFilters),
    [tasks, searchTerm, taskFilters],
  );

  const tasksByColumn = useMemo(() => {
    const map = new Map<string, Task[]>();
    for (const task of filteredTasks) {
      const list = map.get(task.columnId) ?? [];
      list.push(task);
      map.set(task.columnId, list);
    }
    for (const list of map.values()) list.sort((a, b) => a.order - b.order);
    return map;
  }, [filteredTasks]);

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
        sprintId: activeSprint?.id,
        columnId: destinationColumnId,
        order: destinationOrder,
      });
    }
  }

  if (isBoardLoading || isTasksLoading || (isScrum && isSprintsLoading)) {
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

  if (isScrum && !activeSprint) {
    return (
      <p className="rounded-2xl border border-dashed border-border/60 p-8 text-center text-sm text-muted-foreground">
        No active Sprint. Start a Planned Sprint in the Sprint tab to see its
        tasks here.
      </p>
    );
  }

  return (
    <>
      <div className="mb-3">
        <TaskFilterBar
          searchTerm={searchTerm}
          onSearchTermChange={setSearchTerm}
          filters={taskFilters}
          onFiltersChange={setTaskFilters}
          columns={columns}
          members={members ?? []}
        />
      </div>

      <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="flex gap-3 overflow-x-auto pb-2">
          <SortableContext items={columnIds} strategy={horizontalListSortingStrategy}>
            {columns.map((column) => (
              <BoardColumn
                key={column.id}
                workspaceId={workspaceId}
                column={column}
                columns={columns}
                tasks={tasksByColumn.get(column.id) ?? []}
                members={members ?? []}
                onAddTask={() => setCreateColumnId(column.id)}
                onTaskClick={(task) => setSelectedTaskId(task.id)}
              />
            ))}
          </SortableContext>
          <AddColumnButton workspaceId={workspaceId} />
        </div>

        <DragOverlay>
          {activeTask ? (
            <BoardTaskCard
              task={activeTask}
              workspaceId={workspaceId}
              columns={columns}
              members={members ?? []}
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

      <TaskDetailModal
        workspaceId={workspaceId}
        taskId={selectedTaskId}
        columns={columns}
        onOpenChange={(open) => !open && setSelectedTaskId(null)}
      />
    </>
  );
}
