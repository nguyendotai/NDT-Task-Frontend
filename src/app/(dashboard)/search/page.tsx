import type { Metadata } from "next";
import { GlobalSearchView } from "@/modules/search/components/global-search-view";

export const metadata: Metadata = {
  title: "Search — NDT Task",
};

export default async function GlobalSearchPage({
  searchParams,
}: {
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
  const query = await searchParams;
  return <GlobalSearchView initialQuery={query} />;
}
