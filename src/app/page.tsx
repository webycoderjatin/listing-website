import Link from "next/link";
import { Search, Star, MapPin, Store, CheckCircle } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-blue-600 text-white py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">
            Discover trusted businesses around you.
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto mb-10 text-blue-100">
            Find local services, restaurants, professionals, and more in your city.
          </p>
          
          <form action="/search" method="GET" className="max-w-3xl mx-auto bg-white rounded-full p-2 flex shadow-lg">
            <div className="flex-grow flex items-center px-4">
              <Search className="h-5 w-5 text-gray-400 mr-3" />
              <input 
                type="text" 
                name="q"
                placeholder="Search businesses, services or locations" 
                className="w-full py-3 px-2 text-gray-900 focus:outline-none focus:ring-0 bg-transparent text-lg"
              />
            </div>
            <button type="submit" className="bg-blue-600 text-white px-8 py-3 rounded-full font-medium hover:bg-blue-700 transition-colors">
              Search
            </button>
          </form>
          
          <div className="mt-10 flex flex-wrap justify-center gap-4 text-sm font-medium">
            <span className="text-blue-200">Popular:</span>
            <Link href="/search?q=restaurants" className="hover:text-white underline decoration-blue-400 underline-offset-4">Restaurants</Link>
            <Link href="/search?q=plumbers" className="hover:text-white underline decoration-blue-400 underline-offset-4">Plumbers</Link>
            <Link href="/search?q=dentists" className="hover:text-white underline decoration-blue-400 underline-offset-4">Dentists</Link>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Explore Categories</h2>
              <p className="mt-2 text-lg text-gray-600">Find exactly what you&apos;re looking for</p>
            </div>
            <Link href="/search" className="text-blue-600 font-medium hover:text-blue-800 hidden sm:block">
              View all &rarr;
            </Link>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: "Restaurants", slug: "restaurants", icon: "🍔", color: "bg-orange-100 text-orange-600" },
              { name: "Healthcare", slug: "healthcare", icon: "⚕️", color: "bg-blue-100 text-blue-600" },
              { name: "Beauty & Salons", slug: "salons", icon: "✂️", color: "bg-pink-100 text-pink-600" },
              { name: "Fitness", slug: "fitness", icon: "💪", color: "bg-green-100 text-green-600" },
              { name: "Automotive", slug: "automotive", icon: "🚗", color: "bg-gray-200 text-gray-700" },
              { name: "Home Services", slug: "home-services", icon: "🔧", color: "bg-yellow-100 text-yellow-700" },
              { name: "Education", slug: "education", icon: "📚", color: "bg-indigo-100 text-indigo-600" },
              { name: "Professional Services", slug: "professional", icon: "💼", color: "bg-purple-100 text-purple-600" },
            ].map((category) => (
              <Link href={`/category/${category.slug}`} key={category.name} className="bg-white rounded-xl p-6 text-center shadow-sm hover:shadow-md transition-shadow border border-gray-100 flex flex-col items-center group">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl mb-4 ${category.color} group-hover:scale-110 transition-transform`}>
                  {category.icon}
                </div>
                <h3 className="font-semibold text-gray-900">{category.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Businesses (Placeholder) */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-10">Featured Businesses</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border rounded-2xl overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-48 bg-gray-200 relative">
                  {/* Placeholder for image */}
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                    <Store className="h-12 w-12" />
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-gray-900">Sharma Dental Clinic</h3>
                    <span className="flex items-center text-sm font-medium text-yellow-500 bg-yellow-50 px-2 py-1 rounded">
                      <Star className="h-4 w-4 mr-1 fill-current" /> 4.8
                    </span>
                  </div>
                  <p className="text-gray-500 text-sm mb-4">Dentists • Mohali</p>
                  <div className="flex items-center text-gray-600 text-sm mb-6">
                    <MapPin className="h-4 w-4 mr-1" />
                    Sector 70, Mohali
                  </div>
                  <Link href="/business/mohali/healthcare/sharma-dental-clinic-mohali" className="block w-full text-center py-2 border border-blue-600 text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors">
                    View Profile
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why List CTA */}
      <section className="bg-gray-900 text-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="md:w-1/2">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Grow your business with LocalFind</h2>
            <p className="text-lg text-gray-300 mb-8">
              Join thousands of local businesses. Build your professional online presence, get found on Google, and attract more customers in your area.
            </p>
            <ul className="space-y-4 mb-10">
              {['Professional SEO-friendly profile', 'Showcase photos, videos & services', 'Make it easy for customers to contact you', 'Manage your listing from a simple dashboard'].map((benefit, i) => (
                <li key={i} className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-green-400 mr-3 flex-shrink-0" />
                  <span className="text-gray-300">{benefit}</span>
                </li>
              ))}
            </ul>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/list-your-business" className="bg-blue-600 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-blue-700 transition-colors text-center shadow-lg shadow-blue-600/30">
                Get online for ₹399/year
              </Link>
            </div>
          </div>
          <div className="md:w-1/2 w-full">
            <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 shadow-2xl relative">
              <div className="absolute -top-4 -right-4 bg-green-500 text-white px-4 py-1 rounded-full font-bold shadow-lg transform rotate-3">
                Verified
              </div>
              <div className="h-64 bg-gray-700 rounded-lg mb-6 flex items-center justify-center">
                <Store className="h-16 w-16 text-gray-500" />
              </div>
              <div className="h-6 bg-gray-700 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-700 rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-gray-700 rounded w-1/4 mb-6"></div>
              <div className="flex gap-4">
                <div className="h-10 bg-blue-600/50 rounded flex-grow"></div>
                <div className="h-10 bg-gray-700 rounded flex-grow"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
