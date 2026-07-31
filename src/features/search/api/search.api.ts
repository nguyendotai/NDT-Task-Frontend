import { baseApi } from "@/shared/services/base-api";
import type {
  LabelFilterOption,
  SearchParams,
  SearchResults,
} from "../types/search.types";

export const searchApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    search: builder.query<SearchResults, SearchParams>({
      query: ({ workspaceId, ...params }) => ({
        url: `/workspaces/${workspaceId}/search`,
        params,
      }),
    }),
    listSearchLabels: builder.query<LabelFilterOption[], string>({
      query: (workspaceId) => `/workspaces/${workspaceId}/search/labels`,
    }),
  }),
});

export const { useSearchQuery, useListSearchLabelsQuery } = searchApi;
