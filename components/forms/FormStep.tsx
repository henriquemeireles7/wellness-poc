"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useMultiStepForm } from "./MultiStepFormProvider";
import { cn } from "@/lib/utils";

interface FormStepProps {
  stepId: string;
  title: string;
  description: string;
  children: React.ReactNode;
  onSubmit?: (data: Record<string, unknown>) => Promise<boolean> | boolean;
  isSubmitting?: boolean;
  className?: string;
  nextButtonLabel?: string;
  backButtonLabel?: string;
  showBackButton?: boolean;
}

export function FormStep({
  stepId,
  title,
  description,
  children,
  onSubmit,
  isSubmitting = false,
  className,
  nextButtonLabel = "Continue",
  backButtonLabel = "Back",
  showBackButton = true,
}: FormStepProps) {
  const {
    currentStepIndex,
    formData,
    goToNextStep,
    goToPreviousStep,
    isFirstStep,
    isLastStep,
    markStepComplete,
    steps,
  } = useMultiStepForm();

  // Get the current step to check if this component should be rendered
  const currentStep = steps[currentStepIndex];

  // Check if this step is currently active
  const isActive = currentStep?.id === stepId;

  // Function to handle the submission of this step
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // If there's an onSubmit handler, call it
      if (onSubmit) {
        const isValid = await onSubmit(formData);

        // If validation passes, proceed to the next step
        if (isValid) {
          markStepComplete(stepId);
          goToNextStep();
        }
      } else {
        // If no validation is needed, just proceed
        markStepComplete(stepId);
        goToNextStep();
      }
    } catch (error) {
      // Handle any errors from the onSubmit function
      if (error instanceof Error) {
        console.error("Form submission error:", error.message);
      }
    }
  };

  // Only render if this step is active
  if (!isActive) return null;

  return (
    <Card className={cn("w-full max-w-4xl mx-auto", className)}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>

      <CardContent>
        <form id={`form-${stepId}`} onSubmit={handleSubmit}>
          {children}
        </form>
      </CardContent>

      <CardFooter className="flex justify-between">
        {showBackButton && !isFirstStep && (
          <Button
            type="button"
            variant="outline"
            onClick={goToPreviousStep}
            disabled={isSubmitting}
          >
            {backButtonLabel}
          </Button>
        )}

        <div
          className={cn("flex justify-end", {
            "ml-auto": showBackButton && !isFirstStep,
          })}
        >
          <Button type="submit" form={`form-${stepId}`} disabled={isSubmitting}>
            {isSubmitting && (
              <svg
                className="animate-spin h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            )}
            {isLastStep ? "Complete" : nextButtonLabel}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
