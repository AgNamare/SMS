"use client";

import { useTheme as useNextTheme } from "next-themes";

export const useTheme = () => {
  const { theme, setTheme } = useNextTheme();

  const setPrimaryColor = (color: string) => {
    document.documentElement.style.setProperty("--primary", color);
    localStorage.setItem("primary-color", color);
  };

  return { theme, setTheme, setPrimaryColor };
};
