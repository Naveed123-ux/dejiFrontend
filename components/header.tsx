"use client"

import { Bell, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function Header() {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search"
              className="pl-10 bg-gray-100 border-0 focus:bg-white focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5 text-gray-600" />
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel className="font-semibold">Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="max-h-64 overflow-y-auto">
                <DropdownMenuItem className="flex flex-col items-start p-3 hover:bg-gray-50">
                  <div className="flex items-center justify-between w-full">
                    <span className="font-medium text-sm">New Patient Registration</span>
                    <span className="text-xs text-gray-500">2 min ago</span>
                  </div>
                  <span className="text-xs text-gray-600 mt-1">John Doe has completed registration</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex flex-col items-start p-3 hover:bg-gray-50">
                  <div className="flex items-center justify-between w-full">
                    <span className="font-medium text-sm">Appointment Reminder</span>
                    <span className="text-xs text-gray-500">15 min ago</span>
                  </div>
                  <span className="text-xs text-gray-600 mt-1">Patient appointment at 3:00 PM today</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex flex-col items-start p-3 hover:bg-gray-50">
                  <div className="flex items-center justify-between w-full">
                    <span className="font-medium text-sm">Document Uploaded</span>
                    <span className="text-xs text-gray-500">1 hour ago</span>
                  </div>
                  <span className="text-xs text-gray-600 mt-1">Medical records uploaded for Sarah Johnson</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex flex-col items-start p-3 hover:bg-gray-50">
                  <div className="flex items-center justify-between w-full">
                    <span className="font-medium text-sm">System Update</span>
                    <span className="text-xs text-gray-500">2 hours ago</span>
                  </div>
                  <span className="text-xs text-gray-600 mt-1">System maintenance completed successfully</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex flex-col items-start p-3 hover:bg-gray-50">
                  <div className="flex items-center justify-between w-full">
                    <span className="font-medium text-sm">Referral Request</span>
                    <span className="text-xs text-gray-500">3 hours ago</span>
                  </div>
                  <span className="text-xs text-gray-600 mt-1">New referral request from Dr. Smith</span>
                </DropdownMenuItem>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-center text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                View All Notifications
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-2 hover:bg-gray-100">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                  <AvatarFallback>U1</AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium text-gray-700">User 001</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Support</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
