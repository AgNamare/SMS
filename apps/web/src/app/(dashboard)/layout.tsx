// app/dashboard/layout.tsx
import { ReactNode } from "react";
import { requireAuth } from "../lib/auth-guard";
import { SidebarInset, SidebarProvider } from "../components/ui/sidebar";
import { AppSidebar } from "../components/app-sidebar";
import { BreadcrumbProvider } from "../context/breadcrumb-context";
import { HeaderClient } from "../components/header-client";
import { ThemeProvider } from "../context/theme-context";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  await requireAuth();

  return (
    <ThemeProvider>
      <BreadcrumbProvider>
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <HeaderClient />
            <main className='flex-1 overflow-y-auto bg-background p-6'>
              {" "}
              {/* Changed from bg-gray-50 to bg-background */}
              {children}
            </main>
          </SidebarInset>
        </SidebarProvider>
      </BreadcrumbProvider>
    </ThemeProvider>
  );
}
