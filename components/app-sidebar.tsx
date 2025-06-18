"use client"

import { Calendar, ClipboardList, FileText, Grid3X3, LogOut, Settings, Stethoscope, UserPlus } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const menuItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: Grid3X3,
  },
  {
    title: "Schedule",
    url: "/schedule",
    icon: Calendar,
  },
  {
    title: "Registration",
    url: "/registration",
    icon: UserPlus,
  },
  {
    title: "Referrals",
    url: "/referrals",
    icon: ClipboardList,
  },
  {
    title: "Notes",
    url: "/notes",
    icon: FileText,
  },
  {
    title: "Providers",
    url: "/providers",
    icon: Stethoscope,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar className="bg-blue-500 border-r-0">
      <SidebarContent className="bg-blue-500">
        <SidebarGroup className="pt-8">
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.url}
                    className="text-white hover:bg-blue-400 data-[active=true]:bg-blue-600 data-[active=true]:text-white h-12 text-sm justify-start px-4"
                  >
                    <Link href={item.url} className="flex items-center gap-3">
                      <item.icon className="h-5 w-5" />
                      <span className="text-sm font-medium">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              <SidebarMenuItem>
                <SidebarMenuButton className="text-white hover:bg-blue-400 h-12 text-sm justify-start px-4">
                  <div className="flex items-center gap-3">
                    <LogOut className="h-5 w-5" />
                    <span className="text-sm font-medium">Log Out</span>
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
