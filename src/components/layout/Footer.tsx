import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-gray-50 border-t">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <span className="text-2xl font-bold text-blue-600">LocalFind</span>
            <p className="mt-4 text-gray-500 text-sm max-w-sm">
              Discover trusted local businesses around you. Connect with the best professionals, restaurants, and services in your area.
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">Explore</h3>
            <ul className="mt-4 space-y-4">
              <li>
                <Link href="/search" className="text-base text-gray-500 hover:text-gray-900">
                  All Businesses
                </Link>
              </li>
              <li>
                <Link href="/category/restaurants" className="text-base text-gray-500 hover:text-gray-900">
                  Restaurants
                </Link>
              </li>
              <li>
                <Link href="/category/healthcare" className="text-base text-gray-500 hover:text-gray-900">
                  Healthcare
                </Link>
              </li>
              <li>
                <Link href="/category/salons" className="text-base text-gray-500 hover:text-gray-900">
                  Beauty & Salons
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">For Business</h3>
            <ul className="mt-4 space-y-4">
              <li>
                <Link href="/list-your-business" className="text-base text-gray-500 hover:text-gray-900">
                  List Your Business
                </Link>
              </li>
              <li>
                <Link href="/login" className="text-base text-gray-500 hover:text-gray-900">
                  Business Login
                </Link>
              </li>
              <li>
                <Link href="#" className="text-base text-gray-500 hover:text-gray-900">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 border-t border-gray-200 pt-8">
          <p className="text-base text-gray-400 xl:text-center">
            &copy; {new Date().getFullYear()} LocalFind, Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
