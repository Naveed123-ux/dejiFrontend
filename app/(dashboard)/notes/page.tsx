"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

export default function Notes() {
  const [formData, setFormData] = useState({
    recentSuicideAttempt: "",
    recentSuicideAttemptExplanation: "",
    recentIntentionOfSelfHarm: "",
    recentIntentionOfSelfHarmExplanation: "",
    suicidalIdeation: "",
    suicidalIdeationPlan: "",
    // Associated Symptoms
    sleep: false,
    interest: false,
    guilt: false,
    energy: false,
    concentration: false,
    appetite: false,
    anxious: false,
    irritable: false,
    worthless: false,
    hopeless: false,
    // Function
    declineInWorkSchool: "",
    selfCareDecline: "",
    hygiene: "",
    unintentionalWeightLoss: "",
    // Stressors
    priorHospitalizationAgreeable: "",
  });

  const handleRadioChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCheckboxChange = (field: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: checked
    }));
  };

  const handleTextareaChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="space-y-6 p-4 lg:p-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Notes</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Depression/SI:</CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Recent Suicide Attempt */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900">Recent Suicide Attempt</h3>
              <RadioGroup
                value={formData.recentSuicideAttempt}
                onValueChange={(value) => handleRadioChange("recentSuicideAttempt", value)}
                className="flex gap-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="suicide-yes" />
                  <Label htmlFor="suicide-yes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="suicide-no" />
                  <Label htmlFor="suicide-no">No</Label>
                </div>
              </RadioGroup>
              <div>
                <Label className="text-sm text-gray-600">If, Yes then Explain..</Label>
                <Textarea
                  value={formData.recentSuicideAttemptExplanation}
                  onChange={(e) => handleTextareaChange("recentSuicideAttemptExplanation", e.target.value)}
                  className="mt-2 bg-gray-50 border-none min-h-[80px]"
                  placeholder=""
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium text-gray-900">Recent Intention Of Self Harm</h3>
              <RadioGroup
                value={formData.recentIntentionOfSelfHarm}
                onValueChange={(value) => handleRadioChange("recentIntentionOfSelfHarm", value)}
                className="flex gap-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="self-harm-yes" />
                  <Label htmlFor="self-harm-yes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="self-harm-no" />
                  <Label htmlFor="self-harm-no">No</Label>
                </div>
              </RadioGroup>
              <div>
                <Label className="text-sm text-gray-600">If, Yes then Explain..</Label>
                <Textarea
                  value={formData.recentIntentionOfSelfHarmExplanation}
                  onChange={(e) => handleTextareaChange("recentIntentionOfSelfHarmExplanation", e.target.value)}
                  className="mt-2 bg-gray-50 border-none min-h-[80px]"
                  placeholder=""
                />
              </div>
            </div>
          </div>

          {/* Suicidal Ideation */}
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900">Suicidal Ideation</h3>
            <RadioGroup
              value={formData.suicidalIdeation}
              onValueChange={(value) => handleRadioChange("suicidalIdeation", value)}
              className="flex gap-6"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="ideation-yes" />
                <Label htmlFor="ideation-yes">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="ideation-no" />
                <Label htmlFor="ideation-no">No</Label>
              </div>
            </RadioGroup>
            <div>
              <Label className="text-sm text-gray-600">Plan</Label>
              <Textarea
                value={formData.suicidalIdeationPlan}
                onChange={(e) => handleTextareaChange("suicidalIdeationPlan", e.target.value)}
                className="mt-2 bg-gray-50 border-none min-h-[80px]"
                placeholder=""
              />
            </div>
          </div>

          {/* Past Diagnosis */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Past Diagnosis</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Associated Symptoms */}
              <div className="space-y-4">
                <h3 className="font-medium text-gray-900">Associated Symptoms</h3>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { key: "sleep", label: "Sleep" },
                    { key: "interest", label: "Interest" },
                    { key: "guilt", label: "Guilt" },
                    { key: "energy", label: "Energy" },
                    { key: "concentration", label: "Concentration" },
                    { key: "appetite", label: "Appetite" },
                    { key: "anxious", label: "Anxious" },
                    { key: "irritable", label: "Irritable" },
                    { key: "worthless", label: "Worthless" },
                    { key: "hopeless", label: "Hopeless" },
                  ].map((item) => (
                    <div key={item.key} className="flex items-center space-x-2">
                      <Checkbox
                        id={item.key}
                        checked={formData[item.key as keyof typeof formData] as boolean}
                        onCheckedChange={(checked) => handleCheckboxChange(item.key, checked as boolean)}
                      />
                      <Label htmlFor={item.key} className="text-sm">
                        {item.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Function */}
              <div className="space-y-4">
                <h3 className="font-medium text-gray-900">Function</h3>
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm">Decline in Work | School:</Label>
                    <RadioGroup
                      value={formData.declineInWorkSchool}
                      onValueChange={(value) => handleRadioChange("declineInWorkSchool", value)}
                      className="flex gap-4 mt-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="work-decline-yes" />
                        <Label htmlFor="work-decline-yes">Yes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="work-decline-no" />
                        <Label htmlFor="work-decline-no">No</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <Label className="text-sm">Self Care Decline:</Label>
                    <RadioGroup
                      value={formData.selfCareDecline}
                      onValueChange={(value) => handleRadioChange("selfCareDecline", value)}
                      className="flex gap-4 mt-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="hygiene" id="self-care-hygiene" />
                        <Label htmlFor="self-care-hygiene">Hygiene</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <Label className="text-sm">Unintentional Weight Loss:</Label>
                    <RadioGroup
                      value={formData.unintentionalWeightLoss}
                      onValueChange={(value) => handleRadioChange("unintentionalWeightLoss", value)}
                      className="flex gap-4 mt-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="weight-loss-yes" />
                        <Label htmlFor="weight-loss-yes">Yes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="weight-loss-no" />
                        <Label htmlFor="weight-loss-no">No</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              </div>
            </div>

            {/* Stressors */}
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900">Stressors</h3>
              <div>
                <Label className="text-sm">Pt or Guardian Agreeable with Hospitalization:</Label>
                <RadioGroup
                  value={formData.priorHospitalizationAgreeable}
                  onValueChange={(value) => handleRadioChange("priorHospitalizationAgreeable", value)}
                  className="flex gap-4 mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="hospitalization-yes" />
                    <Label htmlFor="hospitalization-yes">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="hospitalization-no" />
                    <Label htmlFor="hospitalization-no">No</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          </div>

          {/* Create Note Button */}
          <div className="flex justify-end pt-6">
            <Button className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-2">
              CREATE NOTE
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}