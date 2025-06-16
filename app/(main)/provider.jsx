"use client";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useEffect } from "react";
import { useAuthContext } from "../provider";
import AppHeader from "./_components/AppHeader";
import AppSidebar from "./_components/AppSidebar";

function DashboardProvider({ children }) {
  const { user } = useAuthContext();

  // Since we're removing auth, user will always be available
  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="w-full">
        <AppHeader />
        <div className="p-10">{children}</div>
      </div>
    </SidebarProvider>
  );
}

export default DashboardProvider;