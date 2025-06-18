"use client";

import type React from "react";
import Image from "next/image";
import Logo from "@/public/Logo.png";
interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  illustration: React.ReactNode;
}

export function AuthLayout({
  children,
  title,
  subtitle,
  illustration,
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex">
      {/* Left side - Form */}

      <div className="flex-1 lg:flex-[0.6_1_0%] flex flex-col justify-start px-8 sm:px-12 lg:px-16 xl:px-20 bg-white relative">
        {/* Logo at the top */}
        <div className="w-full flex lg:justify-start justify-center pt-6">
          <Image src={Logo} alt="Logo" className="w-[100px] h-[70px]" />
        </div>

        {/* Content wrapper */}
        <div className="w-full max-w-md mx-auto lg:mt-0 mt-2">
          {/* Title and Subtitle */}
          <div className="mb-8 mt-6">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">{title}</h1>
            {subtitle && <p className="text-black-600">{subtitle}</p>}
          </div>

          {/* Form Content */}
          {children}
        </div>
      </div>

      {/* Right side - Illustration */}
      <div className="hidden lg:flex flex-[0.4_1_0%] bg-gradient-to-br from-blue-400 to-blue-600 items-center justify-center p-12  rounded-bl-[40px] rounded-tl-[40px]">
        {illustration}
      </div>
    </div>
  );
}
