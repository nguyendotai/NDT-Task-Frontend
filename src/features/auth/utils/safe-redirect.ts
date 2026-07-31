// Chỉ cho phép redirect nội bộ ("/invitations/xyz") — chặn "//host" (protocol-relative URL) để tránh open-redirect.
export function resolveSafeRedirect(redirectTo: string | undefined, fallback = "/"): string {
  if (redirectTo && redirectTo.startsWith("/") && !redirectTo.startsWith("//")) {
    return redirectTo;
  }
  return fallback;
}
