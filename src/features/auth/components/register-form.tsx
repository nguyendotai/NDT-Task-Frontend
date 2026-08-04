"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { useAppDispatch } from "@/shared/hooks/use-app-dispatch";
import { getApiErrorMessage } from "@/shared/utils/api-error";
import { registerSchema, type RegisterFormValues } from "../schemas/register.schema";
import { useLoginMutation, useRegisterMutation } from "../api/auth.api";
import { setCredentials } from "../store/auth.slice";
import { resolveSafeRedirect } from "../utils/safe-redirect";
import { GoogleButton } from "./google-button";

export function RegisterForm({ redirectTo }: { redirectTo?: string }) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [registerUser, { isLoading: isRegistering }] = useRegisterMutation();
  const [login, { isLoading: isLoggingIn }] = useLoginMutation();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });

  const isSubmitting = isRegistering || isLoggingIn;

  const onSubmit = async (values: RegisterFormValues) => {
    setFormError(null);
    try {
      await registerUser({
        name: values.name,
        email: values.email,
        password: values.password,
      }).unwrap();
      const loginResult = await login({
        email: values.email,
        password: values.password,
      }).unwrap();
      dispatch(setCredentials(loginResult));
      router.push(resolveSafeRedirect(redirectTo));
    } catch (error) {
      setFormError(getApiErrorMessage(error as never));
    }
  };

  return (
    <div>
      <h1 className="font-heading text-3xl font-bold tracking-tight">Tạo tài khoản</h1>
      <p className="mt-1.5 text-base text-muted-foreground">
        Bắt đầu quản lý công việc với NDT Task.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-7 flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <Label htmlFor="name" className="text-sm">Họ và tên</Label>
          <Input
            id="name"
            type="text"
            autoComplete="name"
            placeholder="Nguyễn Văn A"
            aria-invalid={!!errors.name}
            className="h-11 px-4 text-base"
            {...register("name")}
          />
          {errors.name ? (
            <p className="text-xs text-destructive">{errors.name.message}</p>
          ) : null}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="email" className="text-sm">Email</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="ban@example.com"
            aria-invalid={!!errors.email}
            className="h-11 px-4 text-base"
            {...register("email")}
          />
          {errors.email ? (
            <p className="text-xs text-destructive">{errors.email.message}</p>
          ) : null}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="password" className="text-sm">Mật khẩu</Label>
          <Input
            id="password"
            type="password"
            autoComplete="new-password"
            placeholder="Tối thiểu 6 ký tự"
            aria-invalid={!!errors.password}
            className="h-11 px-4 text-base"
            {...register("password")}
          />
          {errors.password ? (
            <p className="text-xs text-destructive">{errors.password.message}</p>
          ) : null}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="confirmPassword" className="text-sm">Xác nhận mật khẩu</Label>
          <Input
            id="confirmPassword"
            type="password"
            autoComplete="new-password"
            placeholder="Nhập lại mật khẩu"
            aria-invalid={!!errors.confirmPassword}
            className="h-11 px-4 text-base"
            {...register("confirmPassword")}
          />
          {errors.confirmPassword ? (
            <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>
          ) : null}
        </div>

        {formError ? <p className="text-sm text-destructive">{formError}</p> : null}

        <Button
          type="submit"
          disabled={isSubmitting}
          className="mt-2 h-11 bg-gradient-to-r from-blue-500 to-violet-500 text-base text-white hover:opacity-90"
        >
          {isSubmitting ? "Đang tạo tài khoản..." : "Đăng ký"}
        </Button>
      </form>

      <div className="my-7 flex items-center gap-3">
        <span className="h-px flex-1 bg-border" />
        <span className="text-xs text-muted-foreground">Hoặc</span>
        <span className="h-px flex-1 bg-border" />
      </div>

      <GoogleButton redirectTo={redirectTo} />

      <p className="mt-7 text-center text-base text-muted-foreground">
        Đã có tài khoản?{" "}
        <Link
          href={redirectTo ? `/login?redirect=${encodeURIComponent(redirectTo)}` : "/login"}
          className="font-medium text-foreground hover:underline"
        >
          Đăng nhập
        </Link>
      </p>
    </div>
  );
}
