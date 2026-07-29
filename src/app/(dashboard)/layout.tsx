"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/shared/hooks/use-app-selector";
import { selectCurrentUser, selectIsBootstrapped } from "@/features/auth";
import { DashboardHeader } from "@/modules/dashboard/components/dashboard-header";
import { DashboardSidebar } from "@/modules/dashboard/components/dashboard-sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const user = useAppSelector(selectCurrentUser);
  const isBootstrapped = useAppSelector(selectIsBootstrapped);

  useEffect(() => {
    if (isBootstrapped && !user) {
      router.replace("/login");
    }
  }, [isBootstrapped, user, router]);

  if (!isBootstrapped || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-muted-foreground">Đang tải...</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <DashboardSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <DashboardHeader />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
