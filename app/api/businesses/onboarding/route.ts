import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { BusinessCategory, Prisma } from "@prisma/client";

// Map form categories to Prisma enum values
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

/**
 * POST /api/businesses/onboarding
 * Creates a new business profile from onboarding form data
 */
export async function POST(req: NextRequest) {
  try {
    // Get the form data
    const formData = await req.json();

    // Find a user to link to the business
    let ownerId: string;
    if (formData.ownerId) {
      ownerId = formData.ownerId;
    } else {
      // For development/testing when no user is provided
      const demoUser = await prisma.user.findFirst();
      if (!demoUser) {
        return NextResponse.json(
          { error: "No user found to assign as business owner" },
          { status: 400 }
        );
      }
      ownerId = demoUser.id;
    }

    // Convert form data to Prisma model data with required owner field
    const businessData: Prisma.BusinessCreateInput = {
      name: formData.businessName || formData.name,
      description: formData.description,
      category: formData.category || mapCategoryToPrisma(formData.category),
      phone: formData.phone,
      email: formData.email,
      address: formData.address,
      city: formData.city,
      state: formData.state,
      postalCode: formData.postalCode,
      country: formData.country,
      serviceRadius: formData.serviceRadius
        ? parseInt(formData.serviceRadius, 10)
        : null,
      profileImage: formData.profileImage,
      certifications: formData.certifications,
      promotionalText: formData.promotionalText,
      yearsInBusiness: formData.yearsInBusiness
        ? parseInt(formData.yearsInBusiness, 10)
        : null,
      capacity: formData.capacity ? parseInt(formData.capacity, 10) : null,
      owner: {
        connect: { id: ownerId },
      },
    };

    // Create new business record
    const business = await prisma.business.create({
      data: businessData,
    });

    return NextResponse.json(business, { status: 201 });
  } catch (error) {
    console.error("Error creating business:", error);
    return NextResponse.json(
      { error: "Failed to create business" },
      { status: 500 }
    );
  }
}
