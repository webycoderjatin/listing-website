import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { MapPin, Phone, Globe, MessageCircle, Clock, CheckCircle2, Star, Share2 } from "lucide-react";
import type { Metadata, ResolvingMetadata } from "next";

type Props = {
  params: Promise<{ city: string; category: string; slug: string }>;
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = await params;
  const business = await prisma.business.findUnique({
    where: { slug },
    include: { category: true },
  });

  if (!business || business.status !== "APPROVED") {
    return { title: "Not Found" };
  }

  return {
    title: business.seoTitle || `${business.name} | ${business.category.name} in ${business.city}`,
    description: business.seoDescription || business.description?.substring(0, 160) || `Contact ${business.name} in ${business.city}.`,
  };
}

export default async function BusinessProfilePage({ params }: Props) {
  const { slug } = await params;
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

  if (!business || business.status !== "APPROVED") {
    notFound();
  }

  const logo = business.media.find(m => m.type === 'LOGO');
  const images = business.media.filter(m => m.type === 'IMAGE');

  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* Header Banner */}
      <div className="h-64 md:h-80 bg-blue-900 relative">
        {images.length > 0 && (
          <img 
            src={images[0].url} 
            alt={business.name} 
            className="w-full h-full object-cover opacity-40 mix-blend-overlay"
          />
        )}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-10">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-10">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Logo */}
            <div className="w-32 h-32 md:w-40 md:h-40 bg-white rounded-xl shadow-md flex items-center justify-center border border-gray-100 overflow-hidden flex-shrink-0 -mt-16 md:-mt-20">
              {logo ? (
                <img src={logo.url} alt={`${business.name} logo`} className="w-full h-full object-cover" />
              ) : (
                <div className="text-4xl text-gray-300 font-bold">{business.name.charAt(0)}</div>
              )}
            </div>

            {/* Info */}
            <div className="flex-grow">
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                <div>
                  <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 flex items-center flex-wrap gap-2">
                    {business.name}
                    {business.verified && (
                      <span title="Verified Listing">
                        <CheckCircle2 className="h-6 w-6 text-green-500" />
                      </span>
                    )}
                  </h1>
                  <p className="text-lg text-gray-600 mt-2 font-medium">
                    {business.category.name}
                  </p>
                  <div className="flex items-center mt-3 text-gray-500">
                    <MapPin className="h-5 w-5 mr-2" />
                    <span>{business.address}, {business.locality}, {business.city}</span>
                  </div>
                </div>

                {/* Primary Actions Desktop */}
                <div className="flex flex-wrap gap-3 mt-4 md:mt-0">
                  <button className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition">
                    <Share2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* About */}
            {business.description && (
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">About</h2>
                <div className="prose prose-blue max-w-none text-gray-600 whitespace-pre-wrap">
                  {business.description}
                </div>
              </div>
            )}

            {/* Services */}
            {business.services.length > 0 && (
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Services</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {business.services.map((service) => (
                    <div key={service.id} className="p-4 rounded-xl border border-gray-100 bg-gray-50">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-gray-900">{service.name}</h3>
                        {service.price && <span className="text-blue-600 font-medium bg-blue-50 px-2 py-1 rounded text-sm">{service.price}</span>}
                      </div>
                      {service.description && (
                        <p className="text-sm text-gray-600">{service.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Photos */}
            {images.length > 0 && (
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Photos</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {images.map((img) => (
                    <div key={img.id} className="aspect-square rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                      <img src={img.url} alt={business.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Card */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Contact</h3>
              
              <div className="space-y-4">
                {business.phone && (
                  <a href={`tel:${business.phone}`} className="flex items-center w-full p-4 rounded-xl border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-colors group">
                    <div className="bg-blue-100 p-2 rounded-full mr-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <Phone className="h-5 w-5 text-blue-600 group-hover:text-white" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 font-medium">Call</div>
                      <div className="font-bold text-gray-900">{business.phone}</div>
                    </div>
                  </a>
                )}
                
                {business.whatsapp && (
                  <a href={`https://wa.me/${business.whatsapp}`} target="_blank" rel="noreferrer" className="flex items-center w-full p-4 rounded-xl border border-gray-200 hover:border-green-500 hover:bg-green-50 transition-colors group">
                    <div className="bg-green-100 p-2 rounded-full mr-4 group-hover:bg-green-600 group-hover:text-white transition-colors">
                      <MessageCircle className="h-5 w-5 text-green-600 group-hover:text-white" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 font-medium">WhatsApp</div>
                      <div className="font-bold text-gray-900">{business.whatsapp}</div>
                    </div>
                  </a>
                )}

                {business.website && (
                  <a href={business.website.startsWith('http') ? business.website : `https://${business.website}`} target="_blank" rel="noreferrer" className="flex items-center w-full p-4 rounded-xl border border-gray-200 hover:border-purple-500 hover:bg-purple-50 transition-colors group">
                    <div className="bg-purple-100 p-2 rounded-full mr-4 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                      <Globe className="h-5 w-5 text-purple-600 group-hover:text-white" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 font-medium">Website</div>
                      <div className="font-bold text-gray-900 truncate max-w-[180px]">{business.website.replace(/^https?:\/\//, '')}</div>
                    </div>
                  </a>
                )}
              </div>
            </div>

            {/* Hours Card */}
            {business.hours.length > 0 && (
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center mb-6">
                  <Clock className="h-6 w-6 text-gray-400 mr-2" />
                  <h3 className="text-xl font-bold text-gray-900">Opening Hours</h3>
                </div>
                <div className="space-y-3">
                  {business.hours.map((hour) => (
                    <div key={hour.id} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
                      <span className="font-medium text-gray-700">{days[hour.day]}</span>
                      <span className={hour.closed ? "text-red-500 font-medium text-sm" : "text-gray-600 font-medium"}>
                        {hour.closed ? "Closed" : `${hour.openTime} - ${hour.closeTime}`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
