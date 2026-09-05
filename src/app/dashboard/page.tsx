import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus, Store, Clock, AlertCircle, CheckCircle, CreditCard } from "lucide-react";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect("/login");
  }

  const user = session.user;
  
  const businesses = await prisma.business.findMany({
    where: { ownerId: user.id },
    include: { category: true, payments: true },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome, {user.name || 'User'}</h1>
          <p className="text-gray-500">Manage your business listings</p>
        </div>
        <Link 
          href="/dashboard/business/new" 
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Business
        </Link>
      </div>

      {businesses.length === 0 ? (
        <div className="bg-white rounded-xl border border-dashed border-gray-300 p-12 text-center">
          <Store className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No businesses listed yet</h3>
          <p className="text-gray-500 mb-6">List your business to get discovered by local customers.</p>
          <Link 
            href="/dashboard/business/new" 
            className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Create your first listing
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {businesses.map((business) => (
            <div key={business.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{business.name}</h2>
                    <p className="text-sm text-gray-500 mb-4">{business.category.name} • {business.city}</p>
                    
                    <div className="flex items-center space-x-4 mb-6">
                      {/* Status Badge */}
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        business.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                        business.status === 'PENDING_APPROVAL' ? 'bg-yellow-100 text-yellow-800' :
                        business.status === 'PENDING_PAYMENT' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {business.status === 'APPROVED' && <CheckCircle className="h-3 w-3 mr-1" />}
                        {business.status === 'PENDING_APPROVAL' && <Clock className="h-3 w-3 mr-1" />}
                        {business.status === 'PENDING_PAYMENT' && <CreditCard className="h-3 w-3 mr-1" />}
                        {business.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex space-x-3">
                    {business.status === 'PENDING_PAYMENT' ? (
                      <Link 
                        href={`/dashboard/business/${business.id}/pay`}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
                      >
                        Complete Payment
                      </Link>
                    ) : (
                      <span 
                        className="px-4 py-2 border border-gray-300 text-gray-400 rounded-lg text-sm font-medium cursor-not-allowed"
                        title="Editing is not available yet."
                      >
                        Edit
                      </span>
                    )}
                    {business.status === 'APPROVED' && (
                      <Link 
                        href={`/business/${business.city?.toLowerCase()}/${business.category.slug}/${business.slug}`}
                        target="_blank"
                        className="px-4 py-2 border border-blue-200 text-blue-700 bg-blue-50 rounded-lg text-sm font-medium hover:bg-blue-100"
                      >
                        View Public Profile
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
