"use client";

import { useEffect, useRef } from "react";
import { useAppDispatch } from "@/shared/hooks/use-app-dispatch";
import { useLazyGetMeQuery, useRefreshMutation } from "../api/auth.api";
import { setAccessToken, setBootstrapped, setUser } from "../store/auth.slice";

// Thử khôi phục phiên đăng nhập khi tải lại trang, dựa trên refreshToken
// (HTTP-Only Cookie) — im lặng nếu chưa đăng nhập/refresh token hết hạn.
export function AuthBootstrap() {
  const dispatch = useAppDispatch();
  const [refresh] = useRefreshMutation();
  const [getMe] = useLazyGetMeQuery();
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    (async () => {
      try {
        const { accessToken } = await refresh().unwrap();
        dispatch(setAccessToken(accessToken));
        const user = await getMe().unwrap();
        dispatch(setUser(user));
      } catch {
        // Chưa đăng nhập hoặc refresh token hết hạn — giữ trạng thái logged-out.
      } finally {
        dispatch(setBootstrapped());
      }
    })();
  }, [dispatch, refresh, getMe]);

  return null;
}
