"use client";

import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { Store, LayoutDashboard } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated" && session?.user?.role !== "BUSINESS_OWNER") {
      router.push("/profile");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    );
  }

  if (!session || session.user?.role !== "BUSINESS_OWNER") {
    return null;
  }

  return (
    <div className="min-h-[calc(100vh-80px)] flex bg-slate-50">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-slate-200 hidden lg:block sticky top-20 h-[calc(100vh-80px)] overflow-y-auto">
        <div className="p-8">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Menu</p>
          <nav className="space-y-3">
            <Link 
              href="/dashboard" 
              className={`flex items-center px-4 py-3.5 text-sm font-bold rounded-xl transition-all ${
                pathname === '/dashboard' ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <LayoutDashboard className={`h-5 w-5 mr-3 ${pathname === '/dashboard' ? 'text-white' : 'text-slate-400'}`} />
              Overview
            </Link>
            <Link 
              href="/dashboard/business/new" 
              className={`flex items-center px-4 py-3.5 text-sm font-bold rounded-xl transition-all ${
                pathname === '/dashboard/business/new' ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Store className={`h-5 w-5 mr-3 ${pathname === '/dashboard/business/new' ? 'text-white' : 'text-slate-400'}`} />
              Add Business
            </Link>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 lg:p-12 overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}
