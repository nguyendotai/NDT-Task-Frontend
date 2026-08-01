import { baseApi } from "@/shared/services/base-api";
import type {
  LabelFilterOption,
  SearchParams,
  SearchResults,
} from "../types/search.types";

export type GlobalSearchParams = Omit<SearchParams, "workspaceId">;

export const searchApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    search: builder.query<SearchResults, SearchParams>({
      query: ({ workspaceId, ...params }) => ({
        url: `/workspaces/${workspaceId}/search`,
        params,
      }),
    }),
    // Global Search (search.md #2): tìm xuyên suốt tất cả Workspace user là
    // Member Active, không cần workspaceId.
    searchGlobal: builder.query<SearchResults, GlobalSearchParams>({
      query: (params) => ({ url: "/search", params }),
    }),
    listSearchLabels: builder.query<LabelFilterOption[], string>({
      query: (workspaceId) => `/workspaces/${workspaceId}/search/labels`,
    }),
  }),
});

export const { useSearchQuery, useSearchGlobalQuery, useListSearchLabelsQuery } =
  searchApi;
