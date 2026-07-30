import type { Metadata } from "next";
import { ProfileView } from "@/modules/dashboard/components/profile-view";

export const metadata: Metadata = {
  title: "Profile — NDT Task",
};

export default function ProfilePage() {
  return <ProfileView />;
}
