"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { slugify } from "@/lib/text";
import { validateBusinessInput } from "@/lib/validation";
import { Prisma } from "@prisma/client";

type FormState = { error?: string } | null;

function generateSlug(name: string, city: string) {
  return `${slugify(name)}-${slugify(city)}`;
}

export async function createBusiness(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  let business;

  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || session.user.role !== "BUSINESS_OWNER") {
      return { error: "Unauthorized" };
    }

    // Always verify the account server-side before allowing listing creation.
    const dbUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        emailVerifiedAt: true,
      },
    });

    if (!dbUser) {
      return { error: "User account not found." };
    }

    if (!dbUser.emailVerifiedAt) {
      return {
        error: "Verify your email before creating a listing.",
      };
    }

    const parsed = validateBusinessInput(
      Object.fromEntries(formData.entries()) as Record<string, string>
    );

    if ("error" in parsed) {
      return parsed;
    }

    const {
      name,
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
    } = parsed.values;

    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      return { error: "Please select a valid category." };
    }

    const baseSlug = generateSlug(name, city);

    if (!baseSlug) {
      return {
        error: "Please enter a valid business name and city.",
      };
    }

    let slug = baseSlug;

    for (
      let suffix = 2;
      await prisma.business.findUnique({ where: { slug } });
      suffix += 1
    ) {
      slug = `${baseSlug}-${suffix}`;
    }

    try {
      business = await prisma.business.create({
        data: {
          ownerId: dbUser.id,
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
          seoDescription: description.substring(0, 150),
        },
      });
    } catch (error) {
      // A concurrent request can claim a candidate slug after
      // the availability check.
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        return {
          error:
            "A similar listing was just created. Please submit again.",
        };
      }

      throw error;
    }
  } catch (err) {
    console.error("Create business error:", err);
    return {
      error: "An unexpected error occurred. Please try again.",
    };
  }

  revalidatePath("/dashboard");
  redirect(`/dashboard/business/${business.id}/pay`);
}
