"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { slugify } from "@/lib/text";

type FormState = { error?: string } | null;

function generateSlug(name: string, city: string) {
  return `${slugify(name)}-${slugify(city)}`;
}

export async function createBusiness(_prevState: FormState, formData: FormData): Promise<FormState> {
  let business;
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id || session.user.role !== "BUSINESS_OWNER") {
      return { error: "Unauthorized" };
    }

    const user = session.user;
    const read = (key: string) => String(formData.get(key) ?? "").trim();
    const name = read("name");
    const categoryId = read("categoryId");
    const description = read("description");
    
    if (!name || !categoryId) {
      return { error: "Name and Category are required." };
    }

    const phone = read("phone");
    const whatsapp = read("whatsapp");
    const website = read("website");
    const address = read("address");
    const locality = read("locality");
    const city = read("city");
    const state = read("state");
    const pincode = read("pincode");
    
    if (!city) {
      return { error: "City is required." };
    }

    if (!description || !address || !locality || !state || !pincode) {
      return { error: "Description and all location fields are required." };
    }

    const category = await prisma.category.findUnique({ where: { id: categoryId } });
    if (!category) {
      return { error: "Please select a valid category." };
    }

    const baseSlug = generateSlug(name, city);
    if (!baseSlug) {
      return { error: "Please enter a valid business name and city." };
    }

    let slug = baseSlug;
    for (let suffix = 2; await prisma.business.findUnique({ where: { slug } }); suffix += 1) {
      slug = `${baseSlug}-${suffix}`;
    }

    business = await prisma.business.create({
      data: {
        ownerId: user.id,
        name,
        slug,
        categoryId,
        description,
        phone: phone || null,
        whatsapp: whatsapp || null,
        website: website || null,
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
