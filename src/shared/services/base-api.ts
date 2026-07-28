import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { env } from "@/configs/env.config";

// Feature APIs extend this via baseApi.injectEndpoints() in features/<feature>/api/.
// Authorization header injection is added once the Auth feature/slice exists.
export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: env.apiBaseUrl,
    credentials: "include",
  }),
  tagTypes: [],
  endpoints: () => ({}),
});
