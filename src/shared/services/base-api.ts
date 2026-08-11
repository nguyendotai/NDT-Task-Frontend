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

// Endpoint phát hành token/không cần Access Token hiện có — gặp 401 ở đây thì
// refresh cũng vô nghĩa (chưa đăng nhập, hoặc chính /auth/refresh đang lỗi).
const AUTH_ENTRY_PATHS = [
  "/auth/login",
  "/auth/register",
  "/auth/google",
  "/auth/refresh",
  "/auth/forgot-password",
  "/auth/reset-password",
  "/auth/2fa/verify-login",
];

function resolveUrl(args: string | FetchArgs): string {
  return typeof args === "string" ? args : args.url;
}

// Access Token sống 15 phút (jwt.config.ts) nhưng trước đây chỉ được làm mới
// đúng 1 lần lúc tải trang (AuthBootstrap) — mọi request sau khi hết hạn giữa
// phiên làm việc (vd kéo-thả Task để mở workspace lâu) đều nhận 401 mà không
// có cơ chế retry, khiến optimistic update âm thầm bị revert không rõ lý do.
// `refreshPromise` dùng chung cho mọi request 401 cùng lúc — tránh gọi
// /auth/refresh nhiều lần song song (mỗi lần refresh sẽ thu hồi token cũ).
let refreshPromise: Promise<string | null> | null = null;

async function refreshAccessToken(
  api: Parameters<BaseQueryFn>[1],
  extraOptions: Parameters<BaseQueryFn>[2],
): Promise<string | null> {
  refreshPromise ??= (async () => {
    const result = await rawBaseQuery(
      { url: "/auth/refresh", method: "POST" },
      api,
      extraOptions,
    );
    const envelope = result.data as ApiEnvelope<{ accessToken: string }> | undefined;
    if (envelope?.data.accessToken) {
      // Dispatch action thuần (không import auth.slice) để tuân thủ chiều phụ
      // thuộc Feature -> Shared (architecture.md #37) — type string khớp đúng
      // createSlice({ name: "auth" }) sinh ra ("auth/setAccessToken"...).
      api.dispatch({ type: "auth/setAccessToken", payload: envelope.data.accessToken });
      return envelope.data.accessToken;
    }
    api.dispatch({ type: "auth/clearCredentials" });
    return null;
  })().finally(() => {
    refreshPromise = null;
  });
  return refreshPromise;
}

// Backend luôn bọc response thành công trong { success, message, data, timestamp }
// (api-contract.md) — unwrap `data` 1 lần ở đây để mọi endpoint không phải tự làm lại.
const baseQueryWithEnvelope: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await rawBaseQuery(args, api, extraOptions);

  if (
    result.error?.status === 401 &&
    !AUTH_ENTRY_PATHS.some((path) => resolveUrl(args).startsWith(path))
  ) {
    const newAccessToken = await refreshAccessToken(api, extraOptions);
    if (newAccessToken) {
      result = await rawBaseQuery(args, api, extraOptions);
    }
  }

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
    "Doc",
    "TimeLog",
  ],
  endpoints: () => ({}),
});
