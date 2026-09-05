"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Search, Menu, LogOut } from "lucide-react";
import { useState } from "react";

export function Navbar() {
  const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="border-b bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold text-blue-600">LocalFind</span>
            </Link>
            
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link href="/search" className="text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-gray-300 text-sm font-medium">
                Explore
              </Link>
            </div>
          </div>
          
          <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-4">
            <form action="/search" method="GET" className="relative rounded-md shadow-sm hidden md:block">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                name="q"
                className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-full py-2 bg-gray-50 px-4"
                placeholder="Search businesses..."
              />
            </form>
            
            <Link 
              href="/list-your-business" 
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              List Your Business
            </Link>
            
            {session ? (
              <div className="relative flex items-center space-x-4">
                <Link href={session.user?.role === 'ADMIN' ? '/admin' : '/dashboard'} className="text-gray-700 hover:text-gray-900">
                  Dashboard
                </Link>
                <button 
                  onClick={() => signOut()}
                  className="text-gray-500 hover:text-gray-700"
                  title="Sign out"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <Link href="/login" className="text-gray-700 hover:text-gray-900 font-medium px-3 py-2 rounded-md hover:bg-gray-50">
                Sign In
              </Link>
            )}
          </div>
          
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              <span className="sr-only">Open main menu</span>
              <Menu className="block h-6 w-6" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="sm:hidden border-t">
          <div className="pt-2 pb-3 space-y-1">
            <Link href="/search" className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800">
              Explore
            </Link>
            <Link href="/list-your-business" className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-blue-600 hover:bg-gray-50 hover:border-blue-300 hover:text-blue-800">
              List Your Business
            </Link>
            {session ? (
              <>
                <Link href={session.user?.role === 'ADMIN' ? '/admin' : '/dashboard'} className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800">
                  Dashboard
                </Link>
                <button onClick={() => signOut()} className="block w-full text-left pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800">
                  Sign out
                </button>
              </>
            ) : (
              <Link href="/login" className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800">
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
