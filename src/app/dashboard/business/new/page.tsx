import { prisma } from "@/lib/prisma";
import { NewBusinessForm } from "./NewBusinessForm";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { slugify } from "@/lib/text";

export const dynamic = "force-dynamic";

export default async function NewBusinessPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

const dbUser = await prisma.user.findUnique({
  where: { id: session.user.id },
  select: {
    id: true,
    emailVerifiedAt: true,
  },
});

if (!dbUser) redirect("/login");

if (!dbUser.emailVerifiedAt) {
  redirect("/verify-email");
}

  let categories = await prisma.category.findMany({
    orderBy: { name: "asc" }
  });

  // Auto-seed categories if empty
  if (categories.length === 0) {
    const defaultCategories = [
      "Restaurants & Cafes", "Healthcare & Clinics", "Salons & Spas",
      "Home Services", "Education & Tutors", "Fitness & Gyms",
      "Automotive & Repair", "Retail & Shopping", "Professional Services",
      "Real Estate"
    ];
    
    await Promise.all(defaultCategories.map(async (name) => {
      await prisma.category.create({
        data: {
          name,
          slug: slugify(name),
          description: `Find the best ${name.toLowerCase()}`
        }
      });
    }));
    
    categories = await prisma.category.findMany({
      orderBy: { name: "asc" }
    });
  }

  return (
    <div className="bg-white p-8 md:p-12 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/40 relative overflow-hidden">
      <div className="absolute top-0 right-0 -mr-24 -mt-24 w-64 h-64 rounded-full bg-blue-600/5 blur-3xl"></div>
      
      <div className="mb-10 pb-6 border-b border-slate-100 relative z-10">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Add New Business</h1>
        <p className="text-slate-500 mt-2 text-lg">Fill in the details to create your listing. You&apos;ll be able to add photos and services after payment.</p>
      </div>

      <div className="relative z-10">
        <NewBusinessForm categories={categories} />
      </div>
    </div>
  );
}
