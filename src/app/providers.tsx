"use client";

import { Provider } from "react-redux";
import { ThemeProvider } from "next-themes";
import { store } from "@/store/store";
import { AuthBootstrap } from "@/features/auth";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <Provider store={store}>
        <AuthBootstrap />
        {children}
      </Provider>
    </ThemeProvider>
  );
}
