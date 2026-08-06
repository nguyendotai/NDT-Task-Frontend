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
import { PlusIcon } from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { useAppDispatch } from "@/shared/hooks/use-app-dispatch";
import { useAppSelector } from "@/shared/hooks/use-app-selector";
import { selectCurrentUser } from "@/features/auth";
import { useGetWorkspaceBoardQuery, useListMembersQuery } from "@/features/workspace";
import {
  useAddSprintTaskMutation,
  useCompleteSprintMutation,
  useListSprintsQuery,
  useRemoveSprintTaskMutation,
  useStartSprintMutation,
  type Sprint,
} from "@/features/sprint";
import { PRIORITY_BADGE_CLASS, PRIORITY_LABEL, taskApi, type Task } from "@/features/task";
import { getApiErrorMessage } from "@/shared/utils/api-error";
import { SprintFormDialog } from "./sprint-form-dialog";
import { SprintTaskList } from "./sprint-task-list";
import { TaskFormDialog } from "./task-form-dialog";

function formatDate(value: string) {
  return new Date(value).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function SprintView({ workspaceId }: { workspaceId: string }) {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(selectCurrentUser);
  const { data: members } = useListMembersQuery(workspaceId);
  const { data: board } = useGetWorkspaceBoardQuery(workspaceId);
  const { data: sprints, isLoading } = useListSprintsQuery(workspaceId);
  const [startSprint] = useStartSprintMutation();
  const [completeSprint] = useCompleteSprintMutation();
  const [addSprintTask] = useAddSprintTaskMutation();
  const [removeSprintTask] = useRemoveSprintTaskMutation();
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }));

  const [isCreateOpen, setCreateOpen] = useState(false);
  const [editSprint, setEditSprint] = useState<Sprint | null>(null);
  const [isCreateTaskOpen, setCreateTaskOpen] = useState(false);
  const [isCreateActiveSprintTaskOpen, setCreateActiveSprintTaskOpen] = useState(false);
  const [activeDragTask, setActiveDragTask] = useState<Task | null>(null);

  const currentMember = useMemo(
    () => members?.find((member) => member.user.id === currentUser?.id),
    [members, currentUser],
  );
  const canManage = currentMember?.role === "OWNER" || currentMember?.role === "ADMIN";
  const columns = useMemo(() => board?.columns ?? [], [board]);

  const activeSprint = sprints?.find((sprint) => sprint.status === "ACTIVE");
  const plannedSprints = sprints?.filter((sprint) => sprint.status === "PLANNED") ?? [];
  const completedSprints = sprints?.filter((sprint) => sprint.status === "COMPLETED") ?? [];

  const handleStart = async (sprintId: string) => {
    try {
      await startSprint(sprintId).unwrap();
    } catch (error) {
      window.alert(getApiErrorMessage(error as never));
    }
  };

  const handleComplete = async (sprintId: string) => {
    if (
      !window.confirm(
        "Complete this Sprint? Unfinished tasks will move back to the Product Backlog.",
      )
    ) {
      return;
    }
    try {
      await completeSprint(sprintId).unwrap();
    } catch (error) {
      window.alert(getApiErrorMessage(error as never));
    }
  };

  function handleDragStart(event: DragStartEvent) {
    const data = event.active.data.current as { task: Task } | undefined;
    setActiveDragTask(data?.task ?? null);
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveDragTask(null);
    if (!over) return;

    const data = active.data.current as
      | { task: Task; sourceSprintId: string }
      | undefined;
    if (!data) return;

    const { task } = data;
    const sourceSprintId = data.sourceSprintId;
    const targetSprintId = String(over.id);
    if (sourceSprintId === targetSprintId) return;

    // Patch cache ngay lúc thả (list nguồn/đích, kể cả "backlog" — không có
    // API riêng cho backlog nên phải tự cập nhật tay) thay vì đợi API rồi để
    // tag "Task" dùng chung kích hoạt refetch toàn bộ Active/Planned/Backlog
    // cùng lúc — đó là nguyên nhân kéo-thả bị delay và "rerender" cả những
    // section không liên quan tới lần kéo này.
    const patches = [
      dispatch(
        taskApi.util.updateQueryData(
          "listTasksByWorkspace",
          { workspaceId, sprintId: sourceSprintId },
          (draft) => {
            const index = draft.findIndex((item) => item.id === task.id);
            if (index !== -1) draft.splice(index, 1);
          },
        ),
      ),
      dispatch(
        taskApi.util.updateQueryData(
          "listTasksByWorkspace",
          { workspaceId, sprintId: targetSprintId },
          (draft) => {
            if (!draft.some((item) => item.id === task.id)) draft.push(task);
          },
        ),
      ),
    ];

    try {
      // sprint.md #5.6/#5.7: chỉ Add/Remove được khi Sprint đích/nguồn đang
      // Planned — Backend tự chặn nếu vi phạm (Active/Completed sẽ báo lỗi).
      if (sourceSprintId !== "backlog") {
        await removeSprintTask({ sprintId: sourceSprintId, taskId: task.id }).unwrap();
      }
      if (targetSprintId !== "backlog") {
        await addSprintTask({ sprintId: targetSprintId, taskId: task.id }).unwrap();
      }
    } catch (error) {
      patches.forEach((patch) => patch.undo());
      window.alert(getApiErrorMessage(error as never));
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3">
        {Array.from({ length: 2 }).map((_, index) => (
          <div
            key={index}
            className="h-28 animate-pulse rounded-2xl border border-border/60 bg-muted/50"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-lg font-semibold">Sprints</h2>
        {canManage ? (
          <Button
            type="button"
            size="sm"
            className="gap-1.5"
            onClick={() => setCreateOpen(true)}
          >
            <PlusIcon className="size-3.5" />
            New sprint
          </Button>
        ) : null}
      </div>

      <section className="flex flex-col gap-3">
        <h3 className="text-sm font-medium text-muted-foreground">Active Sprint</h3>
        {activeSprint ? (
          <div className="rounded-2xl border border-border/60 bg-card p-4 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-medium text-foreground">{activeSprint.name}</p>
                  <Badge className="border-transparent bg-gradient-to-r from-blue-500 to-emerald-500 text-white">
                    Active
                  </Badge>
                </div>
                {activeSprint.goal ? (
                  <p className="mt-1 text-sm text-muted-foreground">{activeSprint.goal}</p>
                ) : null}
                <p className="mt-1 text-xs text-muted-foreground">
                  {formatDate(activeSprint.startDate)} – {formatDate(activeSprint.endDate)}
                </p>
              </div>
              {canManage ? (
                <div className="flex shrink-0 gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="gap-1.5"
                    onClick={() => setCreateActiveSprintTaskOpen(true)}
                  >
                    <PlusIcon className="size-3.5" />
                    Add task
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleComplete(activeSprint.id)}
                  >
                    Complete sprint
                  </Button>
                </div>
              ) : null}
            </div>
            <div className="mt-4">
              <SprintTaskList
                workspaceId={workspaceId}
                sprintId={activeSprint.id}
                columns={columns}
                canManage={canManage}
                interactive={false}
              />
            </div>
          </div>
        ) : (
          <p className="rounded-2xl border border-dashed border-border/60 p-6 text-center text-sm text-muted-foreground">
            No active Sprint. Start a Planned Sprint below to begin.
          </p>
        )}
      </section>

      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <section className="flex flex-col gap-3">
          <h3 className="text-sm font-medium text-muted-foreground">
            Planned Sprints
            {plannedSprints.length > 0 ? (
              <span className="ml-2 font-normal text-xs">
                Drag tasks between Sprints and the Product Backlog below.
              </span>
            ) : null}
          </h3>
          {plannedSprints.length === 0 ? (
            <p className="text-sm text-muted-foreground">No planned Sprint yet.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {plannedSprints.map((sprint) => (
                <div
                  key={sprint.id}
                  className="rounded-2xl border border-border/60 bg-card p-4 shadow-sm"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-foreground">{sprint.name}</p>
                      {sprint.goal ? (
                        <p className="mt-1 text-sm text-muted-foreground">{sprint.goal}</p>
                      ) : null}
                      <p className="mt-1 text-xs text-muted-foreground">
                        {formatDate(sprint.startDate)} – {formatDate(sprint.endDate)}
                      </p>
                    </div>
                    {canManage ? (
                      <div className="flex shrink-0 gap-2">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditSprint(sprint)}
                        >
                          Edit
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          disabled={!!activeSprint}
                          onClick={() => handleStart(sprint.id)}
                        >
                          Start
                        </Button>
                      </div>
                    ) : null}
                  </div>
                  <div className="mt-4">
                    <SprintTaskList
                      workspaceId={workspaceId}
                      sprintId={sprint.id}
                      columns={columns}
                      canManage={canManage}
                      interactive
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-muted-foreground">Product Backlog</h3>
            {canManage ? (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="gap-1.5"
                onClick={() => setCreateTaskOpen(true)}
              >
                <PlusIcon className="size-3.5" />
                Add task
              </Button>
            ) : null}
          </div>
          <div className="rounded-2xl border border-border/60 bg-card p-4 shadow-sm">
            <SprintTaskList
              workspaceId={workspaceId}
              sprintId="backlog"
              columns={columns}
              canManage={canManage}
              interactive
            />
          </div>
        </section>

        <DragOverlay>
          {activeDragTask ? (
            <div className="flex w-72 flex-col gap-2 rounded-xl border border-border/60 bg-card p-3 shadow-md">
              <p className="truncate text-sm font-medium text-foreground">
                {activeDragTask.title}
              </p>
              <Badge
                className={PRIORITY_BADGE_CLASS[activeDragTask.priority]}
                variant="outline"
              >
                {PRIORITY_LABEL[activeDragTask.priority]}
              </Badge>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {completedSprints.length > 0 ? (
        <section className="flex flex-col gap-3">
          <h3 className="text-sm font-medium text-muted-foreground">Completed Sprints</h3>
          <div className="flex flex-col gap-2">
            {completedSprints.map((sprint) => (
              <div
                key={sprint.id}
                className="rounded-xl border border-border/60 bg-muted/30 p-3"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-foreground">{sprint.name}</p>
                  <Badge variant="secondary">Completed</Badge>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {formatDate(sprint.startDate)} – {formatDate(sprint.endDate)}
                  {sprint.completedAt ? ` · completed ${formatDate(sprint.completedAt)}` : ""}
                </p>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <SprintFormDialog
        workspaceId={workspaceId}
        open={isCreateOpen}
        onOpenChange={setCreateOpen}
      />
      <SprintFormDialog
        workspaceId={workspaceId}
        open={editSprint !== null}
        onOpenChange={(open) => !open && setEditSprint(null)}
        sprint={editSprint ?? undefined}
      />
      <TaskFormDialog
        workspaceId={workspaceId}
        columns={columns}
        open={isCreateTaskOpen}
        onOpenChange={setCreateTaskOpen}
      />
      {activeSprint ? (
        <TaskFormDialog
          workspaceId={workspaceId}
          columns={columns}
          open={isCreateActiveSprintTaskOpen}
          onOpenChange={setCreateActiveSprintTaskOpen}
          sprintIdToAssign={activeSprint.id}
        />
      ) : null}
    </div>
  );
}
