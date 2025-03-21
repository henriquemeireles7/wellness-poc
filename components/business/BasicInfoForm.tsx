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
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMultiStepForm } from "@/components/forms/MultiStepFormProvider";
import { BusinessCategory } from "@prisma/client";

// Define the validation schema
const formSchema = z.object({
  businessName: z.string().min(2, {
    message: "Business name must be at least 2 characters.",
  }),
  description: z
    .string()
    .min(10, {
      message: "Description must be at least 10 characters.",
    })
    .max(500, {
      message: "Description must not exceed 500 characters.",
    }),
  category: z.string({
    required_error: "Please select a business category.",
  }),
  phone: z.string().regex(/^\+?[0-9\s\-\(\)]{7,20}$/, {
    message: "Please enter a valid phone number.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
});

export type BasicInfoFormValues = z.infer<typeof formSchema>;

interface BasicInfoFormProps {
  onSubmit: (values: BasicInfoFormValues) => void;
}

// Map form values to Prisma enum
const mapCategoryToPrisma = (category: string): BusinessCategory | null => {
  const categoryMap: Record<string, BusinessCategory> = {
    touch: BusinessCategory.TOUCH,
    sight: BusinessCategory.SIGHT,
    smell: BusinessCategory.SMELL,
    taste: BusinessCategory.TASTE,
    sound: BusinessCategory.SOUND,
    connection: BusinessCategory.CONNECTION,
  };

  return categoryMap[category] || null;
};

export function BasicInfoForm({ onSubmit }: BasicInfoFormProps) {
  // Get form data from context
  const { formData, updateFormData } = useMultiStepForm();

  // Initialize the form with react-hook-form
  const form = useForm<BasicInfoFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      businessName: formData.businessName || "",
      description: formData.description || "",
      category: formData.category || "",
      phone: formData.phone || "",
      email: formData.email || "",
    },
  });

  // Handle form submission
  const handleSubmit = async (values: BasicInfoFormValues) => {
    // Convert string category to Prisma enum
    const prismaCategory = mapCategoryToPrisma(values.category);

    // First update the form context
    updateFormData({
      businessName: values.businessName,
      name: values.businessName,
      description: values.description,
      category: prismaCategory,
      phone: values.phone,
      email: values.email,
    });

    // Then save to database
    try {
      const response = await fetch("/api/businesses/basic-info", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessName: values.businessName,
          name: values.businessName,
          description: values.description,
          category: values.category, // Send string value and convert on server
          phone: values.phone,
          email: values.email,
          id: formData.id, // Include business ID if editing existing record
        }),
      });

      if (!response.ok) throw new Error("Failed to save");

      const data = await response.json();

      // Update form context with the ID from database
      updateFormData({
        id: data.id,
      });

      // Call the onSubmit callback
      onSubmit(values);
    } catch (error) {
      console.error("Error saving data:", error);
      // Handle error (show notification, etc.)
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="businessName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Business Name</FormLabel>
              <FormControl>
                <Input placeholder="Your Business Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Business Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="sound">Sound</SelectItem>
                  <SelectItem value="sight">Sight</SelectItem>
                  <SelectItem value="smell">Smell</SelectItem>
                  <SelectItem value="taste">Taste</SelectItem>
                  <SelectItem value="touch">Touch</SelectItem>
                  <SelectItem value="connection">Connection</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input placeholder="+1 (555) 123-4567" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Business Email</FormLabel>
                <FormControl>
                  <Input placeholder="your@business.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Business Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe your wellness services and what makes your business special..."
                  className="min-h-32 resize-y"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
