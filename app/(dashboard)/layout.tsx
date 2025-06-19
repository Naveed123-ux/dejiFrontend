import type React from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Header } from "@/components/header";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider defaultOpen={true} className="bg-blue-500">
      <div className="flex min-h-screen w-full bg-blue-500">
        <AppSidebar />
        <div className="flex-1 flex flex-col m-5 overflow-hidden rounded-[40px] bg-[#F8F8F8] p-5">
          <Header />
          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
