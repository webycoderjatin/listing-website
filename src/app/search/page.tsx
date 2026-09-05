import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Star, MapPin, Store } from "lucide-react";
import type { Metadata } from "next";
import { slugify } from "@/lib/text";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Search Businesses | LocalFind",
  description: "Search for local businesses, restaurants, healthcare, and more on LocalFind.",
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
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          {query ? `Search results for "${query}"` : "Explore Businesses"}
        </h1>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="w-full md:w-64 flex-shrink-0">
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm sticky top-24">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Filters</h2>
              
              <form action="/search" method="GET" className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                  <input
                    type="text"
                    name="q"
                    defaultValue={query}
                    placeholder="Keywords..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select name="category" defaultValue={category} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white">
                    <option value="">All categories</option>
                    {categories.map((item) => <option key={item.id} value={item.slug}>{item.name}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <input
                    type="text"
                    name="location"
                    defaultValue={location}
                    placeholder="City (e.g. Mohali)"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md font-medium hover:bg-blue-700">
                  Apply Filters
                </button>
              </form>
            </div>
          </div>

          {/* Results List */}
          <div className="flex-grow">
            {businesses.length === 0 ? (
              <div className="bg-white p-10 rounded-xl border border-gray-200 text-center shadow-sm">
                <Store className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">No businesses found</h3>
                <p className="text-gray-500 mb-6">Try adjusting your search or filters to find what you&apos;re looking for.</p>
                <Link href="/search" className="text-blue-600 font-medium hover:underline">
                  Clear all filters
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {businesses.map((business) => {
                  const avgRating = getAverageRating(business.reviews);
                  const imageUrl = business.media[0]?.url || null;

                  return (
                    <div key={business.id} className="bg-white rounded-xl overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow">
                      <div className="h-48 bg-gray-100 relative">
                        {imageUrl ? (
                          <img src={imageUrl} alt={business.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                            <Store className="h-12 w-12" />
                          </div>
                        )}
                        {business.verified && (
                          <div className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow">
                            Verified
                          </div>
                        )}
                      </div>
                      <div className="p-5">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-lg font-bold text-gray-900 line-clamp-1">{business.name}</h3>
                          {avgRating && (
                            <span className="flex items-center text-sm font-medium text-yellow-500 bg-yellow-50 px-2 py-1 rounded flex-shrink-0 ml-2">
                              <Star className="h-3 w-3 mr-1 fill-current" /> {avgRating}
                            </span>
                          )}
                        </div>
                        <p className="text-gray-500 text-sm mb-3">{business.category.name}</p>
                        
                        <div className="flex items-center text-gray-600 text-sm mb-5">
                          <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                          <span className="line-clamp-1">{business.locality ? `${business.locality}, ` : ""}{business.city}</span>
                        </div>
                        
                        <Link 
                          href={`/business/${slugify(business.city ?? "")}/${business.category.slug}/${business.slug}`}
                          className="block w-full text-center py-2 border border-blue-600 text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors"
                        >
                          View Profile
                        </Link>
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
