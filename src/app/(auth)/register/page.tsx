import type { Metadata } from "next";
import { RegisterForm } from "@/features/auth";

export const metadata: Metadata = {
  title: "Đăng ký — NDT Task",
};

export default function RegisterPage() {
  return <RegisterForm />;
}
