import { NextResponse, type NextRequest } from "next/server";

const RESET = "\x1b[0m";
const DIM = "\x1b[2m";

const METHOD_COLORS: Record<string, string> = {
  GET: "\x1b[36m",
  POST: "\x1b[32m",
  PATCH: "\x1b[33m",
  PUT: "\x1b[33m",
  DELETE: "\x1b[31m",
};

export function proxy(request: NextRequest) {
  const { method } = request;
  const color = METHOD_COLORS[method] ?? "\x1b[37m";
  const path = `${request.nextUrl.pathname}${request.nextUrl.search}`;
  const time = new Date().toLocaleTimeString("vi-VN");

  console.log(`${color}${method.padEnd(6)}${RESET} ${path} ${DIM}${time}${RESET}`);

  return NextResponse.next();
}

export const config = {
  matcher: "/((?!_next/static|_next/image|favicon.ico).*)",
};
