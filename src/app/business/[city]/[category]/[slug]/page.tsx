import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { MapPin, Phone, Globe, MessageCircle, Clock, ShieldCheck, Share2, Star, Navigation } from "lucide-react";
import type { Metadata } from "next";
import { normalisePhoneForWhatsApp, slugify } from "@/lib/text";
import Image from "next/image";
import { getSafeImageUrl } from "@/lib/validation";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ city: string; category: string; slug: string }>;
};

export async function generateMetadata(
  { params }: Props
): Promise<Metadata> {
  const { city, category, slug } = await params;
  const business = await prisma.business.findUnique({
    where: { slug },
    include: { category: true },
  });

  if (!business || business.status !== "APPROVED" || business.category.slug !== category || slugify(business.city ?? "") !== city) {
    return { title: "Not Found" };
  }

  return {
    title: business.seoTitle || `${business.name} | ${business.category.name} in ${business.city}`,
    description: business.seoDescription || business.description?.substring(0, 160) || `Contact ${business.name} in ${business.city}.`,
  };
}

export default async function BusinessProfilePage({ params }: Props) {
  const { city, category, slug } = await params;
  const business = await prisma.business.findUnique({
    where: { slug },
    include: {
      category: true,
      media: { orderBy: { sortOrder: 'asc' } },
      services: true,
      hours: { orderBy: { day: 'asc' } },
      reviews: { orderBy: { createdAt: 'desc' } },
    },
  });

  if (!business || business.status !== "APPROVED" || business.category.slug !== category || slugify(business.city ?? "") !== city) {
    notFound();
  }

  const logo = business.media.find((media) => media.type === "LOGO" && getSafeImageUrl(media.url, "") !== "");
  const images = business.media.filter((media) => media.type === "IMAGE" && getSafeImageUrl(media.url, "") !== "");
  const whatsappNumber = business.whatsapp ? normalisePhoneForWhatsApp(business.whatsapp) : "";

  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  // Calculate average rating helper
  const getAverageRating = (reviews: { rating: number }[]) => {
    if (reviews.length === 0) return null;
    const sum = reviews.reduce((acc, rev) => acc + rev.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };
  
  const avgRating = getAverageRating(business.reviews);
  const bannerImage = getSafeImageUrl(images[0]?.url, "https://images.unsplash.com/photo-1556761175-5973dc0f32b7?w=1600&q=80");

  return (
    <div className="bg-slate-50 min-h-screen pb-24">
      {/* Premium Header Banner */}
      <div className="h-72 md:h-96 relative w-full overflow-hidden">
        <div className="absolute inset-0 bg-slate-900 z-0"></div>
        <Image src={bannerImage} alt={business.name} fill priority sizes="100vw" className="object-cover opacity-60 mix-blend-overlay scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent z-10"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-900/90 z-10"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-20">
        
        {/* Main Profile Card */}
        <div className="bg-white rounded-[2rem] shadow-2xl shadow-slate-900/10 border border-slate-100 p-6 md:p-10 mb-8 backdrop-blur-xl">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            
            {/* Logo Avatar */}
            <div className="w-32 h-32 md:w-44 md:h-44 bg-white rounded-3xl shadow-xl flex items-center justify-center border-4 border-white overflow-hidden flex-shrink-0 -mt-20 md:-mt-24 z-30 relative group">
              {logo ? (
                <Image src={getSafeImageUrl(logo.url, bannerImage)} alt={`${business.name} logo`} fill sizes="176px" className="object-cover bg-white" />
              ) : (
                <div className="text-5xl text-slate-300 font-extrabold bg-slate-50 w-full h-full flex items-center justify-center">
                  {business.name.charAt(0)}
                </div>
              )}
            </div>

            {/* Title & Info */}
            <div className="flex-grow w-full">
              <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-6">
                <div>
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <span className="inline-block px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-bold uppercase tracking-wider">
                      {business.category.name}
                    </span>
                    {business.verified && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-bold uppercase tracking-wider">
                        <ShieldCheck className="w-3.5 h-3.5" /> Verified
                      </span>
                    )}
                  </div>
                  
                  <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
                    {business.name}
                  </h1>
                  
                  <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-slate-500 mb-2">
                    {avgRating && (
                      <div className="flex items-center gap-1 bg-amber-50 text-amber-700 px-2 py-1 rounded-md text-sm font-bold">
                        <Star className="w-4 h-4 fill-current" /> {avgRating}
                      </div>
                    )}
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1.5 text-slate-400" />
                      <span>{business.address}, {business.locality}, {business.city}</span>
                    </div>
                  </div>
                </div>

                {/* Primary Actions Desktop */}
                <div className="flex flex-wrap lg:flex-nowrap gap-3 shrink-0">
                  <button className="flex items-center justify-center w-12 h-12 rounded-2xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300 hover:text-slate-900 transition-all shadow-sm">
                    <Share2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Content Column */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* About Section */}
            {business.description && (
              <div className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-slate-200">
                <h2 className="text-2xl font-extrabold text-slate-900 mb-6 flex items-center">
                  <div className="w-2 h-6 bg-blue-600 rounded-full mr-3"></div>
                  About
                </h2>
                <div className="prose prose-slate max-w-none text-slate-600 font-medium leading-relaxed whitespace-pre-wrap text-lg">
                  {business.description}
                </div>
              </div>
            )}

            {/* Services Section */}
            {business.services.length > 0 && (
              <div className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-slate-200">
                <h2 className="text-2xl font-extrabold text-slate-900 mb-8 flex items-center">
                  <div className="w-2 h-6 bg-blue-600 rounded-full mr-3"></div>
                  Services & Pricing
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {business.services.map((service) => (
                    <div key={service.id} className="p-6 rounded-2xl border border-slate-100 bg-slate-50 hover:border-blue-200 hover:shadow-md transition-all group">
                      <div className="flex justify-between items-start mb-3 gap-4">
                        <h3 className="font-bold text-slate-900 text-lg group-hover:text-blue-600 transition-colors">{service.name}</h3>
                        {service.price && (
                          <span className="text-slate-900 font-extrabold bg-white border border-slate-200 px-3 py-1.5 rounded-xl text-sm whitespace-nowrap shadow-sm">
                            {service.price}
                          </span>
                        )}
                      </div>
                      {service.description && (
                        <p className="text-sm text-slate-500 font-medium leading-relaxed">{service.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Photos Section */}
            {images.length > 0 && (
              <div className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-slate-200">
                <h2 className="text-2xl font-extrabold text-slate-900 mb-8 flex items-center">
                  <div className="w-2 h-6 bg-blue-600 rounded-full mr-3"></div>
                  Gallery
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {images.map((img) => (
                    <div key={img.id} className="aspect-square rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 group cursor-pointer relative">
                      <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/10 transition-colors z-10"></div>
                      <Image src={getSafeImageUrl(img.url, bannerImage)} alt={business.name} fill sizes="(max-width: 768px) 50vw, 33vw" className="object-cover transform group-hover:scale-110 transition-transform duration-700" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar Column */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Contact Action Card */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 sticky top-24">
              <h3 className="text-lg font-bold text-slate-900 mb-6 uppercase tracking-wider text-xs">Contact Details</h3>
              
              <div className="space-y-3">
                {business.phone && (
                  <a href={`tel:${business.phone}`} className="flex items-center w-full p-4 rounded-2xl border border-slate-100 bg-slate-50 hover:border-blue-500 hover:bg-blue-50 hover:shadow-md transition-all group">
                    <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center mr-4 group-hover:bg-blue-600 transition-colors border border-slate-100 group-hover:border-blue-600">
                      <Phone className="h-5 w-5 text-blue-600 group-hover:text-white" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">Call</div>
                      <div className="font-extrabold text-slate-900 text-lg group-hover:text-blue-700">{business.phone}</div>
                    </div>
                  </a>
                )}
                
                {business.whatsapp && whatsappNumber && (
                  <a href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noreferrer" className="flex items-center w-full p-4 rounded-2xl border border-slate-100 bg-slate-50 hover:border-green-500 hover:bg-green-50 hover:shadow-md transition-all group">
                    <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center mr-4 group-hover:bg-green-600 transition-colors border border-slate-100 group-hover:border-green-600">
                      <MessageCircle className="h-5 w-5 text-green-600 group-hover:text-white" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">WhatsApp</div>
                      <div className="font-extrabold text-slate-900 text-lg group-hover:text-green-700">{business.whatsapp}</div>
                    </div>
                  </a>
                )}

                {business.website && (
                  <a href={business.website.startsWith('http') ? business.website : `https://${business.website}`} target="_blank" rel="noreferrer" className="flex items-center w-full p-4 rounded-2xl border border-slate-100 bg-slate-50 hover:border-purple-500 hover:bg-purple-50 hover:shadow-md transition-all group">
                    <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center mr-4 group-hover:bg-purple-600 transition-colors border border-slate-100 group-hover:border-purple-600">
                      <Globe className="h-5 w-5 text-purple-600 group-hover:text-white" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">Website</div>
                      <div className="font-extrabold text-slate-900 text-lg group-hover:text-purple-700 truncate max-w-[160px]">{business.website.replace(/^https?:\/\//, '')}</div>
                    </div>
                  </a>
                )}

                <div className="pt-4 mt-4 border-t border-slate-100">
                  <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${business.name} ${business.locality} ${business.city}`)}`} target="_blank" rel="noreferrer" className="flex items-center justify-center w-full p-4 rounded-xl font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm">
                    <Navigation className="w-5 h-5 mr-2 text-slate-400" /> Get Directions
                  </a>
                </div>
              </div>
            </div>

            {/* Hours Card */}
            {business.hours.length > 0 && (
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
                <div className="flex items-center mb-6">
                  <Clock className="h-5 w-5 text-blue-600 mr-2" />
                  <h3 className="text-lg font-bold text-slate-900 uppercase tracking-wider text-xs">Opening Hours</h3>
                </div>
                <div className="space-y-1">
                  {business.hours.map((hour) => {
                    const isToday = new Date().getDay() === hour.day;
                    return (
                      <div key={hour.id} className={`flex justify-between items-center py-2.5 px-3 rounded-lg ${isToday ? 'bg-blue-50 border border-blue-100' : ''}`}>
                        <span className={`font-medium ${isToday ? 'text-blue-700 font-bold' : 'text-slate-600'}`}>
                          {days[hour.day]}
                          {isToday && <span className="ml-2 text-[10px] uppercase tracking-wider bg-blue-200 text-blue-800 px-1.5 py-0.5 rounded">Today</span>}
                        </span>
                        <span className={hour.closed ? "text-red-500 font-bold text-sm bg-red-50 px-2 py-0.5 rounded" : `font-bold text-sm ${isToday ? 'text-blue-800' : 'text-slate-900'}`}>
                          {hour.closed ? "Closed" : `${hour.openTime} - ${hour.closeTime}`}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            
          </div>
        </div>
      </div>
    </div>
  );
}
