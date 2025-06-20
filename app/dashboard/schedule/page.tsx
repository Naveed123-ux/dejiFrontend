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
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  return (
    <div className="space-y-6 p-4 lg:p-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Schedule</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stats Card */}
          <Card className="bg-gradient-to-r from-blue-400 to-purple-500 text-white">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <div>
                  <h3 className="text-lg font-medium mb-2">Visits for Today</h3>
                  <div className="text-4xl font-bold mb-4">104</div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                  <div className="text-center">
                    <div className="text-sm opacity-90">New Patients</div>
                    <div className="text-2xl font-bold flex items-center gap-2">
                      40
                      <div className="flex items-center text-green-300 text-sm">
                        <TrendingUp className="w-4 h-4" />
                        51%
                      </div>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm opacity-90">Old Patients</div>
                    <div className="text-2xl font-bold flex items-center gap-2">
                      64
                      <div className="flex items-center text-red-300 text-sm">
                        <TrendingDown className="w-4 h-4" />
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
                <CardTitle className="text-lg font-medium">Patient List</CardTitle>
                <div className="flex items-center gap-4">
                  <Select defaultValue="today">
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="today">Today</SelectItem>
                      <SelectItem value="tomorrow">Tomorrow</SelectItem>
                      <SelectItem value="week">This Week</SelectItem>
                    </SelectContent>
                  </Select>
                  <span className="text-lg font-medium">Consultation</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {patientList.map((patient) => (
                  <div
                    key={patient.id}
                    className="flex items-center justify-between p-4 rounded-lg border hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className={`${patient.bgColor} text-gray-700`}>
                        <AvatarFallback className="bg-transparent">
                          {patient.initials}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{patient.name}</div>
                        <div className="text-sm text-gray-500">{patient.status}</div>
                      </div>
                    </div>
                    <div className="text-sm font-medium text-blue-600">
                      {patient.time}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Consultation Details */}
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium mb-4">Patient Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="bg-gray-100">
                        <AvatarFallback>DW</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">Denzel White</div>
                        <div className="text-sm text-gray-500">Male • 28 years • 5 months</div>
                      </div>
                    </div>
                    <div className="flex gap-4 mt-4">
                      <div className="text-center">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mb-1">
                          🤒
                        </div>
                        <div className="text-xs">Fever</div>
                      </div>
                      <div className="text-center">
                        <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mb-1">
                          😷
                        </div>
                        <div className="text-xs">Cough</div>
                      </div>
                      <div className="text-center">
                        <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mb-1">
                          💔
                        </div>
                        <div className="text-xs">Heart Burn</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-medium mb-4">Consultation Details</h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="text-gray-500">Last Checked:</span>
                      <span className="ml-2">Dr Emily on 7 April 2024 (Prescription #8 Strength)</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Observation:</span>
                      <span className="ml-2">High fever and cough are normal but might have heart burn</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Prescription:</span>
                      <span className="ml-2">Paracetamol • 2 times a day</span>
                      <div className="ml-2 text-gray-500">Disprin • One and half tablets twice daily</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Calendar and Upcoming */}
        <div className="space-y-6">
          {/* Calendar */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-medium">Calendar</CardTitle>
                <Select defaultValue="september-2024">
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="september-2024">September 2024</SelectItem>
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
                <CardTitle className="text-lg font-medium">Upcoming</CardTitle>
                <Button variant="link" className="text-blue-600 p-0">
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {upcomingAppointments.map((appointment) => (
                  <div key={appointment.id} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                    <Avatar className="bg-blue-500 text-white">
                      <AvatarFallback className="bg-blue-500 text-white">
                        {appointment.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="font-medium text-sm">{appointment.title}</div>
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