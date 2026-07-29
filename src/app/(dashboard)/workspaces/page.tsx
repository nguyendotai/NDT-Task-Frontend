import type { Metadata } from "next";
import { WorkspacesView } from "@/modules/dashboard/components/workspaces-view";

export const metadata: Metadata = {
  title: "Workspace của tôi — NDT Task",
};

export default function WorkspacesPage() {
  return <WorkspacesView />;
}
