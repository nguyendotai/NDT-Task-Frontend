import type { Metadata } from "next";
import { WorkspaceDetailView } from "@/modules/dashboard/components/workspace-detail-view";

export const metadata: Metadata = {
  title: "Workspace — NDT Task",
};

export default async function WorkspaceDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ taskId?: string }>;
}) {
  const { id } = await params;
  const { taskId } = await searchParams;
  return <WorkspaceDetailView workspaceId={id} initialTaskId={taskId} />;
}
