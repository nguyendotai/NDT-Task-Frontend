"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { Button } from "@/shared/components/ui/button";
import { useAppDispatch } from "@/shared/hooks/use-app-dispatch";
import { getApiErrorMessage } from "@/shared/utils/api-error";
import { useGoogleLoginMutation } from "../api/auth.api";
import { setCredentials } from "../store/auth.slice";
import { resolveSafeRedirect } from "../utils/safe-redirect";

interface GoogleCredentialResponse {
  credential: string;
}

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: GoogleCredentialResponse) => void;
          }) => void;
          renderButton: (parent: HTMLElement, options: { type: "standard" }) => void;
        };
      };
    };
  }
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" aria-hidden>
      <path
        fill="#4285F4"
        d="M23.52 12.27c0-.85-.08-1.67-.22-2.45H12v4.63h6.47c-.28 1.5-1.13 2.77-2.4 3.62v3h3.88c2.27-2.09 3.57-5.17 3.57-8.8z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.96-1.07 7.95-2.93l-3.88-3c-1.08.72-2.45 1.15-4.07 1.15-3.13 0-5.78-2.11-6.73-4.96H1.27v3.1C3.25 21.3 7.31 24 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.27 14.26A7.2 7.2 0 0 1 4.9 12c0-.78.13-1.55.37-2.26v-3.1H1.27A11.98 11.98 0 0 0 0 12c0 1.94.46 3.77 1.27 5.36l4-3.1z"
      />
      <path
        fill="#EA4335"
        d="M12 4.77c1.76 0 3.34.6 4.59 1.79l3.44-3.44C17.95 1.19 15.24 0 12 0 7.31 0 3.25 2.7 1.27 6.64l4 3.1C6.22 6.88 8.87 4.77 12 4.77z"
      />
    </svg>
  );
}

export function GoogleButton({ redirectTo }: { redirectTo?: string }) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [googleLogin, { isLoading }] = useGoogleLoginMutation();
  const [error, setError] = useState<string | null>(null);
  const [isScriptReady, setScriptReady] = useState(false);
  const hiddenButtonHostRef = useRef<HTMLDivElement>(null);

  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  useEffect(() => {
    if (!isScriptReady || !clientId || !window.google || !hiddenButtonHostRef.current) return;

    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: async (response) => {
        setError(null);
        try {
          const result = await googleLogin({ idToken: response.credential }).unwrap();
          dispatch(setCredentials(result));
          router.push(resolveSafeRedirect(redirectTo));
        } catch (err) {
          setError(getApiErrorMessage(err as never));
        }
      },
    });
    window.google.accounts.id.renderButton(hiddenButtonHostRef.current, { type: "standard" });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- chỉ khởi tạo lại khi script/clientId đổi, tránh renderButton lặp lại mỗi lần dispatch/router đổi identity
  }, [isScriptReady, clientId]);

  const handleClick = () => {
    // Proxy click sang nút Google thật (render ẩn) để giữ style riêng của app
    // thay vì dùng nút mặc định của Google — theo đúng khuyến nghị của Google
    // Identity Services để đảm bảo hoạt động ổn định trên mọi trình duyệt.
    hiddenButtonHostRef.current?.querySelector<HTMLElement>('div[role="button"]')?.click();
  };

  if (!clientId) return null;

  return (
    <div>
      <Script
        src="https://accounts.google.com/gsi/client"
        strategy="afterInteractive"
        onLoad={() => setScriptReady(true)}
      />
      <div ref={hiddenButtonHostRef} className="hidden" />
      <Button
        type="button"
        variant="outline"
        className="h-11 w-full gap-2 text-base"
        disabled={!isScriptReady || isLoading}
        onClick={handleClick}
      >
        <GoogleIcon />
        {isLoading ? "Đang đăng nhập..." : "Continue with Google"}
      </Button>
      {error ? <p className="mt-2 text-center text-xs text-destructive">{error}</p> : null}
    </div>
  );
}
