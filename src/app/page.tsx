import Link from "next/link";
import { Search, Star, MapPin, Store, CheckCircle, ArrowRight, TrendingUp, Users, ShieldCheck, Heart } from "lucide-react";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* 
        HERO SECTION 
        Premium SaaS feel with subtle grid background and floating UI elements
      */}
      <section className="relative pt-24 pb-32 overflow-hidden bg-slate-50">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50/50 to-transparent"></div>
        
        {/* Floating gradient orb */}
        <div className="absolute top-0 right-0 -mr-48 -mt-48 w-96 h-96 rounded-full bg-blue-400/20 blur-3xl opacity-60"></div>
        <div className="absolute bottom-0 left-0 -ml-48 -mb-48 w-96 h-96 rounded-full bg-indigo-400/20 blur-3xl opacity-60"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col items-center">
          
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100/50 border border-blue-200/50 text-blue-700 font-semibold text-sm mb-8 shadow-sm">
            <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse"></span>
            Join 5,000+ local businesses online
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 text-center mb-6 text-balance leading-tight">
            Find the best local <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              businesses around you.
            </span>
          </h1>
          
          <p className="text-xl text-slate-600 max-w-2xl text-center mb-10 text-balance leading-relaxed">
            Discover trusted restaurants, top-rated healthcare professionals, and premium home services near your location.
          </p>
          
          <div className="w-full max-w-3xl glass-panel p-2 rounded-2xl md:rounded-full mb-10 flex flex-col md:flex-row gap-2">
            <form action="/search" method="GET" className="flex-grow flex flex-col md:flex-row items-center gap-2">
              <div className="flex-grow flex items-center px-4 w-full h-14 bg-white/60 rounded-xl md:rounded-full border border-slate-200 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10 transition-all">
                <Search className="h-5 w-5 text-slate-400 shrink-0" />
                <input 
                  type="text" 
                  name="q"
                  placeholder="What are you looking for? (e.g. Dentists, Cafes)" 
                  className="w-full h-full py-2 px-3 text-slate-900 bg-transparent border-none focus:ring-0 outline-none placeholder:text-slate-500 text-base font-medium"
                />
              </div>
              <div className="flex-shrink-0 flex items-center px-4 w-full md:w-48 h-14 bg-white/60 rounded-xl md:rounded-full border border-slate-200 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10 transition-all">
                <MapPin className="h-5 w-5 text-slate-400 shrink-0" />
                <input 
                  type="text" 
                  name="location"
                  placeholder="Location" 
                  className="w-full h-full py-2 px-3 text-slate-900 bg-transparent border-none focus:ring-0 outline-none placeholder:text-slate-500 text-base font-medium"
                />
              </div>
              <button type="submit" className="w-full md:w-auto h-14 px-8 rounded-xl md:rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold tracking-wide transition-all shadow-md shadow-blue-600/20 hover:shadow-lg hover:shadow-blue-600/30 hover:-translate-y-0.5 active:translate-y-0 shrink-0">
                Search
              </button>
            </form>
          </div>
          
          <div className="flex flex-wrap justify-center gap-3 text-sm font-semibold text-slate-600">
            <span className="flex items-center text-slate-400 mr-2"><TrendingUp className="w-4 h-4 mr-1" /> Popular:</span>
            <Link href="/search?q=restaurants" className="px-3 py-1 rounded-full bg-white border border-slate-200 hover:border-blue-300 hover:text-blue-600 transition-colors shadow-sm">Restaurants</Link>
            <Link href="/search?q=plumbers" className="px-3 py-1 rounded-full bg-white border border-slate-200 hover:border-blue-300 hover:text-blue-600 transition-colors shadow-sm">Plumbers</Link>
            <Link href="/search?q=dentists" className="px-3 py-1 rounded-full bg-white border border-slate-200 hover:border-blue-300 hover:text-blue-600 transition-colors shadow-sm">Dentists</Link>
            <Link href="/search?q=salons" className="px-3 py-1 rounded-full bg-white border border-slate-200 hover:border-blue-300 hover:text-blue-600 transition-colors shadow-sm hidden sm:block">Salons</Link>
          </div>
        </div>
      </section>

      {/* 
        CATEGORIES SECTION 
        Asymmetrical visual variation to avoid "box grid" fatigue
      */}
      <section className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div className="max-w-2xl">
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">Explore Categories</h2>
              <p className="text-lg text-slate-600 leading-relaxed">From top-rated dining to essential home services, find exactly what you need in your neighborhood.</p>
            </div>
            <Link href="/search" className="inline-flex items-center font-bold text-blue-600 hover:text-blue-700 group">
              View all categories <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-12 gap-6">
            {/* Featured Large Card */}
            <Link href="/category/restaurants" className="col-span-2 md:col-span-8 lg:col-span-6 relative h-72 rounded-3xl overflow-hidden group shadow-md hover:shadow-xl transition-all border border-slate-100">
              <div className="absolute inset-0 bg-slate-900/20 group-hover:bg-slate-900/10 transition-colors z-10"></div>
              <Image src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&q=80" alt="Restaurants" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover transform group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent z-20"></div>
              <div className="absolute bottom-0 left-0 p-8 z-30">
                <span className="inline-block px-3 py-1 mb-3 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-bold uppercase tracking-wider border border-white/20">Popular</span>
                <h3 className="text-3xl font-bold text-white mb-2">Restaurants & Cafes</h3>
                <p className="text-slate-200 text-sm font-medium">1,200+ top rated places</p>
              </div>
            </Link>

            {/* Square Card */}
            <Link href="/category/healthcare" className="col-span-1 md:col-span-4 lg:col-span-3 relative h-72 rounded-3xl overflow-hidden group shadow-md hover:shadow-xl transition-all border border-slate-100 bg-blue-50 flex flex-col p-8">
              <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center mb-auto shadow-md">
                <Heart className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-1">Healthcare</h3>
                <p className="text-slate-600 text-sm font-medium">Doctors, Clinics, Labs</p>
              </div>
            </Link>

            {/* Square Image Card */}
            <Link href="/category/salons" className="col-span-1 md:col-span-12 lg:col-span-3 relative h-72 rounded-3xl overflow-hidden group shadow-md hover:shadow-xl transition-all border border-slate-100">
              <Image src="https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&q=80" alt="Salons" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover transform group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent z-20"></div>
              <div className="absolute bottom-0 left-0 p-6 z-30 w-full">
                <h3 className="text-xl font-bold text-white mb-1">Beauty & Spas</h3>
                <p className="text-slate-200 text-sm font-medium">Look your best</p>
              </div>
            </Link>

            {/* Pill Cards */}
            <Link href="/category/fitness" className="col-span-1 md:col-span-4 lg:col-span-3 bg-white border border-slate-200 hover:border-blue-400 rounded-2xl p-6 flex items-center gap-4 group hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-full bg-slate-100 group-hover:bg-blue-100 text-slate-600 group-hover:text-blue-600 flex items-center justify-center transition-colors">💪</div>
              <span className="font-bold text-slate-900">Fitness & Gyms</span>
            </Link>
            
            <Link href="/category/automotive" className="col-span-1 md:col-span-4 lg:col-span-3 bg-white border border-slate-200 hover:border-blue-400 rounded-2xl p-6 flex items-center gap-4 group hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-full bg-slate-100 group-hover:bg-blue-100 text-slate-600 group-hover:text-blue-600 flex items-center justify-center transition-colors">🚗</div>
              <span className="font-bold text-slate-900">Automotive</span>
            </Link>

            <Link href="/category/home-services" className="col-span-1 md:col-span-4 lg:col-span-3 bg-white border border-slate-200 hover:border-blue-400 rounded-2xl p-6 flex items-center gap-4 group hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-full bg-slate-100 group-hover:bg-blue-100 text-slate-600 group-hover:text-blue-600 flex items-center justify-center transition-colors">🔧</div>
              <span className="font-bold text-slate-900">Home Services</span>
            </Link>

            <Link href="/category/professional" className="col-span-1 md:col-span-12 lg:col-span-3 bg-slate-900 border border-slate-800 hover:bg-slate-800 rounded-2xl p-6 flex items-center gap-4 group shadow-md transition-all">
              <div className="w-12 h-12 rounded-full bg-slate-800 text-white flex items-center justify-center">💼</div>
              <span className="font-bold text-white">Professional</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 
        PREMIUM FEATURED BUSINESSES
        Real-looking imagery and strong card hierarchy
      */}
      <section className="py-24 bg-slate-50 border-t border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">Highly Rated Places</h2>
            <p className="text-lg text-slate-600">Discover businesses with consistently excellent customer reviews.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-premium-hover transition-all group flex flex-col h-full">
              <div className="relative h-56 overflow-hidden">
                <Image src="https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=800&q=80" alt="Dental Clinic" fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transform group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-4 left-4">
                  <span className="bg-white/95 backdrop-blur shadow-sm px-3 py-1 rounded-full text-xs font-bold text-slate-700 uppercase tracking-wider">Healthcare</span>
                </div>
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-slate-900 line-clamp-1">Premier Dental Studio</h3>
                  <div className="flex items-center gap-1 bg-green-50 text-green-700 px-2 py-1 rounded-md text-sm font-bold shrink-0">
                    <Star className="w-3.5 h-3.5 fill-current" /> 4.9
                  </div>
                </div>
                <div className="flex items-center text-slate-500 text-sm font-medium mb-4">
                  <MapPin className="w-4 h-4 mr-1 shrink-0" /> Downtown Medical District
                </div>
                <p className="text-slate-600 text-sm mb-6 line-clamp-2">Advanced cosmetic and general dentistry using state-of-the-art equipment in a relaxing environment.</p>
                <Link href="#" className="mt-auto block w-full text-center py-3 rounded-xl font-bold text-blue-600 bg-blue-50 hover:bg-blue-600 hover:text-white transition-colors">
                  View Profile
                </Link>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-premium-hover transition-all group flex flex-col h-full">
              <div className="relative h-56 overflow-hidden">
                <Image src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80" alt="Restaurant" fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transform group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-4 left-4">
                  <span className="bg-white/95 backdrop-blur shadow-sm px-3 py-1 rounded-full text-xs font-bold text-slate-700 uppercase tracking-wider">Restaurant</span>
                </div>
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-slate-900 line-clamp-1">The Rustic Fork</h3>
                  <div className="flex items-center gap-1 bg-green-50 text-green-700 px-2 py-1 rounded-md text-sm font-bold shrink-0">
                    <Star className="w-3.5 h-3.5 fill-current" /> 4.7
                  </div>
                </div>
                <div className="flex items-center text-slate-500 text-sm font-medium mb-4">
                  <MapPin className="w-4 h-4 mr-1 shrink-0" /> Westside Avenue
                </div>
                <p className="text-slate-600 text-sm mb-6 line-clamp-2">Authentic farm-to-table dining experience featuring seasonal local ingredients and craft cocktails.</p>
                <Link href="#" className="mt-auto block w-full text-center py-3 rounded-xl font-bold text-blue-600 bg-blue-50 hover:bg-blue-600 hover:text-white transition-colors">
                  View Profile
                </Link>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-premium-hover transition-all group flex flex-col h-full hidden lg:flex">
              <div className="relative h-56 overflow-hidden">
                <Image src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80" alt="Gym" fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transform group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-4 left-4">
                  <span className="bg-white/95 backdrop-blur shadow-sm px-3 py-1 rounded-full text-xs font-bold text-slate-700 uppercase tracking-wider">Fitness</span>
                </div>
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-slate-900 line-clamp-1">Iron & Steel Athletics</h3>
                  <div className="flex items-center gap-1 bg-green-50 text-green-700 px-2 py-1 rounded-md text-sm font-bold shrink-0">
                    <Star className="w-3.5 h-3.5 fill-current" /> 4.9
                  </div>
                </div>
                <div className="flex items-center text-slate-500 text-sm font-medium mb-4">
                  <MapPin className="w-4 h-4 mr-1 shrink-0" /> Industrial Park
                </div>
                <p className="text-slate-600 text-sm mb-6 line-clamp-2">Premium 24/7 fitness facility with Olympic lifting platforms, personal training, and recovery zones.</p>
                <Link href="#" className="mt-auto block w-full text-center py-3 rounded-xl font-bold text-blue-600 bg-blue-50 hover:bg-blue-600 hover:text-white transition-colors">
                  View Profile
                </Link>
              </div>
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <Link href="/search" className="inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-white border border-slate-200 text-slate-900 font-bold hover:border-slate-300 hover:bg-slate-50 transition-all shadow-sm">
              Explore more businesses
            </Link>
          </div>
        </div>
      </section>

      {/* 
        MASSIVE CONVERSION CTA SECTION
        Designed to sell the ₹399/year value proposition powerfully
      */}
      <section className="py-24 bg-slate-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern-dark opacity-10"></div>
        <div className="absolute top-0 right-0 -mr-48 -mt-48 w-96 h-96 rounded-full bg-blue-600/30 blur-3xl opacity-50"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            <div className="order-2 lg:order-1">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 font-bold text-xs uppercase tracking-wider mb-6">
                <Store className="w-4 h-4" /> For Business Owners
              </div>
              <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-6 leading-tight">
                Your customers are searching. <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Make sure they find you.</span>
              </h2>
              <p className="text-xl text-slate-300 mb-10 leading-relaxed">
                Build a stunning, SEO-optimized business profile in minutes. Showcase your services, collect reviews, and grow your local presence.
              </p>
              
              <ul className="space-y-5 mb-12">
                {[
                  'Professional digital storefront',
                  'Appear in local search results',
                  'Showcase photos, videos, and services',
                  'Direct contact buttons (Call, WhatsApp, Website)'
                ].map((benefit, i) => (
                  <li key={i} className="flex items-center text-slate-200 font-medium text-lg">
                    <div className="mr-4 w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0">
                      <CheckCircle className="h-4 w-4 text-blue-400" />
                    </div>
                    {benefit}
                  </li>
                ))}
              </ul>
              
              <div className="flex flex-col sm:flex-row items-center gap-6 p-6 bg-slate-900 rounded-3xl border border-slate-800 shadow-xl">
                <div>
                  <p className="text-slate-400 text-sm font-semibold uppercase tracking-wider mb-1">Simple Annual Pricing</p>
                  <p className="text-4xl font-extrabold text-white flex items-baseline">
                    ₹399 <span className="text-lg text-slate-400 font-medium ml-2">/ year</span>
                  </p>
                </div>
                <div className="w-full sm:w-auto flex-grow text-right">
                  <Link href="/list-your-business" className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-500 transition-colors shadow-lg shadow-blue-600/20">
                    Get Listed Now
                  </Link>
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2 relative">
              {/* Decorative floating UI elements */}
              <div className="relative z-10 bg-white rounded-[2rem] p-4 shadow-2xl shadow-blue-900/20 border border-slate-200/20 transform rotate-2 hover:rotate-0 transition-transform duration-500 max-w-md mx-auto lg:ml-auto">
                <div className="bg-slate-50 rounded-2xl overflow-hidden border border-slate-100">
                  <Image src="https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=800&q=80" alt="Preview" width={800} height={192} sizes="(max-width: 768px) 100vw, 400px" className="w-full h-48 object-cover" />
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="text-xl font-bold text-slate-900 mb-1">Premier Dental Studio</h4>
                        <p className="text-slate-500 text-sm font-medium">Healthcare • 2.4 km away</p>
                      </div>
                      <ShieldCheck className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex gap-2 mb-6">
                      <div className="flex-1 bg-blue-600 text-white text-center py-2.5 rounded-xl text-sm font-bold shadow-sm">Call Now</div>
                      <div className="flex-1 bg-slate-100 text-slate-700 text-center py-2.5 rounded-xl text-sm font-bold">Directions</div>
                    </div>
                    <div className="space-y-3">
                      <div className="h-2 bg-slate-200 rounded w-full"></div>
                      <div className="h-2 bg-slate-200 rounded w-5/6"></div>
                      <div className="h-2 bg-slate-200 rounded w-4/6"></div>
                    </div>
                  </div>
                </div>
                
                {/* Floating notification */}
                <div className="absolute -bottom-6 -left-10 bg-white p-4 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-4 animate-bounce" style={{ animationDuration: '3s' }}>
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                    <Users className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-bold uppercase">New Activity</p>
                    <p className="text-sm text-slate-900 font-bold">24 profile views today</p>
                  </div>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </section>

    </div>
  );
}
