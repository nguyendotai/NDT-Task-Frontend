"use client";

import { useState } from "react";
import { Button } from "@/shared/components/ui/button";

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

export function GoogleButton() {
  const [notice, setNotice] = useState(false);

  return (
    <div>
      <Button
        type="button"
        variant="outline"
        className="h-11 w-full gap-2 text-base"
        onClick={() => setNotice(true)}
      >
        <GoogleIcon />
        Continue with Google
      </Button>
      {notice ? (
        <p className="mt-2 text-center text-xs text-muted-foreground">
          Đăng nhập bằng Google đang được phát triển, vui lòng dùng email/mật khẩu.
        </p>
      ) : null}
    </div>
  );
}
