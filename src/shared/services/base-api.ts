import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { env } from "@/configs/env.config";

interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

interface AuthState {
  auth: { accessToken: string | null };
}

const rawBaseQuery = fetchBaseQuery({
  baseUrl: env.apiBaseUrl,
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const { accessToken } = (getState() as AuthState).auth;
    if (accessToken) {
      headers.set("Authorization", `Bearer ${accessToken}`);
    }
    return headers;
  },
});

// Backend luôn bọc response thành công trong { success, message, data, timestamp }
// (api-contract.md) — unwrap `data` 1 lần ở đây để mọi endpoint không phải tự làm lại.
const baseQueryWithEnvelope: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await rawBaseQuery(args, api, extraOptions);
  if (result.data) {
    const envelope = result.data as ApiEnvelope<unknown>;
    // Endpoint trả void (DELETE, PATCH .../read-all...) bị NestJS bỏ hẳn key
    // `data` khi serialize JSON (JSON.stringify loại field `undefined`) — nếu
    // không có fallback, RTK Query coi `{ data: undefined }` là kết quả không
    // hợp lệ (không phải `data` cũng không phải `error`) và báo lỗi console.
    return { data: envelope.data ?? {}, meta: result.meta };
  }
  return result;
};

// Feature APIs extend này qua baseApi.injectEndpoints() trong features/<feature>/api/.
export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithEnvelope,
  tagTypes: [
    "Workspace",
    "Task",
    "User",
    "Sprint",
    "Comment",
    "Attachment",
    "Checklist",
    "Label",
    "Watcher",
    "Notification",
  ],
  endpoints: () => ({}),
});
