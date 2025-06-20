import type React from "react";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { Provider } from "react-redux";
import { store } from "@/store/store"; // ✅ adjust path if needed
import StoreProvider from "@/components/store-provider";
import { Toaster } from "react-hot-toast";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-poppins",
  display: "swap",
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
        {/* ✅ Redux Provider wraps entire app */}
        <Toaster position="top-right" reverseOrder={false} />
        <StoreProvider>
          <div className="flex min-h-screen w-full">
            <main className="flex-1 bg-gray-50">{children}</main>
          </div>
        </StoreProvider>
      </body>
    </html>
  );
}
