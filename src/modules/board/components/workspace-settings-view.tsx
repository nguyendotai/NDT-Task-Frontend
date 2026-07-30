"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import { Badge } from "@/shared/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { getApiErrorMessage } from "@/shared/utils/api-error";
import {
  updateWorkspaceSchema,
  useDeleteWorkspaceMutation,
  useUpdateWorkspaceMutation,
  type UpdateWorkspaceFormValues,
  type WorkspaceDetail,
} from "@/features/workspace";

export function WorkspaceSettingsView({ workspace }: { workspace: WorkspaceDetail }) {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);
  const [updateWorkspace, { isLoading: isSaving }] = useUpdateWorkspaceMutation();
  const [deleteWorkspace, { isLoading: isArchiving }] = useDeleteWorkspaceMutation();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<UpdateWorkspaceFormValues>({
    resolver: zodResolver(updateWorkspaceSchema),
    defaultValues: {
      name: workspace.name,
      description: workspace.description ?? "",
      visibility: workspace.visibility,
    },
  });

  useEffect(() => {
    reset({
      name: workspace.name,
      description: workspace.description ?? "",
      visibility: workspace.visibility,
    });
  }, [workspace, reset]);

  const onSubmit = async (values: UpdateWorkspaceFormValues) => {
    setFormError(null);
    try {
      await updateWorkspace({
        id: workspace.id,
        name: values.name,
        description: values.description || undefined,
        visibility: values.visibility,
      }).unwrap();
    } catch (error) {
      setFormError(getApiErrorMessage(error as never));
    }
  };

  const handleArchive = async () => {
    if (
      !window.confirm(
        `Archive "${workspace.name}"? Members will lose access until it is restored.`,
      )
    ) {
      return;
    }
    try {
      await deleteWorkspace(workspace.id).unwrap();
      router.push("/workspaces");
    } catch (error) {
      setFormError(getApiErrorMessage(error as never));
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="flex flex-col gap-4 rounded-2xl border border-border/60 bg-card p-6"
      >
        <h2 className="font-heading text-sm font-semibold tracking-wide text-muted-foreground uppercase">
          Workspace
        </h2>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="settings-name">Name</Label>
          <Input
            id="settings-name"
            aria-invalid={!!errors.name}
            {...register("name")}
          />
          {errors.name ? (
            <p className="text-xs text-destructive">{errors.name.message}</p>
          ) : null}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="settings-description">Description</Label>
          <Textarea id="settings-description" rows={3} {...register("description")} />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="settings-visibility">Scope</Label>
          <Controller
            control={control}
            name="visibility"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id="settings-visibility" className="w-full sm:w-64">
                  <SelectValue placeholder="Select scope" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PRIVATE">Private — invited members only</SelectItem>
                  <SelectItem value="PUBLIC">Public</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>

        {formError ? <p className="text-sm text-destructive">{formError}</p> : null}

        <div>
          <Button type="submit" disabled={isSaving}>
            {isSaving ? "Saving..." : "Save changes"}
          </Button>
        </div>
      </form>

      <div className="flex flex-col gap-3 rounded-2xl border border-destructive/30 bg-destructive/5 p-6">
        <div>
          <h2 className="font-heading text-sm font-semibold tracking-wide text-destructive uppercase">
            Danger zone
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Status: <Badge variant="outline">Active</Badge> — archiving hides this Workspace
            for all members until an Owner restores it from the Workspaces list.
          </p>
        </div>
        <div>
          <Button
            type="button"
            variant="destructive"
            disabled={isArchiving}
            onClick={handleArchive}
          >
            {isArchiving ? "Archiving..." : "Archive Workspace"}
          </Button>
        </div>
      </div>
    </div>
  );
}
