"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";

export default function Registration() {
  const [formData, setFormData] = useState({
    fullName: "",
    dateOfBirth: "",
    race: "",
    phoneNumber: "",
    address: "",
    veteran: "yes", // Default for radio group
    activeDuty: "yes", // Default for radio group
    emergencyContact: "",
    primaryCareProvider: "",
    insurance: "",
    behavioralHealthProvider: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Handle form submission
  };

  const handleClearinghouse = () => {
    console.log("Send to clearinghouse:", formData);
    // Handle clearinghouse submission
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm px-3 py-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Registration</h1>
        </div>

        <div className="border-secondary1 m-2 py-6 px-4 border rounded-lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  placeholder="Aahsham Iqbal"
                  value={formData.fullName}
                  onChange={(e) =>
                    handleInputChange("fullName", e.target.value)
                  }
                  className="bg-gray150 border-none"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date Of Birth</Label>
                <Input
                  id="dateOfBirth"
                  placeholder="09/12/2001"
                  value={formData.dateOfBirth}
                  onChange={(e) =>
                    handleInputChange("dateOfBirth", e.target.value)
                  }
                  className="bg-gray150 border-none"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="race">Race</Label>
                <Input
                  id="race"
                  placeholder="African Black"
                  value={formData.race}
                  onChange={(e) => handleInputChange("race", e.target.value)}
                  className="bg-gray150 border-none"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  placeholder="+123 456 789"
                  value={formData.phoneNumber}
                  onChange={(e) =>
                    handleInputChange("phoneNumber", e.target.value)
                  }
                  className="bg-gray150 border-none"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  placeholder=""
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  className="bg-gray150 min-h-[80px] border-none"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label>Veteran</Label>
                  <RadioGroup
                    value={formData.veteran}
                    onValueChange={(value) =>
                      handleInputChange("veteran", value)
                    }
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
                    onValueChange={(value) =>
                      handleInputChange("activeDuty", value)
                    }
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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="emergencyContact">Emergency Contact</Label>
                <Input
                  id="emergencyContact"
                  placeholder="Mother, Father etc."
                  value={formData.emergencyContact}
                  onChange={(e) =>
                    handleInputChange("emergencyContact", e.target.value)
                  }
                  className="bg-gray150 border-none"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="primaryCareProvider">
                  Primary Care Provider
                </Label>
                <Input
                  id="primaryCareProvider"
                  placeholder="Dr. Ayesha Malik"
                  value={formData.primaryCareProvider}
                  onChange={(e) =>
                    handleInputChange("primaryCareProvider", e.target.value)
                  }
                  className="bg-gray150 border-none"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="insurance">Insurance</Label>
                <Input
                  id="insurance"
                  placeholder="1 1 - 4 2 2 3 4 7"
                  value={formData.insurance}
                  onChange={(e) =>
                    handleInputChange("insurance", e.target.value)
                  }
                  className="bg-gray150 border-none"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="behavioralHealthProvider">
                  Behavioral Health Provider
                </Label>
                <Input
                  id="behavioralHealthProvider"
                  placeholder="Dr. Ayesha Malik"
                  value={formData.behavioralHealthProvider}
                  onChange={(e) =>
                    handleInputChange(
                      "behavioralHealthProvider",
                      e.target.value
                    )
                  }
                  className="bg-gray150 border-none"
                />
              </div>
            </div>

            <div className="flex justify-between pt-6">
              <Button
                type="button"
                onClick={handleClearinghouse}
                className="bg-blue400 hover:bg-blue-600 text-white"
              >
                SEND TO CLEARINGHOUSE
              </Button>
            </div>
            <div className="flex justify-end">
              <Button
                type="submit"
                className="bg-blue400 hover:bg-blue-600 text-white px-5 py-4"
              >
                REGISTER
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
