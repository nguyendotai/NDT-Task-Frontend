"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeftIcon } from "lucide-react";
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
import {
  createWorkspaceSchema,
  type CreateWorkspaceFormValues,
  AvatarPresetPicker,
  useCreateWorkspaceMutation,
} from "@/features/workspace";

export function CreateWorkspaceView() {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);
  const [createWorkspace, { isLoading }] = useCreateWorkspaceMutation();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<CreateWorkspaceFormValues>({
    resolver: zodResolver(createWorkspaceSchema),
    defaultValues: { name: "", type: "KANBAN", description: "" },
  });

  const avatarEmoji = useWatch({ control, name: "avatarEmoji" });
  const avatarColor = useWatch({ control, name: "avatarColor" });
  const avatarValue =
    avatarEmoji && avatarColor ? { emoji: avatarEmoji, color: avatarColor } : undefined;

  const onSubmit = async (values: CreateWorkspaceFormValues) => {
    setFormError(null);
    try {
      const workspace = await createWorkspace(values).unwrap();
      router.push(`/workspaces/${workspace.id}`);
    } catch (error) {
      setFormError(getApiErrorMessage(error as never));
    }
  };

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-6">
      <Link
        href="/workspaces"
        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeftIcon className="size-4" />
        Back to workspaces
      </Link>

      <div>
        <h1 className="font-heading text-2xl font-bold">Create a new Workspace</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Set up a space to organize your team&apos;s tasks.
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="flex flex-col gap-5 rounded-2xl border border-border/60 bg-card p-6"
      >
        <AvatarPresetPicker
          value={avatarValue}
          onChange={(preset) => {
            setValue("avatarEmoji", preset?.emoji);
            setValue("avatarColor", preset?.color);
          }}
        />

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="workspace-name">Workspace name</Label>
          <Input
            id="workspace-name"
            placeholder="e.g. Marketing Team"
            aria-invalid={!!errors.name}
            {...register("name")}
          />
          {errors.name ? (
            <p className="text-xs text-destructive">{errors.name.message}</p>
          ) : null}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="workspace-type">Workspace type</Label>
          <Controller
            control={control}
            name="type"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id="workspace-type" className="w-full">
                  <SelectValue placeholder="Select a workspace type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="KANBAN">Kanban</SelectItem>
                  <SelectItem value="SCRUM">Scrum</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.type ? (
            <p className="text-xs text-destructive">{errors.type.message}</p>
          ) : null}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="workspace-description">Description (optional)</Label>
          <Textarea
            id="workspace-description"
            placeholder="A short description of this workspace"
            rows={3}
            {...register("description")}
          />
        </div>

        {formError ? <p className="text-sm text-destructive">{formError}</p> : null}

        <Button
          type="submit"
          disabled={isLoading}
          className="bg-gradient-to-r from-blue-500 to-violet-500 text-white hover:opacity-90"
        >
          {isLoading ? "Creating..." : "Create Workspace"}
        </Button>
      </form>
    </div>
  );
}
