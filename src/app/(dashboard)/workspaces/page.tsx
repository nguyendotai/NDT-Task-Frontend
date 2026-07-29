import type { Metadata } from "next";
import { WorkspacesView } from "@/modules/dashboard/components/workspaces-view";

export const metadata: Metadata = {
  title: "My Workspaces — NDT Task",
};

export default function WorkspacesPage() {
  return <WorkspacesView />;
}
