"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CameraIcon } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { getApiErrorMessage } from "@/shared/utils/api-error";
import { useAppDispatch } from "@/shared/hooks/use-app-dispatch";
import { UserAvatar, setUser } from "@/features/auth";
import {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useUploadAvatarMutation,
  updateProfileSchema,
  type UpdateProfileFormValues,
} from "@/features/user";
import { ChangePasswordForm } from "./change-password-form";

export function ProfileView() {
  const dispatch = useAppDispatch();
  const { data: profile, isLoading, isError, refetch } = useGetProfileQuery();
  const [updateProfile, { isLoading: isSaving }] = useUpdateProfileMutation();
  const [uploadAvatar, { isLoading: isUploading }] = useUploadAvatarMutation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formError, setFormError] = useState<string | null>(null);
  const [avatarError, setAvatarError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateProfileFormValues>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: { name: "" },
  });

  useEffect(() => {
    if (profile) reset({ name: profile.name });
  }, [profile, reset]);

  const onSubmit = async (values: UpdateProfileFormValues) => {
    setFormError(null);
    setSuccessMessage(null);
    try {
      const updated = await updateProfile(values).unwrap();
      dispatch(setUser(updated));
      setSuccessMessage("Profile updated.");
    } catch (error) {
      setFormError(getApiErrorMessage(error as never));
    }
  };

  const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setAvatarError(null);
    try {
      const updated = await uploadAvatar(file).unwrap();
      dispatch(setUser(updated));
    } catch (error) {
      setAvatarError(getApiErrorMessage(error as never));
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <div className="h-8 w-48 animate-pulse rounded-lg bg-muted/50" />
        <div className="h-64 animate-pulse rounded-2xl border border-border/60 bg-muted/50" />
      </div>
    );
  }

  if (isError || !profile) {
    return (
      <div className="rounded-2xl border border-dashed border-border/60 p-8 text-center text-sm text-muted-foreground">
        Couldn&apos;t load your profile.{" "}
        <button
          type="button"
          onClick={() => refetch()}
          className="font-medium text-foreground underline underline-offset-2"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-6">
      <h1 className="font-heading text-2xl font-bold">Profile</h1>

      <div className="flex flex-col gap-6 rounded-2xl border border-border/60 bg-card p-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            <UserAvatar name={profile.name} avatarUrl={profile.avatarUrl} className="size-16" />
            <button
              type="button"
              aria-label="Change photo"
              disabled={isUploading}
              onClick={() => fileInputRef.current?.click()}
              className="absolute -right-1 -bottom-1 flex size-6 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-violet-500 text-white shadow-sm disabled:opacity-50"
            >
              <CameraIcon className="size-3.5" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={handleAvatarChange}
            />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">
              {isUploading ? "Uploading..." : "Profile photo"}
            </p>
            <p className="text-xs text-muted-foreground">JPEG, PNG or WEBP, up to 5MB.</p>
          </div>
        </div>
        {avatarError ? <p className="text-sm text-destructive">{avatarError}</p> : null}

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="profile-name">Name</Label>
            <Input
              id="profile-name"
              aria-invalid={!!errors.name}
              {...register("name")}
            />
            {errors.name ? (
              <p className="text-xs text-destructive">{errors.name.message}</p>
            ) : null}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="profile-email">Email</Label>
            <Input id="profile-email" value={profile.email} disabled />
          </div>

          {formError ? <p className="text-sm text-destructive">{formError}</p> : null}
          {successMessage ? (
            <p className="text-sm text-green-600 dark:text-green-400">{successMessage}</p>
          ) : null}

          <div>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Saving..." : "Save changes"}
            </Button>
          </div>
        </form>
      </div>

      <ChangePasswordForm />
    </div>
  );
}
