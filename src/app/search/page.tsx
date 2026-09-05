import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Star, MapPin, Store, Search as SearchIcon, Filter, Map, Clock, ShieldCheck } from "lucide-react";
import type { Metadata } from "next";
import { slugify } from "@/lib/text";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Search Businesses | Show Listing",
  description: "Search for local businesses, restaurants, healthcare, and more on Show Listing.",
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string | string[]; category?: string | string[]; location?: string | string[]; page?: string | string[] }>;
}) {
  const awaitedSearchParams = await searchParams;
  const queryParam = Array.isArray(awaitedSearchParams.q) ? awaitedSearchParams.q[0] : awaitedSearchParams.q;
  const categoryParam = Array.isArray(awaitedSearchParams.category) ? awaitedSearchParams.category[0] : awaitedSearchParams.category;
  const locationParam = Array.isArray(awaitedSearchParams.location) ? awaitedSearchParams.location[0] : awaitedSearchParams.location;
  const pageParam = Array.isArray(awaitedSearchParams.page) ? awaitedSearchParams.page[0] : awaitedSearchParams.page;

  const query = queryParam || "";
  const category = categoryParam || "";
  const location = locationParam || "";
  const requestedPage = Number.parseInt(pageParam || "1", 10);
  const page = Number.isFinite(requestedPage) ? Math.max(1, requestedPage) : 1;
  const take = 20;
  const skip = (page - 1) * take;

  // Build the Prisma where clause based on active filters
  const where: Prisma.BusinessWhereInput = {
    status: "APPROVED",
  };

  if (query) {
    where.OR = [
      { name: { contains: query, mode: "insensitive" } },
      { description: { contains: query, mode: "insensitive" } },
      { category: { name: { contains: query, mode: "insensitive" } } },
    ];
  }

  if (category) {
    where.category = { slug: category };
  }

  if (location) {
    where.city = { equals: location, mode: "insensitive" };
  }

  const businesses = await prisma.business.findMany({
    where,
    include: {
      category: true,
      media: {
        where: { type: "IMAGE" },
        take: 1,
      },
      reviews: { where: { status: "APPROVED" } },
    },
    orderBy: { createdAt: "desc" },
    take,
    skip,
  });

  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" }
  });

  // Calculate average rating helper
  const getAverageRating = (reviews: { rating: number }[]) => {
    if (reviews.length === 0) return null;
    const sum = reviews.reduce((acc, rev) => acc + rev.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-2 tracking-tight">
            {query ? `Results for "${query}"` : "Explore Local Businesses"}
          </h1>
          <p className="text-slate-500 font-medium text-lg">
            {businesses.length} {businesses.length === 1 ? 'place' : 'places'} found {location ? `in ${location}` : 'near you'}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Filters Sidebar */}
          <div className="w-full lg:w-80 flex-shrink-0">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm sticky top-28">
              <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-100">
                <Filter className="w-5 h-5 text-slate-400" />
                <h2 className="text-lg font-bold text-slate-900">Filters</h2>
              </div>
              
              <form action="/search" method="GET" className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Search</label>
                  <div className="relative">
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      name="q"
                      defaultValue={query}
                      placeholder="Keywords..."
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors text-slate-900 placeholder:text-slate-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Category</label>
                  <select 
                    name="category" 
                    defaultValue={category} 
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors text-slate-900 appearance-none"
                  >
                    <option value="">All categories</option>
                    {categories.map((item) => <option key={item.id} value={item.slug}>{item.name}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      name="location"
                      defaultValue={location}
                      placeholder="City or Area"
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors text-slate-900 placeholder:text-slate-400"
                    />
                  </div>
                </div>
                
                <button type="submit" className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-slate-800 transition-colors shadow-md">
                  Apply Filters
                </button>
                
                {(query || category || location) && (
                  <Link href="/search" className="block text-center w-full text-slate-500 font-semibold text-sm hover:text-slate-700 mt-4">
                    Clear all filters
                  </Link>
                )}
              </form>
            </div>
          </div>

          {/* Results List */}
          <div className="flex-grow w-full">
            {businesses.length === 0 ? (
              <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center shadow-sm">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Store className="h-10 w-10 text-slate-300" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">No businesses found</h3>
                <p className="text-slate-500 mb-8 max-w-md mx-auto text-lg">We couldn&apos;t find any results matching your current filters. Try adjusting them or explore other categories.</p>
                <Link href="/search" className="inline-flex items-center justify-center px-6 py-3 bg-blue-50 text-blue-600 font-bold rounded-xl hover:bg-blue-100 transition-colors">
                  Clear all filters
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {businesses.map((business) => {
                  const avgRating = getAverageRating(business.reviews);
                  const imageUrl = business.media[0]?.url || "https://images.unsplash.com/photo-1556761175-5973dc0f32b7?w=800&q=80";

                  return (
                    <div key={business.id} className="bg-white rounded-3xl overflow-hidden border border-slate-200 hover:shadow-premium-hover transition-all group flex flex-col h-full relative">
                      {business.verified && (
                        <div className="absolute top-4 right-4 z-10 bg-white/95 backdrop-blur shadow-sm px-2.5 py-1 rounded-full flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                          <span className="text-[10px] font-bold text-slate-900 uppercase tracking-wider">Verified</span>
                        </div>
                      )}
                      
                      <div className="relative h-48 overflow-hidden bg-slate-100">
                        <img src={imageUrl} alt={business.name} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
                        <div className="absolute bottom-4 left-4">
                          <span className="bg-blue-600 text-white shadow-sm px-2.5 py-1 rounded-lg text-xs font-bold tracking-wide">{business.category.name}</span>
                        </div>
                      </div>
                      
                      <div className="p-6 flex flex-col flex-grow">
                        <div className="flex justify-between items-start mb-2 gap-4">
                          <h3 className="text-xl font-bold text-slate-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
                            <Link href={`/business/${slugify(business.city ?? "")}/${business.category.slug}/${business.slug}`} className="focus:outline-none">
                              <span className="absolute inset-0" aria-hidden="true" />
                              {business.name}
                            </Link>
                          </h3>
                          {avgRating ? (
                            <div className="flex items-center gap-1 bg-green-50 text-green-700 px-2 py-1 rounded-md text-sm font-bold shrink-0">
                              <Star className="w-3.5 h-3.5 fill-current" /> {avgRating}
                            </div>
                          ) : (
                            <div className="flex items-center gap-1 bg-slate-50 text-slate-500 px-2 py-1 rounded-md text-xs font-bold shrink-0">
                              New
                            </div>
                          )}
                        </div>
                        
                        <p className="text-slate-500 text-sm mb-5 line-clamp-2">{business.description || 'No description available for this business.'}</p>
                        
                        <div className="mt-auto space-y-2">
                          <div className="flex items-center text-slate-600 text-sm font-medium">
                            <MapPin className="w-4 h-4 mr-2 text-slate-400 shrink-0" />
                            <span className="line-clamp-1">{business.locality ? `${business.locality}, ` : ""}{business.city || 'Location unavailable'}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
