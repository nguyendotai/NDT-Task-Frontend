import type { Metadata } from "next";
import { SuggestedWorkspaces } from "@/modules/dashboard/components/suggested-workspaces";
import { DashboardTabs } from "@/modules/dashboard/components/dashboard-tabs";

export const metadata: Metadata = {
  title: "Dashboard — NDT Task",
};

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      <SuggestedWorkspaces />
      <DashboardTabs />
    </div>
  );
}
