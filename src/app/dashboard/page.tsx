import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus, Store, Clock, CheckCircle, CreditCard, ArrowRight, Activity } from "lucide-react";
import { redirect } from "next/navigation";
import { slugify } from "@/lib/text";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    redirect("/login");
  }

  if (session.user.role !== "BUSINESS_OWNER") {
    redirect("/profile");
  }

  const user = session.user;
  
  const businesses = await prisma.business.findMany({
    where: { ownerId: user.id },
    include: { category: true, payments: true },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="max-w-6xl mx-auto pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl shadow-lg shadow-blue-600/20 flex items-center justify-center text-white text-xl font-extrabold">
            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">Welcome back, {user.name?.split(' ')[0] || 'Partner'}!</h1>
            <p className="text-slate-500 font-medium mt-1">Manage your business listings and grow your reach.</p>
          </div>
        </div>
        <Link 
          href="/dashboard/business/new" 
          className="flex items-center px-6 py-3.5 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-all font-bold shadow-md hover:shadow-lg hover:-translate-y-0.5"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add New Business
        </Link>
      </div>

      {businesses.length === 0 ? (
        <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-16 text-center shadow-sm">
          <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Store className="h-12 w-12 text-slate-300" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-3">No businesses listed yet</h3>
          <p className="text-slate-500 mb-8 max-w-sm mx-auto text-lg">Create your first listing to start reaching local customers today.</p>
          <Link 
            href="/dashboard/business/new" 
            className="inline-flex items-center px-6 py-3.5 bg-blue-600 text-white rounded-xl text-base font-bold hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all hover:-translate-y-0.5"
          >
            Create your first listing <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-slate-900 mb-4 px-2">Your Listings</h2>
          {businesses.map((business) => (
            <div key={business.id} className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow group">
              <div className="p-6 md:p-8">
                <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                  
                  <div className="flex items-start gap-5 w-full">
                    <div className="w-14 h-14 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center shrink-0">
                      <Store className="h-6 w-6 text-slate-400" />
                    </div>
                    <div>
                      <h2 className="text-xl font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors">{business.name}</h2>
                      <p className="text-sm font-medium text-slate-500 mt-1">{business.category.name} • {business.city}</p>
                      
                      <div className="flex flex-wrap items-center gap-3 mt-4">
                        {/* Status Badge */}
                        <span className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider ${
                          business.status === 'APPROVED' ? 'bg-green-50 text-green-700 border border-green-200' :
                          business.status === 'PENDING_APPROVAL' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                          business.status === 'PENDING_PAYMENT' ? 'bg-red-50 text-red-700 border border-red-200' :
                          'bg-slate-100 text-slate-700 border border-slate-200'
                        }`}>
                          {business.status === 'APPROVED' && <CheckCircle className="h-3.5 w-3.5 mr-1.5" />}
                          {business.status === 'PENDING_APPROVAL' && <Clock className="h-3.5 w-3.5 mr-1.5" />}
                          {business.status === 'PENDING_PAYMENT' && <CreditCard className="h-3.5 w-3.5 mr-1.5" />}
                          {business.status.replace('_', ' ')}
                        </span>
                        
                        <span className="text-xs font-medium text-slate-400">Added on {new Date(business.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-3 w-full md:w-auto shrink-0 md:flex-col md:items-end lg:flex-row lg:items-center">
                    {business.status === 'PENDING_PAYMENT' ? (
                      <Link 
                        href={`/dashboard/business/${business.id}/pay`}
                        className="w-full md:w-auto px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 shadow-md shadow-blue-600/20 text-center transition-all"
                      >
                        Complete Payment
                      </Link>
                    ) : (
                      <button 
                        className="w-full lg:w-auto px-5 py-2.5 border border-slate-200 bg-slate-50 text-slate-400 rounded-xl text-sm font-bold cursor-not-allowed text-center"
                        title="Editing is not available yet."
                      >
                        Edit Listing
                      </button>
                    )}
                    {business.status === 'APPROVED' && (
                      <Link 
                        href={`/business/${slugify(business.city ?? "")}/${business.category.slug}/${business.slug}`}
                        target="_blank"
                        className="w-full lg:w-auto px-5 py-2.5 border-2 border-slate-100 text-slate-700 bg-white rounded-xl text-sm font-bold hover:bg-slate-50 hover:border-slate-200 text-center transition-all flex items-center justify-center gap-2"
                      >
                        <Activity className="w-4 h-4 text-green-500" />
                        View Live
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
