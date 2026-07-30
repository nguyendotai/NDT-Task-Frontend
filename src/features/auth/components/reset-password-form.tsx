"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { getApiErrorMessage } from "@/shared/utils/api-error";
import {
  resetPasswordSchema,
  type ResetPasswordFormValues,
} from "../schemas/reset-password.schema";
import { useResetPasswordMutation } from "../api/auth.api";

export function ResetPasswordForm({ token }: { token?: string }) {
  const router = useRouter();
  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  const [formError, setFormError] = useState<string | null>(null);
  const [isDone, setDone] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { newPassword: "", confirmNewPassword: "" },
  });

  const onSubmit = async (values: ResetPasswordFormValues) => {
    if (!token) return;
    setFormError(null);
    try {
      await resetPassword({ token, newPassword: values.newPassword }).unwrap();
      setDone(true);
    } catch (error) {
      setFormError(getApiErrorMessage(error as never));
    }
  };

  if (!token) {
    return (
      <div>
        <h1 className="font-heading text-3xl font-bold tracking-tight">Liên kết không hợp lệ</h1>
        <p className="mt-3 text-base text-muted-foreground">
          Thiếu token đặt lại mật khẩu. Hãy yêu cầu gửi lại liên kết mới.
        </p>
        <Link
          href="/forgot-password"
          className="mt-7 inline-block font-medium text-foreground hover:underline"
        >
          Quên mật khẩu
        </Link>
      </div>
    );
  }

  if (isDone) {
    return (
      <div>
        <h1 className="font-heading text-3xl font-bold tracking-tight">Đặt lại mật khẩu thành công</h1>
        <p className="mt-3 text-base text-muted-foreground">
          Mật khẩu của bạn đã được cập nhật. Hãy đăng nhập lại bằng mật khẩu mới.
        </p>
        <Button
          className="mt-7 h-11 bg-gradient-to-r from-blue-500 to-violet-500 text-base text-white hover:opacity-90"
          onClick={() => router.push("/login")}
        >
          Đến trang đăng nhập
        </Button>
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-heading text-3xl font-bold tracking-tight">Đặt lại mật khẩu</h1>
      <p className="mt-1.5 text-base text-muted-foreground">
        Nhập mật khẩu mới cho tài khoản của bạn.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-7 flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <Label htmlFor="newPassword" className="text-sm">Mật khẩu mới</Label>
          <Input
            id="newPassword"
            type="password"
            autoComplete="new-password"
            aria-invalid={!!errors.newPassword}
            className="h-11 px-4 text-base"
            {...register("newPassword")}
          />
          {errors.newPassword ? (
            <p className="text-xs text-destructive">{errors.newPassword.message}</p>
          ) : null}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="confirmNewPassword" className="text-sm">Xác nhận mật khẩu mới</Label>
          <Input
            id="confirmNewPassword"
            type="password"
            autoComplete="new-password"
            aria-invalid={!!errors.confirmNewPassword}
            className="h-11 px-4 text-base"
            {...register("confirmNewPassword")}
          />
          {errors.confirmNewPassword ? (
            <p className="text-xs text-destructive">{errors.confirmNewPassword.message}</p>
          ) : null}
        </div>

        {formError ? <p className="text-sm text-destructive">{formError}</p> : null}

        <Button
          type="submit"
          disabled={isLoading}
          className="mt-2 h-11 bg-gradient-to-r from-blue-500 to-violet-500 text-base text-white hover:opacity-90"
        >
          {isLoading ? "Đang cập nhật..." : "Đặt lại mật khẩu"}
        </Button>
      </form>
    </div>
  );
}
