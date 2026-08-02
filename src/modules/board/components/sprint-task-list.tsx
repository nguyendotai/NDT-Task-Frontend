"use client";

import { useDraggable, useDroppable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { getApiErrorMessage } from "@/shared/utils/api-error";
import {
  PRIORITY_BADGE_CLASS,
  PRIORITY_LABEL,
  useListTasksByWorkspaceQuery,
  type Task,
} from "@/features/task";
import { useRemoveSprintTaskMutation } from "@/features/sprint";
import type { WorkspaceColumn } from "@/features/workspace";

interface SprintTaskListProps {
  workspaceId: string;
  sprintId: string;
  columns: WorkspaceColumn[];
  canManage: boolean;
  // Kéo-thả Task giữa Product Backlog và các Sprint Planned (xem SprintView —
  // nơi giữ DndContext dùng chung). false = danh sách chỉ đọc (Active Sprint).
  interactive: boolean;
}

function DraggableTaskRow({
  task,
  sourceSprintId,
  columnName,
  canRemove,
  onRemove,
}: {
  task: Task;
  sourceSprintId: string;
  columnName: string;
  canRemove: boolean;
  onRemove: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.id,
    data: { task, sourceSprintId },
  });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Translate.toString(transform),
        // Không transition khi đang kéo (theo pointer tức thời, tránh lag) —
        // chỉ ease lúc thả/hủy để trở về vị trí gốc mượt như Board Kanban
        // (useSortable ở đó tự có transition, useDraggable thuần thì không).
        transition: isDragging ? undefined : "transform 200ms ease",
      }}
      className={
        "flex flex-wrap items-center justify-between gap-2 rounded-xl border border-border/60 bg-background/50 px-3 py-2 transition-opacity " +
        (isDragging ? "opacity-40" : "opacity-100")
      }
    >
      <div
        className="min-w-0 flex-1 cursor-grab active:cursor-grabbing"
        {...listeners}
        {...attributes}
      >
        <p className="truncate text-sm font-medium text-foreground">{task.title}</p>
        <div className="mt-1 flex flex-wrap items-center gap-1.5">
          <Badge className={PRIORITY_BADGE_CLASS[task.priority]} variant="outline">
            {PRIORITY_LABEL[task.priority]}
          </Badge>
          <span className="text-xs text-muted-foreground">{columnName}</span>
        </div>
      </div>
      {canRemove ? (
        <Button type="button" variant="ghost" size="sm" onClick={onRemove}>
          Remove
        </Button>
      ) : null}
    </div>
  );
}

export function SprintTaskList({
  workspaceId,
  sprintId,
  columns,
  canManage,
  interactive,
}: SprintTaskListProps) {
  const { data: tasks, isLoading } = useListTasksByWorkspaceQuery({
    workspaceId,
    sprintId,
  });
  const [removeSprintTask] = useRemoveSprintTaskMutation();
  const { setNodeRef: setDroppableRef, isOver } = useDroppable({ id: sprintId });

  const columnNameById = new Map(
    columns.map((column) => [column.id, column.name]),
  );

  const handleRemove = async (taskId: string) => {
    try {
      await removeSprintTask({ sprintId, taskId }).unwrap();
    } catch (error) {
      window.alert(getApiErrorMessage(error as never));
    }
  };

  return (
    <div
      ref={interactive ? setDroppableRef : undefined}
      className={
        "flex min-h-16 flex-col gap-2 rounded-xl transition-colors " +
        (interactive && isOver ? "bg-primary/5 ring-2 ring-primary/30" : "")
      }
    >
      {isLoading ? (
        <div className="h-16 animate-pulse rounded-xl bg-muted/50" />
      ) : !tasks || tasks.length === 0 ? (
        <p className="px-1 py-2 text-sm text-muted-foreground">No tasks.</p>
      ) : (
        tasks.map((task) =>
          interactive ? (
            <DraggableTaskRow
              key={task.id}
              task={task}
              sourceSprintId={sprintId}
              columnName={columnNameById.get(task.columnId) ?? task.status}
              canRemove={canManage && sprintId !== "backlog"}
              onRemove={() => handleRemove(task.id)}
            />
          ) : (
            <div
              key={task.id}
              className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-border/60 bg-background/50 px-3 py-2"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">
                  {task.title}
                </p>
                <div className="mt-1 flex flex-wrap items-center gap-1.5">
                  <Badge className={PRIORITY_BADGE_CLASS[task.priority]} variant="outline">
                    {PRIORITY_LABEL[task.priority]}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {columnNameById.get(task.columnId) ?? task.status}
                  </span>
                </div>
              </div>
            </div>
          ),
        )
      )}
    </div>
  );
}
