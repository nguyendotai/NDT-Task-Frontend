"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { getApiErrorMessage } from "@/shared/utils/api-error";
import { useAppDispatch } from "@/shared/hooks/use-app-dispatch";
import {
  changePasswordSchema,
  clearCredentials,
  useChangePasswordMutation,
  useLogoutMutation,
  type ChangePasswordFormValues,
} from "@/features/auth";

export function ChangePasswordForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [formError, setFormError] = useState<string | null>(null);
  const [changePassword, { isLoading }] = useChangePasswordMutation();
  const [logout] = useLogoutMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { currentPassword: "", newPassword: "", confirmNewPassword: "" },
  });

  const onSubmit = async (values: ChangePasswordFormValues) => {
    setFormError(null);
    try {
      await changePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      }).unwrap();

      // Đổi mật khẩu thu hồi mọi refresh token phía server — chủ động đăng
      // xuất luôn phía client để tránh phiên "sống dở chết dở" (access token
      // còn dùng được tới khi hết hạn nhưng không refresh được nữa).
      try {
        await logout().unwrap();
      } catch {
        // Bỏ qua lỗi API logout — vẫn xoá phiên phía client để đảm bảo UX.
      }
      dispatch(clearCredentials());
      router.push("/login");
    } catch (error) {
      reset(values);
      setFormError(getApiErrorMessage(error as never));
    }
  };

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-border/60 bg-card p-6">
      <div>
        <h2 className="font-heading text-sm font-semibold tracking-wide text-muted-foreground uppercase">
          Change password
        </h2>
        <p className="mt-1 text-xs text-muted-foreground">
          You&apos;ll be signed out on this device after changing your password.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="current-password">Current password</Label>
          <Input
            id="current-password"
            type="password"
            aria-invalid={!!errors.currentPassword}
            {...register("currentPassword")}
          />
          {errors.currentPassword ? (
            <p className="text-xs text-destructive">{errors.currentPassword.message}</p>
          ) : null}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="new-password">New password</Label>
          <Input
            id="new-password"
            type="password"
            aria-invalid={!!errors.newPassword}
            {...register("newPassword")}
          />
          {errors.newPassword ? (
            <p className="text-xs text-destructive">{errors.newPassword.message}</p>
          ) : null}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="confirm-new-password">Confirm new password</Label>
          <Input
            id="confirm-new-password"
            type="password"
            aria-invalid={!!errors.confirmNewPassword}
            {...register("confirmNewPassword")}
          />
          {errors.confirmNewPassword ? (
            <p className="text-xs text-destructive">{errors.confirmNewPassword.message}</p>
          ) : null}
        </div>

        {formError ? <p className="text-sm text-destructive">{formError}</p> : null}

        <div>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Changing..." : "Change password"}
          </Button>
        </div>
      </form>
    </div>
  );
}
