"use client";

import React, { createContext, useState, useContext, ReactNode } from "react";
import { Business } from "@prisma/client";

export interface FormStep {
  id: string;
  title: string;
  description: string;
}

// Define type for our form data that matches the Business model structure
export type BusinessFormData = Partial<
  Omit<Business, "id" | "ownerId" | "createdAt" | "updatedAt">
> & {
  // Add any form-specific fields not in the Business model
  id?: string; // Business ID from database
  businessName?: string; // Maps to name in Business
  operatingHoursStart?: string;
  operatingHoursEnd?: string;
};

interface MultiStepFormContextType {
  // Current step state
  currentStepIndex: number;
  setCurrentStepIndex: (index: number) => void;

  // Complete status tracking
  completedSteps: Record<string, boolean>;
  markStepComplete: (stepId: string) => void;
  markStepIncomplete: (stepId: string) => void;
  isStepComplete: (stepId: string) => boolean;

  // Form data management
  formData: BusinessFormData;
  updateFormData: (data: Partial<BusinessFormData>) => void;

  // Navigation helpers
  steps: FormStep[];
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  goToStep: (index: number) => void;
  isFirstStep: boolean;
  isLastStep: boolean;
}

// Create context with default values
const MultiStepFormContext = createContext<
  MultiStepFormContextType | undefined
>(undefined);

interface MultiStepFormProviderProps {
  children: ReactNode;
  steps: FormStep[];
  initialData?: Record<string, unknown>;
}

export function MultiStepFormProvider({
  children,
  steps,
  initialData = {},
}: MultiStepFormProviderProps) {
  // State for tracking the current step index
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  // State for tracking completed steps
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>(
    {}
  );

  // State for form data
  const [formData, setFormData] = useState<BusinessFormData>(
    initialData as BusinessFormData
  );

  // Function to mark a step as complete
  const markStepComplete = (stepId: string) => {
    setCompletedSteps((prev) => ({ ...prev, [stepId]: true }));
  };

  // Function to mark a step as incomplete
  const markStepIncomplete = (stepId: string) => {
    setCompletedSteps((prev) => ({ ...prev, [stepId]: false }));
  };

  // Function to check if a step is complete
  const isStepComplete = (stepId: string) => {
    return !!completedSteps[stepId];
  };

  // Function to update form data
  const updateFormData = (data: Partial<BusinessFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  // Navigation helpers
  const goToNextStep = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  const goToPreviousStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const goToStep = (index: number) => {
    if (index >= 0 && index < steps.length) {
      setCurrentStepIndex(index);
    }
  };

  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === steps.length - 1;

  // Construct context value
  const value = {
    currentStepIndex,
    setCurrentStepIndex,
    completedSteps,
    markStepComplete,
    markStepIncomplete,
    isStepComplete,
    formData,
    updateFormData,
    steps,
    goToNextStep,
    goToPreviousStep,
    goToStep,
    isFirstStep,
    isLastStep,
  };

  return (
    <MultiStepFormContext.Provider value={value}>
      {children}
    </MultiStepFormContext.Provider>
  );
}

// Custom hook to use the form context
export function useMultiStepForm() {
  const context = useContext(MultiStepFormContext);

  if (context === undefined) {
    throw new Error(
      "useMultiStepForm must be used within a MultiStepFormProvider"
    );
  }

  return context;
}
