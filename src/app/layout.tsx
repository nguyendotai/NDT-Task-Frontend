import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { Providers } from "./providers";

const generalSans = localFont({
  src: [
    {
      path: "../assets/fonts/general-sans/general-sans-400.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../assets/fonts/general-sans/general-sans-500.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../assets/fonts/general-sans/general-sans-600.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../assets/fonts/general-sans/general-sans-700.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-sans",
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NDT Task — Manage Tasks with Confidence",
  description:
    "NDT Task giúp đội nhóm lên kế hoạch, theo dõi và hoàn thành công việc dễ dàng hơn — hỗ trợ cả Kanban và Scrum trong cùng một nền tảng.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${generalSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
