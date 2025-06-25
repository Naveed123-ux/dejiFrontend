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
        <div className="">
          <AppSidebar />
        </div>
        <div className="flex-1 flex flex-col m-2 sm:m-5 overflow-hidden rounded-[20px] sm:rounded-[40px] bg-[#F8F8F8] p-2 sm:p-5">
          <Header />
          <main className="flex-1 p-2 sm:p-6 overflow-auto">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
