"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

function generateSlug(name: string, city: string) {
  return `${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${city.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Math.floor(Math.random() * 1000)}`;
}

export async function createBusiness(prevState: unknown, formData: FormData) {
  let business;
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return { error: "Unauthorized" };
    }

    const user = session.user;
    const name = formData.get("name") as string;
    const categoryId = formData.get("categoryId") as string;
    const description = formData.get("description") as string;
    
    if (!name || !categoryId) {
      return { error: "Name and Category are required." };
    }

    const phone = formData.get("phone") as string;
    const whatsapp = formData.get("whatsapp") as string;
    const website = formData.get("website") as string;
    const address = formData.get("address") as string;
    const locality = formData.get("locality") as string;
    const city = formData.get("city") as string;
    const state = formData.get("state") as string;
    const pincode = formData.get("pincode") as string;
    
    if (!city) {
      return { error: "City is required." };
    }

    const slug = generateSlug(name, city);

    // check if slug exists
    const existing = await prisma.business.findUnique({ where: { slug } });
    if (existing) {
      return { error: "A business with a similar name already exists in this city. Please try a different name." };
    }

    business = await prisma.business.create({
      data: {
        ownerId: user.id,
        name,
        slug,
        categoryId,
        description,
        phone,
        whatsapp,
        website,
        address,
        locality,
        city,
        state,
        pincode,
        status: "PENDING_PAYMENT", 
        seoTitle: `${name} | ${city}`,
        seoDescription: description ? description.substring(0, 150) : null,
      }
    });

  } catch (err) {
    console.error("Create business error:", err);
    return { error: "An unexpected error occurred. Please try again." };
  }

  revalidatePath("/dashboard");
  redirect(`/dashboard/business/${business.id}/pay`);
}
