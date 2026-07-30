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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { getApiErrorMessage } from "@/shared/utils/api-error";
import {
  columnFormSchema,
  useCreateColumnMutation,
  useUpdateColumnMutation,
  type ColumnFormValues,
  type WorkspaceColumn,
} from "@/features/workspace";
import { STATUS_LABEL } from "@/features/task";

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
    defaultValues: { name: "", mappedStatus: "NONE" },
  });

  useEffect(() => {
    if (!open) return;
    reset({
      name: column?.name ?? "",
      mappedStatus: column?.mappedStatus ?? "NONE",
    });
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFormError(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, column]);

  const onSubmit = async (values: ColumnFormValues) => {
    setFormError(null);
    const mappedStatus = values.mappedStatus === "NONE" ? null : values.mappedStatus;
    try {
      if (isEdit && column) {
        await updateColumn({ id: column.id, name: values.name, mappedStatus }).unwrap();
      } else {
        await createColumn({ workspaceId, name: values.name, mappedStatus }).unwrap();
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

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="column-status">Maps to status</Label>
              <Controller
                control={control}
                name="mappedStatus"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="column-status" className="w-full">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="NONE">None</SelectItem>
                      <SelectItem value="TODO">{STATUS_LABEL.TODO}</SelectItem>
                      <SelectItem value="IN_PROGRESS">
                        {STATUS_LABEL.IN_PROGRESS}
                      </SelectItem>
                      <SelectItem value="DONE">{STATUS_LABEL.DONE}</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              <p className="text-xs text-muted-foreground">
                Tasks moved into this column will automatically switch to this
                status. Choose None to leave a task&apos;s status unchanged.
              </p>
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
