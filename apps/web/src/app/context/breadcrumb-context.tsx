// app/context/breadcrumb-context.tsx
"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface BreadcrumbContextType {
  pageName: string;
  setPageName: (name: string) => void;
  breadcrumbs: { label: string; href?: string }[];
  setBreadcrumbs: (breadcrumbs: { label: string; href?: string }[]) => void;
}

const BreadcrumbContext = createContext<BreadcrumbContextType | undefined>(
  undefined
);

export function BreadcrumbProvider({ children }: { children: ReactNode }) {
  const [pageName, setPageName] = useState("Dashboard");
  const [breadcrumbs, setBreadcrumbs] = useState<
    { label: string; href?: string }[]
  >([]);

  return (
    <BreadcrumbContext.Provider
      value={{
        pageName,
        setPageName,
        breadcrumbs,
        setBreadcrumbs,
      }}>
      {children}
    </BreadcrumbContext.Provider>
  );
}

export function useBreadcrumb() {
  const context = useContext(BreadcrumbContext);
  if (context === undefined) {
    throw new Error("useBreadcrumb must be used within a BreadcrumbProvider");
  }
  return context;
}
