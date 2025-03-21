import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import {
  BusinessCreateInput,
  categoryToPrismaEnum,
} from "@/src/types/business";

/**
 * GET /api/businesses
 * Retrieves a list of businesses
 */
export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const category = searchParams.get("category");
    const location = searchParams.get("location");

    // Build query filters
    const filters: Prisma.BusinessWhereInput = {};
    if (category) {
      filters.category = categoryToPrismaEnum(category);
    }
    if (location) {
      filters.OR = [
        { city: { contains: location, mode: "insensitive" } },
        { state: { contains: location, mode: "insensitive" } },
      ];
    }

    const businesses = await prisma.business.findMany({
      where: filters,
      select: {
        id: true,
        name: true,
        description: true,
        category: true,
        city: true,
        state: true,
        profileImage: true,
      },
    });

    return NextResponse.json(businesses);
  } catch (error) {
    console.error("Error fetching businesses:", error);
    return NextResponse.json(
      { error: "Failed to fetch businesses" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/businesses
 * Creates a new business profile
 */
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    // Convert string values to numbers where needed
    const parsedData: BusinessCreateInput = {
      ...data,
      serviceRadius: data.serviceRadius
        ? parseInt(data.serviceRadius, 10)
        : null,
      capacity: data.capacity ? parseInt(data.capacity, 10) : null,
      yearsInBusiness: data.yearsInBusiness
        ? parseInt(data.yearsInBusiness, 10)
        : null,
      category: categoryToPrismaEnum(data.category),
    };

    // Create new business record
    const business = await prisma.business.create({
      data: {
        name: parsedData.name,
        description: parsedData.description,
        category: categoryToPrismaEnum(data.category),
        phone: parsedData.phone,
        email: parsedData.email,
        address: parsedData.address,
        city: parsedData.city,
        state: parsedData.state,
        postalCode: parsedData.postalCode,
        country: parsedData.country,
        serviceRadius: parsedData.serviceRadius
          ? parseInt(String(parsedData.serviceRadius), 10)
          : null,
        profileImage: parsedData.profileImage,
        certifications: parsedData.certifications,
        promotionalText: parsedData.promotionalText,
        yearsInBusiness: parsedData.yearsInBusiness
          ? parseInt(String(parsedData.yearsInBusiness), 10)
          : null,
        capacity: parsedData.capacity
          ? parseInt(String(parsedData.capacity), 10)
          : null,
        owner: {
          connect: { id: parsedData.ownerId },
        },
      },
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
