import { baseApi } from "@/shared/services/base-api";
import type { SearchParams, SearchResults } from "../types/search.types";

export const searchApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    search: builder.query<SearchResults, SearchParams>({
      query: ({ workspaceId, ...params }) => ({
        url: `/workspaces/${workspaceId}/search`,
        params,
      }),
    }),
  }),
});

export const { useSearchQuery } = searchApi;
