import type { Metadata } from "next";
import { InvitationAcceptView } from "@/modules/invitation/components/invitation-accept-view";

export const metadata: Metadata = {
  title: "Lời mời tham gia Workspace — NDT Task",
};

export default async function InvitationPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  return <InvitationAcceptView token={token} />;
}
