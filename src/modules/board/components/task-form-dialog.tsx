"use client";

import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { getApiErrorMessage } from "@/shared/utils/api-error";
import type { WorkspaceColumn } from "@/features/workspace";
import { useListMembersQuery } from "@/features/workspace";
import {
  taskFormSchema,
  type Task,
  type TaskFormValues,
  useCreateTaskMutation,
  useUpdateTaskMutation,
} from "@/features/task";

interface TaskFormDialogProps {
  workspaceId: string;
  columns: WorkspaceColumn[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task?: Task;
  defaultColumnId?: string;
}

export function TaskFormDialog({
  workspaceId,
  columns,
  open,
  onOpenChange,
  task,
  defaultColumnId,
}: TaskFormDialogProps) {
  const isEdit = !!task;
  const [formError, setFormError] = useState<string | null>(null);
  const { data: members } = useListMembersQuery(workspaceId, { skip: !open });
  const [createTask, { isLoading: isCreating }] = useCreateTaskMutation();
  const [updateTask, { isLoading: isUpdating }] = useUpdateTaskMutation();
  const isLoading = isCreating || isUpdating;

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      columnId: defaultColumnId ?? columns[0]?.id ?? "",
      title: "",
      description: "",
      priority: "MEDIUM",
      startDate: "",
      dueDate: "",
      assigneeId: "",
    },
  });

  useEffect(() => {
    if (!open) return;
    reset({
      columnId: task?.columnId ?? defaultColumnId ?? columns[0]?.id ?? "",
      title: task?.title ?? "",
      description: task?.description ?? "",
      priority: task?.priority ?? "MEDIUM",
      startDate: task?.startDate?.slice(0, 10) ?? "",
      dueDate: task?.dueDate?.slice(0, 10) ?? "",
      assigneeId: task?.assigneeId ?? "",
    });
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFormError(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, task]);

  const onSubmit = async (values: TaskFormValues) => {
    setFormError(null);
    try {
      if (isEdit && task) {
        await updateTask({
          id: task.id,
          workspaceId,
          columnId: values.columnId,
          title: values.title,
          description: values.description || undefined,
          priority: values.priority,
          startDate: values.startDate || undefined,
          dueDate: values.dueDate || undefined,
          assigneeId: values.assigneeId || undefined,
        }).unwrap();
      } else {
        await createTask({
          columnId: values.columnId,
          title: values.title,
          description: values.description || undefined,
          priority: values.priority,
          startDate: values.startDate || undefined,
          dueDate: values.dueDate || undefined,
        }).unwrap();
      }
      onOpenChange(false);
    } catch (error) {
      setFormError(getApiErrorMessage(error as never));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="contents">
          <DialogHeader>
            <DialogTitle>{isEdit ? "Edit task" : "New task"}</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="task-title">Title</Label>
              <Input
                id="task-title"
                placeholder="Task title"
                aria-invalid={!!errors.title}
                {...register("title")}
              />
              {errors.title ? (
                <p className="text-xs text-destructive">{errors.title.message}</p>
              ) : null}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="task-description">Description</Label>
              <Textarea
                id="task-description"
                placeholder="Optional description"
                rows={3}
                {...register("description")}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="task-column">Column</Label>
                <Controller
                  control={control}
                  name="columnId"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger id="task-column" className="w-full">
                        <SelectValue placeholder="Select column" />
                      </SelectTrigger>
                      <SelectContent>
                        {columns.map((column) => (
                          <SelectItem key={column.id} value={column.id}>
                            {column.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="task-priority">Priority</Label>
                <Controller
                  control={control}
                  name="priority"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger id="task-priority" className="w-full">
                        <SelectValue placeholder="Priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="LOW">Low</SelectItem>
                        <SelectItem value="MEDIUM">Medium</SelectItem>
                        <SelectItem value="HIGH">High</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="task-start-date">Start date</Label>
                <Input id="task-start-date" type="date" {...register("startDate")} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="task-due-date">Due date</Label>
                <Input id="task-due-date" type="date" {...register("dueDate")} />
              </div>
            </div>
            {errors.startDate ? (
              <p className="-mt-2 text-xs text-destructive">
                {errors.startDate.message}
              </p>
            ) : null}

            {isEdit ? (
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="task-assignee">Assignee</Label>
                <Controller
                  control={control}
                  name="assigneeId"
                  render={({ field }) => (
                    <Select
                      value={field.value || "none"}
                      onValueChange={(value) =>
                        field.onChange(value === "none" ? "" : value)
                      }
                    >
                      <SelectTrigger id="task-assignee" className="w-full">
                        <SelectValue placeholder="Unassigned" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Unassigned</SelectItem>
                        {members?.map((member) => (
                          <SelectItem key={member.user.id} value={member.user.id}>
                            {member.user.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            ) : null}

            {formError ? <p className="text-sm text-destructive">{formError}</p> : null}
          </div>

          <DialogFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : isEdit ? "Save changes" : "Create task"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
