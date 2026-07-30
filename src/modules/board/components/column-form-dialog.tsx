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
import { getApiErrorMessage } from "@/shared/utils/api-error";
import {
  columnFormSchema,
  useCreateColumnMutation,
  useUpdateColumnMutation,
  type ColumnFormValues,
  type WorkspaceColumn,
} from "@/features/workspace";

interface ColumnFormDialogProps {
  workspaceId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  column?: WorkspaceColumn;
}

export function ColumnFormDialog({
  workspaceId,
  open,
  onOpenChange,
  column,
}: ColumnFormDialogProps) {
  const isEdit = !!column;
  const [formError, setFormError] = useState<string | null>(null);
  const [createColumn, { isLoading: isCreating }] = useCreateColumnMutation();
  const [updateColumn, { isLoading: isUpdating }] = useUpdateColumnMutation();
  const isLoading = isCreating || isUpdating;

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<ColumnFormValues>({
    resolver: zodResolver(columnFormSchema),
    defaultValues: { name: "", isDoneColumn: false },
  });

  useEffect(() => {
    if (!open) return;
    reset({
      name: column?.name ?? "",
      isDoneColumn: column?.isDoneColumn ?? false,
    });
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFormError(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, column]);

  const onSubmit = async (values: ColumnFormValues) => {
    setFormError(null);
    try {
      if (isEdit && column) {
        await updateColumn({
          id: column.id,
          name: values.name,
          isDoneColumn: values.isDoneColumn,
        }).unwrap();
      } else {
        await createColumn({
          workspaceId,
          name: values.name,
          isDoneColumn: values.isDoneColumn,
        }).unwrap();
      }
      onOpenChange(false);
    } catch (error) {
      setFormError(getApiErrorMessage(error as never));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="contents">
          <DialogHeader>
            <DialogTitle>{isEdit ? "Edit column" : "New column"}</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="column-name">Name</Label>
              <Input
                id="column-name"
                placeholder="e.g. Review"
                aria-invalid={!!errors.name}
                {...register("name")}
              />
              {errors.name ? (
                <p className="text-xs text-destructive">{errors.name.message}</p>
              ) : null}
            </div>

            <div className="flex items-start gap-2.5">
              <Controller
                control={control}
                name="isDoneColumn"
                render={({ field }) => (
                  <input
                    id="column-is-done"
                    type="checkbox"
                    checked={field.value}
                    onChange={(event) => field.onChange(event.target.checked)}
                    className="mt-0.5 size-4 shrink-0 rounded-[var(--radius-sm)] border-border accent-primary"
                  />
                )}
              />
              <div className="flex flex-col gap-1">
                <Label htmlFor="column-is-done">Mark as a &quot;Done&quot; column</Label>
                <p className="text-xs text-muted-foreground">
                  Tasks in this column count as finished for the done/unfinished
                  filters (e.g. Dashboard).
                </p>
              </div>
            </div>

            {formError ? <p className="text-sm text-destructive">{formError}</p> : null}
          </div>

          <DialogFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : isEdit ? "Save changes" : "Add column"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
