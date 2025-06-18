"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"

export default function Registration() {
  const [formData, setFormData] = useState({
    fullName: "Aahsham Iqbal",
    dateOfBirth: "09/12/2001",
    race: "African Black",
    phoneNumber: "+123 456 789",
    address: "",
    veteran: "yes",
    activeDuty: "yes",
    emergencyContact: "Mother, Father etc.",
    primaryCareProvider: "Dr. Ayesha Malik",
    insurance: "1 1 - 4 2 2 3 4 7",
    behavioralHealthProvider: "Dr. Ayesha Malik",
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
    // Handle form submission
  }

  const handleClearinghouse = () => {
    console.log("Send to clearinghouse:", formData)
    // Handle clearinghouse submission
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Registration</h1>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                value={formData.fullName}
                onChange={(e) => handleInputChange("fullName", e.target.value)}
                className="bg-gray-50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">Date Of Birth</Label>
              <Input
                id="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                className="bg-gray-50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="race">Race</Label>
              <Input
                id="race"
                value={formData.race}
                onChange={(e) => handleInputChange("race", e.target.value)}
                className="bg-gray-50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                value={formData.phoneNumber}
                onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                className="bg-gray-50"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) => handleInputChange("address", e.target.value)}
              className="bg-gray-50 min-h-[80px]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label>Veteran</Label>
              <RadioGroup
                value={formData.veteran}
                onValueChange={(value) => handleInputChange("veteran", value)}
                className="flex space-x-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="veteran-yes" />
                  <Label htmlFor="veteran-yes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="veteran-no" />
                  <Label htmlFor="veteran-no">No</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-3">
              <Label>Active Duty</Label>
              <RadioGroup
                value={formData.activeDuty}
                onValueChange={(value) => handleInputChange("activeDuty", value)}
                className="flex space-x-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="active-yes" />
                  <Label htmlFor="active-yes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="active-no" />
                  <Label htmlFor="active-no">No</Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="emergencyContact">Emergency Contact</Label>
              <Input
                id="emergencyContact"
                value={formData.emergencyContact}
                onChange={(e) => handleInputChange("emergencyContact", e.target.value)}
                className="bg-gray-50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="primaryCareProvider">Primary Care Provider</Label>
              <Input
                id="primaryCareProvider"
                value={formData.primaryCareProvider}
                onChange={(e) => handleInputChange("primaryCareProvider", e.target.value)}
                className="bg-gray-50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="insurance">Insurance</Label>
              <Input
                id="insurance"
                value={formData.insurance}
                onChange={(e) => handleInputChange("insurance", e.target.value)}
                className="bg-gray-50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="behavioralHealthProvider">Behavioral Health Provider</Label>
              <Input
                id="behavioralHealthProvider"
                value={formData.behavioralHealthProvider}
                onChange={(e) => handleInputChange("behavioralHealthProvider", e.target.value)}
                className="bg-gray-50"
              />
            </div>
          </div>

          <div className="flex justify-between pt-6">
            <Button type="button" onClick={handleClearinghouse} className="bg-blue-500 hover:bg-blue-600 text-white">
              SEND TO CLEARINGHOUSE
            </Button>
            <Button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white px-8">
              REGISTER
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
