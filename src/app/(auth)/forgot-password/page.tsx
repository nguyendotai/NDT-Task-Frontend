import type { Metadata } from "next";
import { ForgotPasswordForm } from "@/features/auth";

export const metadata: Metadata = {
  title: "Quên mật khẩu — NDT Task",
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
