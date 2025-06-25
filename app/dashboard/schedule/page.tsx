"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronDown, TrendingUp, TrendingDown } from "lucide-react";

const patientList = [
  {
    id: 1,
    name: "Denzel White",
    initials: "DW",
    time: "9:00 AM",
    status: "Consultation",
    bgColor: "bg-gray-100",
  },
  {
    id: 2,
    name: "Stacy Mitchell",
    initials: "SM",
    time: "9:30 AM",
    status: "Follow-up",
    bgColor: "bg-pink-100",
  },
  {
    id: 3,
    name: "Amy Durham",
    initials: "AD",
    time: "10:30 AM",
    status: "Routine Checkup",
    bgColor: "bg-blue-100",
  },
  {
    id: 4,
    name: "Demi Joan",
    initials: "DJ",
    time: "11:00 AM",
    status: "Urgent",
    bgColor: "bg-green-100",
  },
  {
    id: 5,
    name: "Susan Myers",
    initials: "SM",
    time: "11:30 AM",
    status: "Follow-up",
    bgColor: "bg-purple-100",
  },
];

const upcomingAppointments = [
  {
    id: 1,
    title: "Monthly doctor's meet",
    date: "8 April 2024",
    time: "2:00 PM",
    avatar: "M",
  },
];

export default function Schedule() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );

  return (
    <div className="space-y-4 sm:space-y-6 p-2 sm:p-4 lg:p-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
          Schedule
        </h1>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
        {/* Left Column - Main Content */}
        <div className="xl:col-span-2 space-y-4 sm:space-y-6">
          {/* Stats Card */}
          <Card className="bg-gradient-to-r from-blue-400 to-purple-500 text-white">
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h3 className="text-base sm:text-lg font-medium mb-2">
                    Visits for Today
                  </h3>
                  <div className="text-3xl sm:text-4xl font-bold mb-4">104</div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                  <div className="text-center">
                    <div className="text-xs sm:text-sm opacity-90">
                      New Patients
                    </div>
                    <div className="text-xl sm:text-2xl font-bold flex items-center gap-2">
                      40
                      <div className="flex items-center text-green-300 text-xs sm:text-sm">
                        <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />
                        51%
                      </div>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs sm:text-sm opacity-90">
                      Old Patients
                    </div>
                    <div className="text-xl sm:text-2xl font-bold flex items-center gap-2">
                      64
                      <div className="flex items-center text-red-300 text-xs sm:text-sm">
                        <TrendingDown className="w-3 h-3 sm:w-4 sm:h-4" />
                        20%
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Patient List */}
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <CardTitle className="text-base sm:text-lg font-medium">
                  Patient List
                </CardTitle>
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <Select defaultValue="today">
                    <SelectTrigger className="w-full sm:w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="today">Today</SelectItem>
                      <SelectItem value="tomorrow">Tomorrow</SelectItem>
                      <SelectItem value="week">This Week</SelectItem>
                    </SelectContent>
                  </Select>
                  <span className="text-base sm:text-lg font-medium hidden sm:inline">
                    Consultation
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 sm:space-y-4 ">
                {patientList.map((patient) => (
                  <div
                    key={patient.id}
                    className="flex items-center justify-between p-3 sm:p-4 rounded-lg border hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar
                        className={`${patient.bgColor} text-gray-700 h-8 w-8 sm:h-10 sm:w-10`}
                      >
                        <AvatarFallback className="bg-transparent text-xs sm:text-sm">
                          {patient.initials}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium text-sm sm:text-base">
                          {patient.name}
                        </div>
                        <div className="text-xs sm:text-sm text-gray-500">
                          {patient.status}
                        </div>
                      </div>
                    </div>
                    <div className="text-xs sm:text-sm font-medium text-blue-600">
                      {patient.time}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Consultation Details */}
          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <h3 className="font-medium mb-4 text-sm sm:text-base">
                    Patient Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="bg-gray-100 h-8 w-8 sm:h-10 sm:w-10">
                        <AvatarFallback className="text-xs sm:text-sm">
                          DW
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium text-sm sm:text-base">
                          Denzel White
                        </div>
                        <div className="text-xs sm:text-sm text-gray-500">
                          Male • 28 years • 5 months
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-3 sm:gap-4 mt-4">
                      <div className="text-center">
                        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-100 rounded-full flex items-center justify-center mb-1">
                          🤒
                        </div>
                        <div className="text-xs">Fever</div>
                      </div>
                      <div className="text-center">
                        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-orange-100 rounded-full flex items-center justify-center mb-1">
                          😷
                        </div>
                        <div className="text-xs">Cough</div>
                      </div>
                      <div className="text-center">
                        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-red-100 rounded-full flex items-center justify-center mb-1">
                          💔
                        </div>
                        <div className="text-xs">Heart Burn</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-medium mb-4 text-sm sm:text-base">
                    Consultation Details
                  </h3>
                  <div className="space-y-3 text-xs sm:text-sm">
                    <div>
                      <span className="text-gray-500">Last Checked:</span>
                      <span className="ml-2">
                        Dr Emily on 7 April 2024 (Prescription #8 Strength)
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Observation:</span>
                      <span className="ml-2">
                        High fever and cough are normal but might have heart
                        burn
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Prescription:</span>
                      <span className="ml-2">Paracetamol • 2 times a day</span>
                      <div className="ml-2 text-gray-500">
                        Disprin • One and half tablets twice daily
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Calendar and Upcoming */}
        <div className="space-y-4 sm:space-y-6">
          {/* Calendar */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base sm:text-lg font-medium">
                  Calendar
                </CardTitle>
                <Select defaultValue="september-2024">
                  <SelectTrigger className="w-32 sm:w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="september-2024">
                      September 2024
                    </SelectItem>
                    <SelectItem value="october-2024">October 2024</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border-0"
              />
            </CardContent>
          </Card>

          {/* Upcoming Appointments */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base sm:text-lg font-medium">
                  Upcoming
                </CardTitle>
                <Button variant="link" className="text-blue-600 p-0 text-sm">
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {upcomingAppointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="flex items-center gap-3 p-3 rounded-lg bg-gray-50"
                  >
                    <Avatar className="bg-blue-500 text-white h-8 w-8 sm:h-10 sm:w-10">
                      <AvatarFallback className="bg-blue-500 text-white text-xs sm:text-sm">
                        {appointment.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="font-medium text-xs sm:text-sm">
                        {appointment.title}
                      </div>
                      <div className="text-xs text-gray-500">
                        {appointment.date} • {appointment.time}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
