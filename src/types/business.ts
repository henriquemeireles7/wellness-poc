import { BusinessCategory } from "@prisma/client";

/**
 * Types for Business Onboarding - Step 1: Basic Information
 */
export interface BusinessBasicInfoInput {
  businessName: string;
  description: string;
  category: string; // Maps to BusinessCategory enum
  phone: string;
  email: string;
}

/**
 * Types for Business Onboarding - Step 2: Location Details
 */
export interface BusinessLocationInput {
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  serviceRadius?: string; // Stored as number in DB
  operatingHoursStart?: string;
  operatingHoursEnd?: string;
  capacity?: string; // Stored as number in DB
}

/**
 * Types for Business Onboarding - Step 3: Profile Completion
 */
export interface BusinessProfileInput {
  profileImage?: string;
  certifications?: string;
  promotionalText?: string;
  yearsInBusiness?: string; // Stored as number in DB
}

/**
 * Combined type for complete business data
 */
export interface BusinessCreateInput
  extends Omit<BusinessBasicInfoInput, "businessName">,
    BusinessLocationInput,
    BusinessProfileInput {
  name: string; // Renamed from businessName to match Prisma schema
  ownerId: string;
}

/**
 * Business data returned from API
 */
export interface BusinessDTO {
  id: string;
  name: string;
  description: string | null;
  category: BusinessCategory | null;
  phone: string | null;
  email: string | null;

  // Location
  address: string | null;
  city: string | null;
  state: string | null;
  postalCode: string | null;
  country: string | null;
  serviceRadius: number | null;

  // Profile
  profileImage: string | null;
  certifications: string | null;
  promotionalText: string | null;
  yearsInBusiness: number | null;

  // Capacity
  capacity: number | null;

  // Timestamp
  createdAt: string;
  updatedAt: string;
}

/**
 * Type for availability time slots
 */
export interface AvailabilityInput {
  businessId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  duration: number;
}

// Map form category values to Prisma enum values
export const categoryToPrismaEnum = (
  category: string
): BusinessCategory | null => {
  switch (category.toUpperCase()) {
    case "TOUCH":
      return BusinessCategory.TOUCH;
    case "SIGHT":
      return BusinessCategory.SIGHT;
    case "SMELL":
      return BusinessCategory.SMELL;
    case "TASTE":
      return BusinessCategory.TASTE;
    case "SOUND":
      return BusinessCategory.SOUND;
    case "CONNECTION":
      return BusinessCategory.CONNECTION;
    default:
      return null;
  }
};
