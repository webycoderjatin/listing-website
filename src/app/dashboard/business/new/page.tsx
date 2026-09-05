import { prisma } from "@/lib/prisma";
import { NewBusinessForm } from "./NewBusinessForm";

export const dynamic = "force-dynamic";

export default async function NewBusinessPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" }
  });

  return (
    <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
      <div className="mb-8 border-b pb-6">
        <h1 className="text-2xl font-bold text-gray-900">Add New Business</h1>
        <p className="text-gray-500 mt-1">Fill in the details to create your listing. You&apos;ll be able to add photos and services after payment.</p>
      </div>

      <NewBusinessForm categories={categories} />
    </div>
  );
}
