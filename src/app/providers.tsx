"use client";

import { Provider } from "react-redux";
import { ThemeProvider } from "next-themes";
import { store } from "@/store/store";
import { AuthBootstrap } from "@/features/auth";
import { IntroSplash } from "@/shared/components/intro-splash";
import { Toaster } from "@/shared/components/ui/sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <Provider store={store}>
        <AuthBootstrap />
        <IntroSplash />
        {children}
        <Toaster position="top-center" richColors />
      </Provider>
    </ThemeProvider>
  );
}
