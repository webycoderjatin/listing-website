import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { canAdminTransitionListing } from "@/lib/listing";

export const dynamic = "force-dynamic";

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== "ADMIN") {
    redirect("/");
  }
}

async function setBusinessStatus(formData: FormData, status: "APPROVED" | "REJECTED" | "SUSPENDED") {
  "use server";
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  const business = await prisma.business.findUnique({ where: { id }, select: { status: true } });
  if (!business || !canAdminTransitionListing(business.status, status)) return;
  await prisma.business.updateMany({ where: { id, status: business.status }, data: { status } });
  revalidatePath("/admin");
  revalidatePath("/admin/businesses");
  revalidatePath("/dashboard");
}

async function approveBusiness(formData: FormData) {
  "use server";
  return setBusinessStatus(formData, "APPROVED");
}

async function rejectBusiness(formData: FormData) {
  "use server";
  return setBusinessStatus(formData, "REJECTED");
}

async function suspendBusiness(formData: FormData) {
  "use server";
  return setBusinessStatus(formData, "SUSPENDED");
}

export default async function AdminBusinessesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== "ADMIN") {
    redirect("/");
  }

  const awaitedSearchParams = await searchParams;
  const requestedPage = Number.parseInt(awaitedSearchParams.page || "1", 10);
  const page = Number.isFinite(requestedPage) ? Math.max(1, requestedPage) : 1;
  const take = 50;
  const skip = (page - 1) * take;

  const businesses = await prisma.business.findMany({
    include: { owner: true, category: true },
    orderBy: { createdAt: 'desc' },
    take,
    skip,
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Manage Businesses</h1>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <th className="px-6 py-4">Business Name</th>
                <th className="px-6 py-4">Owner</th>
                <th className="px-6 py-4">City</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {businesses.map((business) => (
                <tr key={business.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{business.name}</div>
                    <div className="text-sm text-gray-500">{business.category.name}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {business.owner.name || business.owner.email}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {business.city}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      business.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                      business.status === 'PENDING_APPROVAL' ? 'bg-yellow-100 text-yellow-800' :
                      business.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {business.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    {business.status === 'PENDING_APPROVAL' && (
                      <>
                        <form action={approveBusiness} className="inline">
                          <input type="hidden" name="id" value={business.id} />
                          <button type="submit" className="text-sm text-green-600 font-medium hover:text-green-800 bg-green-50 px-3 py-1 rounded">
                            Approve
                          </button>
                        </form>
                        <form action={rejectBusiness} className="inline">
                          <input type="hidden" name="id" value={business.id} />
                          <button type="submit" className="text-sm text-red-600 font-medium hover:text-red-800 bg-red-50 px-3 py-1 rounded">
                            Reject
                          </button>
                        </form>
                      </>
                    )}
                    {business.status === 'APPROVED' && (
                      <form action={suspendBusiness} className="inline">
                        <input type="hidden" name="id" value={business.id} />
                        <button type="submit" className="text-sm text-gray-600 font-medium hover:text-gray-800 bg-gray-100 px-3 py-1 rounded">
                          Suspend
                        </button>
                      </form>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
