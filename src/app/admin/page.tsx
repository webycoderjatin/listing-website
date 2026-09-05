import { prisma } from "@/lib/prisma";
import { Store, CreditCard, Clock, CheckCircle } from "lucide-react";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "ADMIN") {
    redirect("/");
  }

  // Fetch real statistics
  const totalBusinesses = await prisma.business.count();
  const pendingApprovals = await prisma.business.count({ where: { status: "PENDING_APPROVAL" } });
  const approvedBusinesses = await prisma.business.count({ where: { status: "APPROVED" } });
  
  // Get revenue
  const successfulPayments = await prisma.payment.aggregate({
    where: { status: "SUCCESS" },
    _sum: { amount: true }
  });
  const revenue = (successfulPayments._sum.amount || 0) / 100; // convert paise to INR

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500">Total Revenue</h3>
            <div className="p-2 bg-green-100 rounded-lg text-green-600">
              <CreditCard className="h-5 w-5" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">₹{revenue.toLocaleString()}</p>
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500">Total Businesses</h3>
            <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
              <Store className="h-5 w-5" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">{totalBusinesses}</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500">Pending Approvals</h3>
            <div className="p-2 bg-yellow-100 rounded-lg text-yellow-600">
              <Clock className="h-5 w-5" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">{pendingApprovals}</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500">Active Listings</h3>
            <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
              <CheckCircle className="h-5 w-5" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">{approvedBusinesses}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-900">Action Required: Pending Approvals</h2>
          <Link href="/admin/businesses" className="text-sm text-blue-600 font-medium hover:underline">
            View All Businesses
          </Link>
        </div>
        <div className="p-6">
          <p className="text-gray-500 text-sm">Navigate to the Businesses tab to moderate listings.</p>
        </div>
      </div>
    </div>
  );
}
