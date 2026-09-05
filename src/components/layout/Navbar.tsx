"use client";

import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { Search, Menu, LogOut } from "lucide-react";
import { useState } from "react";

export function Navbar() {
  const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 glass-panel border-b border-gray-200/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex-shrink-0 flex items-center group">
              <Image src="/logo.png" alt="Show Listing" width={200} height={60} className="h-15 w-auto mr-3 group-hover:scale-105 transition-transform" />
            </Link>
            
            <div className="hidden sm:flex sm:space-x-1">
              <Link href="/search" className="text-gray-600 hover:text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-100/50 transition-all text-sm font-semibold">
                Explore
              </Link>
            </div>
          </div>
          
          <div className="hidden sm:flex sm:items-center sm:space-x-5">
            <form action="/search" method="GET" className="relative group hidden md:block w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
              </div>
              <input
                type="text"
                name="q"
                className="block w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50/50 border border-gray-200 rounded-full focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all text-gray-900 placeholder:text-gray-500"
                placeholder="Search businesses..."
              />
            </form>
            
            {session ? (
              <div className="relative flex items-center space-x-2">
                <Link 
                  href={session.user?.role === 'ADMIN' ? '/admin' : session.user?.role === 'BUSINESS_OWNER' ? '/dashboard' : '/profile'} 
                  className="text-gray-700 hover:text-gray-900 font-semibold text-sm px-4 py-2.5 rounded-lg hover:bg-gray-100/50 transition-all"
                >
                  {session.user?.role === 'USER' ? 'Profile' : 'Dashboard'}
                </Link>
                <button 
                  onClick={() => signOut()}
                  className="p-2.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                  title="Sign out"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <Link href="/login" className="text-gray-600 hover:text-gray-900 font-semibold text-sm px-4 py-2.5 rounded-lg hover:bg-gray-100/50 transition-all">
                Sign In
              </Link>
            )}

            <div className="h-8 w-px bg-gray-200 mx-2"></div>

            <Link 
              href="/list-your-business" 
              className="inline-flex items-center justify-center px-6 py-2.5 text-sm font-bold text-white bg-blue-600 rounded-full shadow-md shadow-blue-500/20 hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/30 hover:-translate-y-0.5 transition-all active:translate-y-0"
            >
              List Your Business
            </Link>
          </div>
          
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 focus:outline-none transition-colors"
            >
              <span className="sr-only">Open main menu</span>
              <Menu className="block h-6 w-6" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="sm:hidden bg-white/95 backdrop-blur-md border-t border-gray-100 shadow-xl absolute w-full left-0">
          <div className="px-4 pt-2 pb-6 space-y-2">
            <form action="/search" method="GET" className="relative mt-4 mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input type="text" name="q" className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 text-gray-900" placeholder="Search businesses..." />
            </form>
            <Link href="/search" className="block px-4 py-3 rounded-xl text-base font-semibold text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors">
              Explore Businesses
            </Link>
            <Link href="/list-your-business" className="block px-4 py-3 rounded-xl text-base font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors">
              List Your Business
            </Link>
            {session ? (
              <>
                <Link href={session.user?.role === 'ADMIN' ? '/admin' : session.user?.role === 'BUSINESS_OWNER' ? '/dashboard' : '/profile'} className="block px-4 py-3 rounded-xl text-base font-semibold text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors">
                  {session.user?.role === 'USER' ? 'Profile' : 'Dashboard'}
                </Link>
                <button onClick={() => signOut()} className="block w-full text-left px-4 py-3 rounded-xl text-base font-semibold text-red-600 hover:bg-red-50 transition-colors">
                  Sign out
                </button>
              </>
            ) : (
              <Link href="/login" className="block px-4 py-3 rounded-xl text-base font-semibold text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors">
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
