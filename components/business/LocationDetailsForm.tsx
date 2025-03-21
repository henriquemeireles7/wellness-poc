"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useMultiStepForm } from "@/components/forms/MultiStepFormProvider";

// Define the validation schema
const formSchema = z.object({
  address: z.string().min(5, {
    message: "Address must be at least 5 characters.",
  }),
  city: z.string().min(2, {
    message: "City name must be at least 2 characters.",
  }),
  state: z.string().min(2, {
    message: "State must be at least 2 characters.",
  }),
  postalCode: z.string().min(5, {
    message: "Postal code must be at least 5 characters.",
  }),
  country: z.string().min(2, {
    message: "Country must be at least 2 characters.",
  }),
  serviceRadius: z.string().optional(),
  operatingHoursStart: z.string().optional(),
  operatingHoursEnd: z.string().optional(),
  capacity: z.string().optional(),
});

export type LocationDetailsFormValues = z.infer<typeof formSchema>;

interface LocationDetailsFormProps {
  onSubmit: (values: LocationDetailsFormValues) => void;
}

export function LocationDetailsForm({ onSubmit }: LocationDetailsFormProps) {
  // Get form data from context
  const { formData, updateFormData } = useMultiStepForm();

  // Initialize the form with react-hook-form
  const form = useForm<LocationDetailsFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      address: formData.address || "",
      city: formData.city || "",
      state: formData.state || "",
      postalCode: formData.postalCode || "",
      country: formData.country || "United States",
      serviceRadius:
        formData.serviceRadius !== undefined
          ? String(formData.serviceRadius)
          : "5",
      operatingHoursStart: formData.operatingHoursStart || "09:00",
      operatingHoursEnd: formData.operatingHoursEnd || "17:00",
      capacity:
        formData.capacity !== undefined ? String(formData.capacity) : "1",
    },
  });

  // Handle form submission
  const handleSubmit = (values: LocationDetailsFormValues) => {
    // Update the form data in the context with proper type conversions
    updateFormData({
      address: values.address,
      city: values.city,
      state: values.state,
      postalCode: values.postalCode,
      country: values.country,
      serviceRadius: values.serviceRadius
        ? parseInt(values.serviceRadius, 10)
        : null,
      operatingHoursStart: values.operatingHoursStart,
      operatingHoursEnd: values.operatingHoursEnd,
      capacity: values.capacity ? parseInt(values.capacity, 10) : null,
    });

    // Call the onSubmit callback
    onSubmit(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Address Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Business Location</h3>
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Street Address</FormLabel>
                <FormControl>
                  <Input placeholder="123 Main Street" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input placeholder="City" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>State/Province</FormLabel>
                  <FormControl>
                    <Input placeholder="State" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="postalCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Postal Code</FormLabel>
                  <FormControl>
                    <Input placeholder="12345" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a country" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="United States">
                        United States
                      </SelectItem>
                      <SelectItem value="Canada">Canada</SelectItem>
                      <SelectItem value="United Kingdom">
                        United Kingdom
                      </SelectItem>
                      <SelectItem value="Australia">Australia</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <Separator />

        {/* Service Details Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Service Details</h3>

          <FormField
            control={form.control}
            name="serviceRadius"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Service Area Radius (miles)</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select service radius" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="5">5 miles</SelectItem>
                    <SelectItem value="10">10 miles</SelectItem>
                    <SelectItem value="20">20 miles</SelectItem>
                    <SelectItem value="50">50 miles</SelectItem>
                    <SelectItem value="100">100+ miles</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  How far are you willing to travel for clients if you offer
                  mobile services?
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="operatingHoursStart"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Opening Time</FormLabel>
                  <FormControl>
                    <Input type="time" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="operatingHoursEnd"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Closing Time</FormLabel>
                  <FormControl>
                    <Input type="time" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="capacity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Maximum Clients Per Hour</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select capacity" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="1">1 client at a time</SelectItem>
                    <SelectItem value="2">2 clients at a time</SelectItem>
                    <SelectItem value="5">3-5 clients at a time</SelectItem>
                    <SelectItem value="10">6-10 clients at a time</SelectItem>
                    <SelectItem value="20">11+ clients at a time</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  How many clients can you serve simultaneously?
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </form>
    </Form>
  );
}
