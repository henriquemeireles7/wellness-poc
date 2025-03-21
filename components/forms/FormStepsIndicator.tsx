"use client";

import React from "react";
import { CheckIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
import { FormStep, useMultiStepForm } from "./MultiStepFormProvider";

interface FormStepsIndicatorProps {
  className?: string;
}

export function FormStepsIndicator({ className }: FormStepsIndicatorProps) {
  const { steps, currentStepIndex, isStepComplete, goToStep } =
    useMultiStepForm();

  return (
    <div className={cn("w-full py-4", className)}>
      <div className="flex justify-between items-center relative">
        {/* Progress bar */}
        <div className="absolute h-1 bg-neutral-200 inset-x-0 top-1/2 -translate-y-1/2 z-0">
          <div
            className="absolute h-1 bg-primary-500 inset-y-0 left-0 z-10 transition-all duration-300 ease-in-out"
            style={{
              width: `${(currentStepIndex / (steps.length - 1)) * 100}%`,
            }}
          />
        </div>

        {/* Step indicators */}
        {steps.map((step, index) => (
          <StepIndicator
            key={step.id}
            step={step}
            index={index}
            isActive={index === currentStepIndex}
            isComplete={isStepComplete(step.id)}
            isPast={index < currentStepIndex}
            onClick={() => goToStep(index)}
          />
        ))}
      </div>
    </div>
  );
}

interface StepIndicatorProps {
  step: FormStep;
  index: number;
  isActive: boolean;
  isComplete: boolean;
  isPast: boolean;
  onClick: () => void;
}

function StepIndicator({
  step,
  index,
  isActive,
  isComplete,
  isPast,
  onClick,
}: StepIndicatorProps) {
  // Determine if this step is clickable
  const isClickable = isPast || isComplete;

  return (
    <div className="flex flex-col items-center relative z-10">
      <button
        type="button"
        onClick={isClickable ? onClick : undefined}
        disabled={!isClickable}
        className={cn(
          "flex items-center justify-center w-10 h-10 rounded-full text-sm font-medium transition-all",
          isActive
            ? "bg-primary-500 text-white shadow-md"
            : isComplete
            ? "bg-primary-500 text-white"
            : isPast
            ? "bg-primary-200 text-primary-700"
            : "bg-neutral-200 text-neutral-500",
          isClickable &&
            !isActive &&
            "hover:bg-primary-400 hover:text-white cursor-pointer"
        )}
        aria-current={isActive ? "step" : undefined}
      >
        {isComplete ? <CheckIcon className="h-5 w-5" /> : index + 1}
      </button>

      <span
        className={cn(
          "mt-2 text-xs font-medium",
          isActive
            ? "text-primary-700"
            : isComplete || isPast
            ? "text-primary-600"
            : "text-neutral-500"
        )}
      >
        {step.title}
      </span>
    </div>
  );
}
