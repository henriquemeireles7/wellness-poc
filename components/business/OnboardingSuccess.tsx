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
import { CheckCircledIcon } from "@radix-ui/react-icons";
import { useMultiStepForm } from "@/components/forms/MultiStepFormProvider";
import Link from "next/link";

export function OnboardingSuccess() {
  const { formData } = useMultiStepForm();

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <CheckCircledIcon className="h-12 w-12 text-success-500" />
        </div>
        <CardTitle className="text-2xl">Setup Complete!</CardTitle>
        <CardDescription>
          Your business profile has been successfully created and is now ready
          to receive bookings.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="bg-neutral-50 rounded-lg p-6 space-y-4">
          <h3 className="font-medium text-lg">Business Summary</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 text-sm">
            <div>
              <p className="text-neutral-500">Business Name</p>
              <p className="font-medium">
                {formData.businessName || formData.name || "Your Business"}
              </p>
            </div>

            <div>
              <p className="text-neutral-500">Category</p>
              <p className="font-medium">
                {formData.category
                  ? formData.category.toString().charAt(0) +
                    formData.category.toString().slice(1).toLowerCase()
                  : "Wellness Service"}
              </p>
            </div>

            <div>
              <p className="text-neutral-500">Contact</p>
              <p className="font-medium">{formData.email || ""}</p>
              <p className="font-medium">{formData.phone || ""}</p>
            </div>

            <div>
              <p className="text-neutral-500">Location</p>
              <p className="font-medium">
                {formData.address || ""}, {formData.city || ""},{" "}
                {formData.state || ""} {formData.postalCode || ""}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 space-y-4">
          <h3 className="font-medium text-lg">Next Steps</h3>

          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-primary-500 font-medium">1.</span>
              <span>
                Set up your detailed availability in the calendar to begin
                accepting bookings.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary-500 font-medium">2.</span>
              <span>
                Add payment information to receive payments from clients.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary-500 font-medium">3.</span>
              <span>
                Review and customize your business profile from the dashboard.
              </span>
            </li>
          </ul>
        </div>
      </CardContent>

      <CardFooter className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button asChild>
          <Link href="/dashboard">Go to Dashboard</Link>
        </Button>

        <Button variant="outline" asChild>
          <Link href="/availability">Set Up Availability</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
