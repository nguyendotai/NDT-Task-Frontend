"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { getApiErrorMessage } from "@/shared/utils/api-error";
import {
  forgotPasswordSchema,
  type ForgotPasswordFormValues,
} from "../schemas/forgot-password.schema";
import { useForgotPasswordMutation } from "../api/auth.api";

export function ForgotPasswordForm() {
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();
  const [formError, setFormError] = useState<string | null>(null);
  const [sentMessage, setSentMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (values: ForgotPasswordFormValues) => {
    setFormError(null);
    setSentMessage(null);
    try {
      const result = await forgotPassword(values).unwrap();
      setSentMessage(result.message);
    } catch (error) {
      setFormError(getApiErrorMessage(error as never));
    }
  };

  if (sentMessage) {
    return (
      <div>
        <h1 className="font-heading text-3xl font-bold tracking-tight">Kiểm tra email</h1>
        <p className="mt-3 text-base text-muted-foreground">{sentMessage}</p>
        <Link
          href="/login"
          className="mt-7 inline-block font-medium text-foreground hover:underline"
        >
          Quay lại đăng nhập
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-heading text-3xl font-bold tracking-tight">Quên mật khẩu</h1>
      <p className="mt-1.5 text-base text-muted-foreground">
        Nhập email của bạn, chúng tôi sẽ gửi hướng dẫn đặt lại mật khẩu.
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

        {formError ? <p className="text-sm text-destructive">{formError}</p> : null}

        <Button
          type="submit"
          disabled={isLoading}
          className="mt-2 h-11 bg-gradient-to-r from-blue-500 to-emerald-500 text-base text-white hover:opacity-90"
        >
          {isLoading ? "Đang gửi..." : "Gửi hướng dẫn"}
        </Button>
      </form>

      <p className="mt-7 text-center text-base text-muted-foreground">
        Đã nhớ mật khẩu?{" "}
        <Link href="/login" className="font-medium text-foreground hover:underline">
          Đăng nhập
        </Link>
      </p>
    </div>
  );
}
