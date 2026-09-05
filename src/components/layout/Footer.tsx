import Link from "next/link";
import { Store, ChevronRight } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-300 py-16 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-8">
          
          <div className="md:col-span-12 lg:col-span-4">
            <Link href="/" className="inline-block mb-6">
              <span className="text-3xl font-extrabold tracking-tight text-white flex items-center">
                <img src="/logo.png" alt="Show Listing" className="h-15 w-auto mr-3 brightness-0 invert" />
              </span>
            </Link>
            <p className="text-slate-400 text-base leading-relaxed max-w-sm mb-8">
              Discover trusted local businesses around you. Connect with the best professionals, restaurants, and services in your area.
            </p>
            <div className="p-6 bg-slate-900/50 rounded-2xl border border-slate-800">
              <h4 className="text-white font-semibold mb-2">Own a business?</h4>
              <p className="text-sm text-slate-400 mb-4">Get listed and start reaching more customers today.</p>
              <Link href="/list-your-business" className="inline-flex items-center text-sm font-bold text-blue-400 hover:text-blue-300 transition-colors">
                List for ₹399/year <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
          </div>
          
          <div className="md:col-span-4 lg:col-span-2 lg:col-start-6">
            <h3 className="text-sm font-bold text-white tracking-wider uppercase mb-6">Explore</h3>
            <ul className="space-y-4">
              <li><Link href="/search" className="text-base text-slate-400 hover:text-white transition-colors">All Businesses</Link></li>
              <li><Link href="/category/restaurants" className="text-base text-slate-400 hover:text-white transition-colors">Restaurants</Link></li>
              <li><Link href="/category/healthcare" className="text-base text-slate-400 hover:text-white transition-colors">Healthcare</Link></li>
              <li><Link href="/category/salons" className="text-base text-slate-400 hover:text-white transition-colors">Beauty & Salons</Link></li>
              <li><Link href="/category/fitness" className="text-base text-slate-400 hover:text-white transition-colors">Fitness</Link></li>
            </ul>
          </div>

          <div className="md:col-span-4 lg:col-span-2">
            <h3 className="text-sm font-bold text-white tracking-wider uppercase mb-6">For Business</h3>
            <ul className="space-y-4">
              <li><Link href="/list-your-business" className="text-base text-slate-400 hover:text-white transition-colors">List Your Business</Link></li>
              <li><Link href="/login" className="text-base text-slate-400 hover:text-white transition-colors">Business Login</Link></li>
              <li><Link href="/list-your-business" className="text-base text-slate-400 hover:text-white transition-colors">Pricing</Link></li>
              <li><Link href="/register" className="text-base text-slate-400 hover:text-white transition-colors">Create Account</Link></li>
            </ul>
          </div>

          <div className="md:col-span-4 lg:col-span-2">
            <h3 className="text-sm font-bold text-white tracking-wider uppercase mb-6">Legal</h3>
            <ul className="space-y-4">
              <li><Link href="#" className="text-base text-slate-400 hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="text-base text-slate-400 hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link href="#" className="text-base text-slate-400 hover:text-white transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-16 border-t border-slate-800/60 pt-8 flex flex-col md:flex-row items-center justify-between">
          <p className="text-sm text-slate-500">
            &copy; {new Date().getFullYear()} Show Listing, Inc. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0 flex space-x-6">
            <span className="text-sm text-slate-500">Made for local businesses.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
