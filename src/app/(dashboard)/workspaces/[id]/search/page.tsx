import type { Metadata } from "next";
import { AdvancedSearchView } from "@/modules/search/components/advanced-search-view";

export const metadata: Metadata = {
  title: "Search — NDT Task",
};

export default async function AdvancedSearchPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    q?: string;
    type?: string;
    assigneeId?: string;
    reporterId?: string;
    done?: string;
    label?: string;
    sprintId?: string;
    updatedFrom?: string;
    updatedTo?: string;
  }>;
}) {
  const { id } = await params;
  const query = await searchParams;
  return <AdvancedSearchView workspaceId={id} initialQuery={query} />;
}
