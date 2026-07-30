import type { Metadata } from "next";
import { SettingsView } from "@/modules/board/components/settings-view";

export const metadata: Metadata = {
  title: "Settings — NDT Task",
};

export default async function WorkspaceSettingsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <SettingsView workspaceId={id} />;
}
