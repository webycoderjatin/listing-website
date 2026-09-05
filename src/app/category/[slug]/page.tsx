import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { MapPin, Store, Star, ArrowLeft, ShieldCheck } from "lucide-react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { slugify } from "@/lib/text";
import Image from "next/image";
import { getSafeImageUrl } from "@/lib/validation";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const category = await prisma.category.findUnique({ where: { slug } });
  if (!category) return { title: "Category Not Found" };
  
  return {
    title: `Best ${category.name} | Show Listing`,
    description: `Discover the top-rated ${category.name} in your area on Show Listing.`,
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = await prisma.category.findUnique({
    where: { slug }
  });

  if (!category) {
    notFound();
  }

  const businesses = await prisma.business.findMany({
    where: { 
      categoryId: category.id,
      status: "APPROVED" 
    },
    include: {
      category: true,
      media: { where: { type: "IMAGE" }, take: 1 },
      reviews: { where: { status: "APPROVED" } },
    },
    orderBy: { createdAt: "desc" },
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
        
        <Link href="/search" className="inline-flex items-center text-slate-500 hover:text-blue-600 font-medium text-sm mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to all categories
        </Link>

        <div className="bg-slate-900 rounded-[2rem] overflow-hidden relative mb-12 shadow-2xl">
          <div className="absolute inset-0 bg-grid-pattern-dark opacity-10"></div>
          <div className="absolute top-0 right-0 -mr-24 -mt-24 w-64 h-64 rounded-full bg-blue-600/30 blur-3xl opacity-50"></div>
          
          <div className="relative z-10 p-10 md:p-16">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">Best {category.name}</h1>
            <p className="text-slate-300 text-lg md:text-xl max-w-2xl">
              {category.description || `Discover the highest-rated and most trusted ${category.name.toLowerCase()} in your neighborhood.`}
            </p>
            <div className="mt-8 inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur border border-white/10 text-white font-medium text-sm">
              {businesses.length} {businesses.length === 1 ? 'place' : 'places'} available
            </div>
          </div>
        </div>

        {businesses.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center shadow-sm max-w-3xl mx-auto">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Store className="h-10 w-10 text-slate-300" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">No businesses found</h3>
            <p className="text-slate-500 mb-8 text-lg">We couldn&apos;t find any {category.name.toLowerCase()} listings right now.</p>
            <Link href="/list-your-business" className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20">
              Be the first to list your business!
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {businesses.map((business) => {
              const avgRating = getAverageRating(business.reviews);
              const imageUrl = getSafeImageUrl(business.media[0]?.url, "https://images.unsplash.com/photo-1556761175-5973dc0f32b7?w=800&q=80");
              
              return (
                <div key={business.id} className="bg-white rounded-3xl overflow-hidden border border-slate-200 hover:shadow-premium-hover transition-all group flex flex-col h-full relative">
                  {business.verified && (
                    <div className="absolute top-4 right-4 z-10 bg-white/95 backdrop-blur shadow-sm px-2.5 py-1 rounded-full flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                      <span className="text-[10px] font-bold text-slate-900 uppercase tracking-wider">Verified</span>
                    </div>
                  )}
                  
                  <div className="relative h-48 overflow-hidden bg-slate-100">
                    <Image src={imageUrl} alt={business.name} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transform group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent"></div>
                  </div>
                  
                  <div className="p-6 flex flex-col flex-grow">
                    <div className="flex justify-between items-start mb-3 gap-4">
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
                    
                    <div className="mt-auto pt-4 border-t border-slate-100">
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
  );
}
