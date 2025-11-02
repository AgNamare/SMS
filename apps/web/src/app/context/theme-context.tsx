// contexts/theme-context.tsx
"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface ThemeContextType {
  primaryColor: string;
  setPrimaryColor: (color: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
const hexToHsl = (hex: string) => {
  hex = hex.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  const d = max - min;

  let h = 0;
  let s = 0;

  if (d !== 0) {
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return `${(h * 360).toFixed(1)} ${(s * 100).toFixed(1)} ${(l * 100).toFixed(
    1
  )}`;
};


export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [primaryColor, setPrimaryColor] = useState("#6b21a8");

  useEffect(() => {
    // Load saved theme from localStorage
    const saved = localStorage.getItem("user-theme");
    if (saved) {
      setPrimaryColor(saved);
      applyTheme(saved);
    } else {
      // Apply default theme on initial load
      applyTheme("#581c87");
    }
  }, []);

  const applyTheme = (color: string) => {
    const primaryForeground = getContrastColor(color);

    // Set the CSS variables
    document.documentElement.style.setProperty("--primary", color);
    document.documentElement.style.setProperty(
      "--primary-foreground",
      primaryForeground
    );

    localStorage.setItem("user-theme", color);
  };

  const getContrastColor = (hexcolor: string) => {
    hexcolor = hexcolor.replace("#", "");
    const r = parseInt(hexcolor.substr(0, 2), 16);
    const g = parseInt(hexcolor.substr(2, 2), 16);
    const b = parseInt(hexcolor.substr(4, 2), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5 ? "#000000" : "#ffffff";
  };

  const handleSetPrimaryColor = (color: string) => {
    setPrimaryColor(color);
    applyTheme(color);
  };

  return (
    <ThemeContext.Provider
      value={{
        primaryColor,
        setPrimaryColor: handleSetPrimaryColor,
      }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
