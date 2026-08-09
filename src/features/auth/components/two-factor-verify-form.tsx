"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { useAppDispatch } from "@/shared/hooks/use-app-dispatch";
import { getApiErrorMessage } from "@/shared/utils/api-error";
import { useVerifyTwoFactorLoginMutation } from "../api/auth.api";
import { setCredentials } from "../store/auth.slice";
import { resolveSafeRedirect } from "../utils/safe-redirect";

// auth.md #3.4: bước 2 khi login()/googleLogin() trả requiresTwoFactor=true —
// dùng chung cho cả form email/mật khẩu lẫn Google, tempToken chỉ sống 5 phút.
export function TwoFactorVerifyForm({
  tempToken,
  redirectTo,
  onCancel,
}: {
  tempToken: string;
  redirectTo?: string;
  onCancel: () => void;
}) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [verifyTwoFactorLogin, { isLoading }] = useVerifyTwoFactorLoginMutation();
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    try {
      const result = await verifyTwoFactorLogin({ tempToken, code }).unwrap();
      dispatch(setCredentials(result));
      router.push(resolveSafeRedirect(redirectTo));
    } catch (err) {
      setError(getApiErrorMessage(err as never));
    }
  };

  return (
    <div>
      <h1 className="font-heading text-3xl font-bold tracking-tight">Xác thực 2 lớp</h1>
      <p className="mt-1.5 text-base text-muted-foreground">
        Nhập mã 6 số từ ứng dụng xác thực (Google Authenticator, Authy...) trên điện thoại của bạn.
      </p>

      <form onSubmit={handleSubmit} noValidate className="mt-7 flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <Label htmlFor="two-factor-code" className="text-sm">
            Mã xác thực
          </Label>
          <Input
            id="two-factor-code"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            placeholder="123456"
            className="h-11 px-4 text-center text-lg tracking-[0.5em]"
            value={code}
            onChange={(event) => setCode(event.target.value.replace(/\D/g, "").slice(0, 6))}
            autoFocus
          />
        </div>

        {error ? <p className="text-sm text-destructive">{error}</p> : null}

        <Button
          type="submit"
          disabled={isLoading || code.length !== 6}
          className="h-11 bg-gradient-to-r from-blue-500 to-emerald-500 text-base text-white hover:opacity-90"
        >
          {isLoading ? "Đang xác thực..." : "Xác nhận"}
        </Button>
        <Button type="button" variant="ghost" onClick={onCancel} className="h-11 text-base">
          Quay lại
        </Button>
      </form>
    </div>
  );
}
