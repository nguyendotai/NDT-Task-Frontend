import type { SerializedError } from "@reduxjs/toolkit";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";

const DEFAULT_MESSAGE = "Đã có lỗi xảy ra, vui lòng thử lại.";

interface ApiErrorBody {
  message?: string;
  error?: { details?: string[] };
}

export function getApiErrorMessage(
  error: FetchBaseQueryError | SerializedError | undefined,
): string {
  if (!error) return DEFAULT_MESSAGE;

  if ("data" in error && error.data) {
    const body = error.data as ApiErrorBody;
    if (body.error?.details?.length) return body.error.details.join(", ");
    if (body.message) return body.message;
  }

  if ("message" in error && error.message) return error.message;

  return DEFAULT_MESSAGE;
}
