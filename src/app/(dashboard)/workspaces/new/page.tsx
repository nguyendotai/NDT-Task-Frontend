import type { Metadata } from "next";
import { CreateWorkspaceView } from "@/modules/dashboard/components/create-workspace-view";

export const metadata: Metadata = {
  title: "Create Workspace — NDT Task",
};

export default function NewWorkspacePage() {
  return <CreateWorkspaceView />;
}
