"use client";

import { useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { getApiErrorMessage } from "@/shared/utils/api-error";
import {
  useSetupTwoFactorMutation,
  useEnableTwoFactorMutation,
  useDisableTwoFactorMutation,
} from "@/features/auth";
import { useGetProfileQuery } from "@/features/user";

// auth.md #3.4: setup trả QR + secret (chưa bật) -> nhập mã 6 số để enable.
// Disable cũng yêu cầu mã 6 số hiện hành để xác nhận, tránh bị tắt trái phép
// nếu phiên đăng nhập bị chiếm.
export function TwoFactorSection() {
  const { data: profile } = useGetProfileQuery();
  const [setupTwoFactor, { isLoading: isSettingUp }] = useSetupTwoFactorMutation();
  const [enableTwoFactor, { isLoading: isEnabling }] = useEnableTwoFactorMutation();
  const [disableTwoFactor, { isLoading: isDisabling }] = useDisableTwoFactorMutation();

  const [setupData, setSetupData] = useState<{ secret: string; qrCodeDataUrl: string } | null>(
    null,
  );
  const [enableCode, setEnableCode] = useState("");
  const [disableCode, setDisableCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  if (!profile) return null;

  const handleStartSetup = async () => {
    setError(null);
    setMessage(null);
    try {
      const result = await setupTwoFactor().unwrap();
      setSetupData(result);
    } catch (err) {
      setError(getApiErrorMessage(err as never));
    }
  };

  const handleEnable = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    try {
      await enableTwoFactor({ code: enableCode }).unwrap();
      setSetupData(null);
      setEnableCode("");
      setMessage("Xác thực 2 lớp đã được bật.");
    } catch (err) {
      setError(getApiErrorMessage(err as never));
    }
  };

  const handleDisable = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    try {
      await disableTwoFactor({ code: disableCode }).unwrap();
      setDisableCode("");
      setMessage("Xác thực 2 lớp đã được tắt.");
    } catch (err) {
      setError(getApiErrorMessage(err as never));
    }
  };

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-border/60 bg-card p-6">
      <div>
        <h2 className="font-heading text-sm font-semibold tracking-wide text-muted-foreground uppercase">
          Xác thực 2 lớp (2FA)
        </h2>
        <p className="mt-1 text-xs text-muted-foreground">
          Yêu cầu thêm mã 6 số từ ứng dụng xác thực (Google Authenticator, Authy...) mỗi khi
          đăng nhập.
        </p>
      </div>

      {message ? <p className="text-sm text-green-600 dark:text-green-400">{message}</p> : null}
      {error ? <p className="text-sm text-destructive">{error}</p> : null}

      {profile.twoFactorEnabled ? (
        <form onSubmit={handleDisable} className="flex flex-col gap-3">
          <p className="text-sm text-foreground">Đang bật. Nhập mã hiện tại để tắt.</p>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="disable-2fa-code">Mã xác thực</Label>
            <Input
              id="disable-2fa-code"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              placeholder="123456"
              className="max-w-40 text-center tracking-[0.4em]"
              value={disableCode}
              onChange={(event) => setDisableCode(event.target.value.replace(/\D/g, "").slice(0, 6))}
            />
          </div>
          <div>
            <Button
              type="submit"
              variant="destructive"
              disabled={isDisabling || disableCode.length !== 6}
            >
              {isDisabling ? "Đang tắt..." : "Tắt 2FA"}
            </Button>
          </div>
        </form>
      ) : setupData ? (
        <form onSubmit={handleEnable} className="flex flex-col gap-3">
          <p className="text-sm text-foreground">
            Quét mã QR bằng ứng dụng xác thực, sau đó nhập mã 6 số để xác nhận.
          </p>
          {/* eslint-disable-next-line @next/next/no-img-element -- QR là data URL, next/image không hỗ trợ tối ưu nguồn này */}
          <img
            src={setupData.qrCodeDataUrl}
            alt="Mã QR thiết lập 2FA"
            width={176}
            height={176}
            className="rounded-lg border border-border/60"
          />
          <p className="text-xs break-all text-muted-foreground">
            Không quét được? Nhập thủ công: {setupData.secret}
          </p>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="enable-2fa-code">Mã xác thực</Label>
            <Input
              id="enable-2fa-code"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              placeholder="123456"
              className="max-w-40 text-center tracking-[0.4em]"
              value={enableCode}
              onChange={(event) => setEnableCode(event.target.value.replace(/\D/g, "").slice(0, 6))}
            />
          </div>
          <div className="flex gap-2">
            <Button type="submit" disabled={isEnabling || enableCode.length !== 6}>
              {isEnabling ? "Đang bật..." : "Xác nhận & bật"}
            </Button>
            <Button type="button" variant="ghost" onClick={() => setSetupData(null)}>
              Huỷ
            </Button>
          </div>
        </form>
      ) : (
        <div>
          <Button type="button" onClick={handleStartSetup} disabled={isSettingUp}>
            {isSettingUp ? "Đang tạo mã QR..." : "Bật 2FA"}
          </Button>
        </div>
      )}
    </div>
  );
}
