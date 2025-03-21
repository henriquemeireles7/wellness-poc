import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.json();

    // Get user ID (either from auth session or temp user)
    let ownerId = formData.ownerId;
    if (!ownerId) {
      // For development - get first user
      const user = await prisma.user.findFirst();
      if (!user)
        return NextResponse.json({ error: "No user found" }, { status: 400 });
      ownerId = user.id;
    }

    // Create or update business record
    const business = await prisma.business.upsert({
      where: {
        // Use a unique identifier - for new businesses, this might be a temporary ID
        id: formData.id || "temp-" + Date.now(),
      },
      update: {
        name: formData.businessName,
        description: formData.description,
        category: formData.category,
        phone: formData.phone,
        email: formData.email,
      },
      create: {
        name: formData.businessName,
        description: formData.description,
        category: formData.category,
        phone: formData.phone,
        email: formData.email,
        owner: {
          connect: { id: ownerId },
        },
      },
    });

    return NextResponse.json(business);
  } catch (error) {
    console.error("Error saving basic info:", error);
    return NextResponse.json({ error: "Failed to save data" }, { status: 500 });
  }
}
