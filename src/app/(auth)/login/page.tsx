import type { Metadata } from "next";
import { LoginForm } from "@/features/auth";

export const metadata: Metadata = {
  title: "Đăng nhập — NDT Task",
};

export default function LoginPage() {
  return <LoginForm />;
}
