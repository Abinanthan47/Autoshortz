"use client";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useEffect } from "react";
import { useAuthContext } from "../provider";
import AppHeader from "./_components/AppHeader";
import AppSidebar from "./_components/AppSidebar";
import { useRouter } from "next/navigation";

function DashboardProvider({ children }) {
  const { user } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.replace("/");
    }
  }, [user, router]); 

  if (!user) return null; 
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
