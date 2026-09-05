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
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!session || session.user?.role !== "BUSINESS_OWNER") {
    return null;
  }

  return (
    <div className="min-h-[calc(100vh-64px)] flex bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r hidden md:block">
        <div className="p-6">
          <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Dashboard</p>
          <nav className="space-y-2">
            <Link 
              href="/dashboard" 
              className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg ${
                pathname === '/dashboard' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <LayoutDashboard className="h-5 w-5 mr-3" />
              Overview
            </Link>
            <Link 
              href="/dashboard/business/new" 
              className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg ${
                pathname === '/dashboard/business/new' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Store className="h-5 w-5 mr-3" />
              Add Business
            </Link>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
