"use client";

import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { LayoutDashboard, Store } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === "unauthenticated" || (status === "authenticated" && session?.user?.role !== "ADMIN")) {
      router.push("/");
    }
  }, [status, session, router]);

  if (status === "loading" || !session || session.user?.role !== "ADMIN") {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-[calc(100vh-64px)] flex bg-gray-50">
      {/* Admin Sidebar */}
      <aside className="w-64 bg-gray-900 text-white hidden md:block">
        <div className="p-6">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-6">Admin Panel</p>
          <nav className="space-y-2">
            <Link 
              href="/admin" 
              className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg ${
                pathname === '/admin' ? 'bg-gray-800 text-white' : 'text-gray-300 hover:bg-gray-800'
              }`}
            >
              <LayoutDashboard className="h-5 w-5 mr-3" />
              Dashboard
            </Link>
            <Link 
              href="/admin/businesses" 
              className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg ${
                pathname === '/admin/businesses' ? 'bg-gray-800 text-white' : 'text-gray-300 hover:bg-gray-800'
              }`}
            >
              <Store className="h-5 w-5 mr-3" />
              Businesses
            </Link>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
