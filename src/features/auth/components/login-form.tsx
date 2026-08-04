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
import { loginSchema, type LoginFormValues } from "../schemas/login.schema";
import { useLoginMutation } from "../api/auth.api";
import { setCredentials } from "../store/auth.slice";
import { resolveSafeRedirect } from "../utils/safe-redirect";
import { GoogleButton } from "./google-button";

export function LoginForm({ redirectTo }: { redirectTo?: string }) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [login, { isLoading }] = useLoginMutation();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setFormError(null);
    try {
      const result = await login(values).unwrap();
      dispatch(setCredentials(result));
      router.push(resolveSafeRedirect(redirectTo));
    } catch (error) {
      setFormError(getApiErrorMessage(error as never));
    }
  };

  return (
    <div>
      <h1 className="font-heading text-3xl font-bold tracking-tight">Đăng nhập</h1>
      <p className="mt-1.5 text-base text-muted-foreground">
        Chào mừng bạn quay lại NDT Task.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-7 flex flex-col gap-5">
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
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-sm">Mật khẩu</Label>
            <Link
              href="/forgot-password"
              className="text-xs font-medium text-muted-foreground hover:text-foreground hover:underline"
            >
              Quên mật khẩu?
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            placeholder="Nhập mật khẩu"
            aria-invalid={!!errors.password}
            className="h-11 px-4 text-base"
            {...register("password")}
          />
          {errors.password ? (
            <p className="text-xs text-destructive">{errors.password.message}</p>
          ) : null}
        </div>

        {formError ? <p className="text-sm text-destructive">{formError}</p> : null}

        <Button
          type="submit"
          disabled={isLoading}
          className="mt-2 h-11 bg-gradient-to-r from-blue-500 to-emerald-500 text-base text-white hover:opacity-90"
        >
          {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
        </Button>
      </form>

      <div className="my-7 flex items-center gap-3">
        <span className="h-px flex-1 bg-border" />
        <span className="text-xs text-muted-foreground">Hoặc</span>
        <span className="h-px flex-1 bg-border" />
      </div>

      <GoogleButton redirectTo={redirectTo} />

      <p className="mt-7 text-center text-base text-muted-foreground">
        Chưa có tài khoản?{" "}
        <Link
          href={redirectTo ? `/register?redirect=${encodeURIComponent(redirectTo)}` : "/register"}
          className="font-medium text-foreground hover:underline"
        >
          Đăng ký
        </Link>
      </p>
    </div>
  );
}
