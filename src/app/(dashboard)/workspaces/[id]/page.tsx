import type { Metadata } from "next";
import { WorkspaceDetailView } from "@/modules/dashboard/components/workspace-detail-view";

export const metadata: Metadata = {
  title: "Workspace — NDT Task",
};

export default async function WorkspaceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <WorkspaceDetailView workspaceId={id} />;
}
