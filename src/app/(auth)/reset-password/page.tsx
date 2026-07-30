import type { Metadata } from "next";
import { ResetPasswordForm } from "@/features/auth";

export const metadata: Metadata = {
  title: "Đặt lại mật khẩu — NDT Task",
};

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;
  return <ResetPasswordForm token={token} />;
}
