"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ReactNode, useEffect } from "react";

export function ThemeProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    const savedColor = localStorage.getItem("primary-color") || "#f97316";
    document.documentElement.style.setProperty("--primary", savedColor);
  }, []);

  return (
    <NextThemesProvider
      attribute='class'
      defaultTheme='system'
      enableSystem
      disableTransitionOnChange>
      {children}
    </NextThemesProvider>
  );
}
