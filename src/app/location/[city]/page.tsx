import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Star, MapPin, Store } from "lucide-react";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: { city: string } }): Promise<Metadata> {
  const cityName = params.city.charAt(0).toUpperCase() + params.city.slice(1);
  return {
    title: `Businesses in ${cityName} | LocalFind`,
    description: `Discover the best local businesses, restaurants, and services in ${cityName}.`,
  };
}

export default async function LocationPage({ params }: { params: { city: string } }) {
  const cityName = params.city.charAt(0).toUpperCase() + params.city.slice(1);

  const businesses = await prisma.business.findMany({
    where: { 
      city: { equals: params.city, mode: "insensitive" },
      status: "APPROVED" 
    },
    include: {
      category: true,
      media: { where: { type: "IMAGE" }, take: 1 },
      reviews: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 mb-8 bg-gradient-to-r from-blue-50 to-white">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Explore {cityName}</h1>
          <p className="text-gray-600 text-lg">
            Find the best places, professionals, and services in {cityName}.
          </p>
        </div>

        {businesses.length === 0 ? (
          <div className="bg-white p-10 rounded-xl border border-gray-200 text-center shadow-sm">
            <Store className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No businesses found</h3>
            <p className="text-gray-500 mb-6">We couldn&apos;t find any listings in {cityName} right now.</p>
            <Link href="/list-your-business" className="text-blue-600 font-medium hover:underline">
              List your business in {cityName}
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {businesses.map((business) => {
              const imageUrl = business.media[0]?.url;
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
                    <h3 className="text-lg font-bold text-gray-900 line-clamp-1 mb-1">{business.name}</h3>
                    <p className="text-gray-500 text-sm mb-3">{business.category.name}</p>
                    <div className="flex items-center text-gray-600 text-sm mb-5">
                      <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                      <span className="line-clamp-1">{business.locality ? `${business.locality}, ` : ""}{business.city}</span>
                    </div>
                    
                    <Link 
                      href={`/business/${(business.city || 'unlisted').toLowerCase()}/${business.category.slug}/${business.slug}`} 
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
  );
}
