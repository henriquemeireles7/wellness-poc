"use client";

import React, { useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useMultiStepForm } from "@/components/forms/MultiStepFormProvider";
import Image from "next/image";

// Define the validation schema
const formSchema = z.object({
  profileImage: z.string().optional(),
  certifications: z.string().optional(),
  promotionalText: z
    .string()
    .max(200, {
      message: "Promotional text must not exceed 200 characters.",
    })
    .optional(),
  yearsInBusiness: z.string().optional(),
});

export type ProfileCompletionFormValues = z.infer<typeof formSchema>;

interface ProfileCompletionFormProps {
  onSubmit: (values: ProfileCompletionFormValues) => void;
}

export function ProfileCompletionForm({
  onSubmit,
}: ProfileCompletionFormProps) {
  // Get form data from context
  const { formData, updateFormData } = useMultiStepForm();

  // For image preview
  const [imagePreview, setImagePreview] = useState<string | null>(
    formData.profileImage || null
  );

  // Initialize the form with react-hook-form
  const form = useForm<ProfileCompletionFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      profileImage: formData.profileImage || "",
      certifications: formData.certifications || "",
      promotionalText: formData.promotionalText || "",
      yearsInBusiness:
        formData.yearsInBusiness !== null &&
        formData.yearsInBusiness !== undefined
          ? String(formData.yearsInBusiness)
          : "",
    },
  });

  // Handle image upload (mock)
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real implementation, you would upload the file to a server
      // For now, we'll just create a local URL for preview
      const url = URL.createObjectURL(file);
      setImagePreview(url);
      form.setValue("profileImage", url);
    }
  };

  // Handle form submission
  const handleSubmit = (values: ProfileCompletionFormValues) => {
    // Update the form data in the context with proper type conversions
    updateFormData({
      profileImage: values.profileImage,
      certifications: values.certifications,
      promotionalText: values.promotionalText,
      yearsInBusiness: values.yearsInBusiness
        ? parseInt(values.yearsInBusiness, 10)
        : null,
    });

    // Call the onSubmit callback
    onSubmit(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Profile Image Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Profile Image</h3>

          <div className="flex flex-col items-center sm:flex-row sm:items-start gap-4">
            {/* Image Preview */}
            <div className="relative w-40 h-40 bg-neutral-100 rounded-lg overflow-hidden flex items-center justify-center">
              {imagePreview ? (
                <Image
                  src={imagePreview}
                  alt="Profile preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-neutral-400 text-sm text-center px-2">
                  No image selected
                </span>
              )}
            </div>

            {/* Upload Controls */}
            <div className="flex flex-col gap-2 flex-1">
              <FormLabel>Business Profile Image</FormLabel>
              <FormDescription>
                Upload a logo or image that represents your business. This will
                be displayed to potential clients.
              </FormDescription>

              <Input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="mt-2"
              />

              {imagePreview && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setImagePreview(null);
                    form.setValue("profileImage", "");
                  }}
                  className="w-fit"
                >
                  Remove Image
                </Button>
              )}
            </div>
          </div>
        </div>

        <Separator />

        {/* Additional Details Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Additional Details</h3>

          <FormField
            control={form.control}
            name="yearsInBusiness"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Years in Business</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. 5" {...field} />
                </FormControl>
                <FormDescription>
                  How long have you been offering these services?
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="certifications"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Certifications & Credentials</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="List any relevant certifications, licenses, or qualifications..."
                    className="min-h-24 resize-y"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  What credentials would you like your clients to know about?
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="promotionalText"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Promotional Tagline</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="A short phrase that captures the essence of your services..."
                    className="resize-y"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  A short statement that will appear with your business listing
                  (max 200 characters).
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
