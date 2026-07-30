"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
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
import { getApiErrorMessage } from "@/shared/utils/api-error";
import {
  sprintFormSchema,
  useCreateSprintMutation,
  useUpdateSprintMutation,
  type Sprint,
  type SprintFormValues,
} from "@/features/sprint";

interface SprintFormDialogProps {
  workspaceId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sprint?: Sprint;
}

export function SprintFormDialog({
  workspaceId,
  open,
  onOpenChange,
  sprint,
}: SprintFormDialogProps) {
  const isEdit = !!sprint;
  const [formError, setFormError] = useState<string | null>(null);
  const [createSprint, { isLoading: isCreating }] = useCreateSprintMutation();
  const [updateSprint, { isLoading: isUpdating }] = useUpdateSprintMutation();
  const isLoading = isCreating || isUpdating;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SprintFormValues>({
    resolver: zodResolver(sprintFormSchema),
    defaultValues: { name: "", goal: "", startDate: "", endDate: "" },
  });

  useEffect(() => {
    if (!open) return;
    reset({
      name: sprint?.name ?? "",
      goal: sprint?.goal ?? "",
      startDate: sprint?.startDate.slice(0, 10) ?? "",
      endDate: sprint?.endDate.slice(0, 10) ?? "",
    });
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFormError(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, sprint]);

  const onSubmit = async (values: SprintFormValues) => {
    setFormError(null);
    try {
      if (isEdit && sprint) {
        await updateSprint({
          id: sprint.id,
          name: values.name,
          goal: values.goal || undefined,
          startDate: values.startDate,
          endDate: values.endDate,
        }).unwrap();
      } else {
        await createSprint({
          workspaceId,
          name: values.name,
          goal: values.goal || undefined,
          startDate: values.startDate,
          endDate: values.endDate,
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
            <DialogTitle>{isEdit ? "Edit sprint" : "New sprint"}</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="sprint-name">Name</Label>
              <Input
                id="sprint-name"
                placeholder="e.g. Sprint 1"
                aria-invalid={!!errors.name}
                {...register("name")}
              />
              {errors.name ? (
                <p className="text-xs text-destructive">{errors.name.message}</p>
              ) : null}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="sprint-goal">Goal</Label>
              <Textarea
                id="sprint-goal"
                placeholder="Optional goal"
                rows={3}
                {...register("goal")}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="sprint-start-date">Start date</Label>
                <Input
                  id="sprint-start-date"
                  type="date"
                  aria-invalid={!!errors.startDate}
                  {...register("startDate")}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="sprint-end-date">End date</Label>
                <Input
                  id="sprint-end-date"
                  type="date"
                  aria-invalid={!!errors.endDate}
                  {...register("endDate")}
                />
              </div>
            </div>
            {errors.startDate ? (
              <p className="-mt-2 text-xs text-destructive">
                {errors.startDate.message}
              </p>
            ) : null}
            {errors.endDate ? (
              <p className="-mt-2 text-xs text-destructive">
                {errors.endDate.message}
              </p>
            ) : null}

            {formError ? <p className="text-sm text-destructive">{formError}</p> : null}
          </div>

          <DialogFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : isEdit ? "Save changes" : "Create sprint"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
