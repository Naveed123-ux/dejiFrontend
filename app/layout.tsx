import type React from "react";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Header } from "@/components/header";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"], // add only the weights you need
  style: ["normal", "italic"], // optional
  variable: "--font-poppins", // optional, if you want to use it as a CSS variable
  display: "swap", // optional for better performance
});

export const metadata: Metadata = {
  title: "Healthcare Management System",
  description: "A comprehensive healthcare management dashboard",
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={poppins.className}>
        <div className="flex min-h-screen w-full">
          <main className="flex-1  bg-gray-50">{children}</main>
        </div>
      </body>
    </html>
  );
}
