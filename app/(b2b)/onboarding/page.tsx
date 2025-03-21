"use client";

import React, { useState } from "react";
import {
  MultiStepFormProvider,
  FormStep,
} from "@/components/forms/MultiStepFormProvider";
import { FormStepsIndicator } from "@/components/forms/FormStepsIndicator";
import { FormStep as FormStepComponent } from "@/components/forms/FormStep";
import {
  BasicInfoForm,
  BasicInfoFormValues,
} from "@/components/business/BasicInfoForm";
import {
  LocationDetailsForm,
  LocationDetailsFormValues,
} from "@/components/business/LocationDetailsForm";
import {
  ProfileCompletionForm,
  ProfileCompletionFormValues,
} from "@/components/business/ProfileCompletionForm";
import { OnboardingSuccess } from "@/components/business/OnboardingSuccess";

// Define the steps for the form
const steps: FormStep[] = [
  {
    id: "basic-info",
    title: "Basic Info",
    description: "Tell us about your business",
  },
  {
    id: "location-details",
    title: "Location",
    description: "Where are you located",
  },
  {
    id: "profile-completion",
    title: "Profile",
    description: "Complete your profile",
  },
  {
    id: "success",
    title: "Complete",
    description: "All done!",
  },
];

export default function OnboardingPage() {
  // Track submission state
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock submission handlers with validation
  const handleBasicInfoSubmit = async (data: Record<string, unknown>) => {
    const values = data as BasicInfoFormValues;
    console.log("Basic info values:", values);
    // Simulate validation/API call
    await new Promise((resolve) => setTimeout(resolve, 500));
    return true; // validation passed
  };

  const handleLocationDetailsSubmit = async (data: Record<string, unknown>) => {
    const values = data as LocationDetailsFormValues;
    console.log("Location details values:", values);
    // Simulate validation/API call
    await new Promise((resolve) => setTimeout(resolve, 500));
    return true; // validation passed
  };

  const handleProfileCompletionSubmit = async (
    data: Record<string, unknown>
  ) => {
    const values = data as ProfileCompletionFormValues;
    setIsSubmitting(true);

    try {
      console.log("Profile completion values:", values);
      // Simulate an API call to save all the form data
      await new Promise((resolve) => setTimeout(resolve, 1500));
      return true; // validation passed
    } catch (error) {
      console.error("Error submitting form:", error);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-2">
          Set Up Your Business
        </h1>
        <p className="text-neutral-600 text-center mb-8">
          Complete the steps below to create your wellness business profile.
        </p>

        <MultiStepFormProvider steps={steps}>
          {/* Progress indicator */}
          <FormStepsIndicator className="mb-8" />

          {/* Form steps */}
          <div className="space-y-6">
            {/* Step 1: Basic Info */}
            <FormStepComponent
              stepId="basic-info"
              title="Business Information"
              description="Tell us about your wellness business"
              onSubmit={handleBasicInfoSubmit}
            >
              <BasicInfoForm onSubmit={() => {}} />
            </FormStepComponent>

            {/* Step 2: Location Details */}
            <FormStepComponent
              stepId="location-details"
              title="Location & Service Details"
              description="Where you operate and how clients can find you"
              onSubmit={handleLocationDetailsSubmit}
            >
              <LocationDetailsForm onSubmit={() => {}} />
            </FormStepComponent>

            {/* Step 3: Profile Completion */}
            <FormStepComponent
              stepId="profile-completion"
              title="Complete Your Profile"
              description="Add finishing touches to make your profile stand out"
              onSubmit={handleProfileCompletionSubmit}
              isSubmitting={isSubmitting}
              nextButtonLabel="Complete Setup"
            >
              <ProfileCompletionForm onSubmit={() => {}} />
            </FormStepComponent>

            {/* Step 4: Success */}
            <FormStepComponent
              stepId="success"
              title="Setup Complete"
              description="Your business profile is ready"
              showBackButton={false}
            >
              <OnboardingSuccess />
            </FormStepComponent>
          </div>
        </MultiStepFormProvider>
      </div>
    </div>
  );
}
