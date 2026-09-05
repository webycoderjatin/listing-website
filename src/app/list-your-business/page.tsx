import Link from "next/link";
import { Check, Store, MapPin, Globe, Clock, Camera, Shield, CheckCircle2, ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "List Your Business | Show Listing",
  description: "Get your business online and attract more local customers with a premium profile on Show Listing for just ₹399/year.",
};

export const dynamic = "force-dynamic";

async function startBusinessOnboarding() {
  "use server";

  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/list-your-business");
  }

  if (session.user.role === "ADMIN") {
    redirect("/admin");
  }

  if (session.user.role === "USER") {
    const updated = await prisma.user.updateMany({
      where: { id: session.user.id, role: "USER" },
      data: { role: "BUSINESS_OWNER" },
    });

    if (updated.count !== 1) {
      redirect("/profile");
    }
  }

  redirect("/dashboard/business/new");
}

export default async function ListYourBusinessPage() {
  const session = await getServerSession(authOptions);
  const isAuthenticated = Boolean(session?.user?.id);

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden bg-slate-950 text-white">
        <div className="absolute inset-0 bg-grid-pattern-dark opacity-10"></div>
        <div className="absolute top-0 right-0 -mr-48 -mt-48 w-96 h-96 rounded-full bg-blue-600/30 blur-3xl opacity-50"></div>
        <div className="absolute bottom-0 left-0 -ml-48 -mb-48 w-96 h-96 rounded-full bg-indigo-600/30 blur-3xl opacity-50"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/80 border border-slate-700 text-blue-300 font-bold text-sm mb-8 backdrop-blur-sm">
            <span className="flex h-2 w-2 rounded-full bg-blue-400 animate-pulse"></span>
            The #1 platform for local growth
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 text-balance leading-tight">
            Put your business <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
              where customers are looking.
            </span>
          </h1>
          <p className="text-xl max-w-2xl mx-auto text-slate-300 mb-10 text-balance leading-relaxed">
            Create a premium, SEO-friendly online presence for your business in minutes. Get found when locals search for your services.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            {isAuthenticated ? (
              <form action={startBusinessOnboarding} className="inline-block w-full sm:w-auto">
                <button type="submit" className="inline-flex items-center justify-center font-bold transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 w-full sm:w-auto px-8 py-4 rounded-xl text-lg text-slate-900 bg-white hover:bg-slate-100 shadow-white/20">
                  List Your Business — ₹399/year <ArrowRight className="ml-2 w-5 h-5" />
                </button>
              </form>
            ) : (
              <Link
                href="/login?callbackUrl=/list-your-business"
                className="inline-flex items-center justify-center font-bold transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 w-full sm:w-auto px-8 py-4 rounded-xl text-lg text-slate-900 bg-white hover:bg-slate-100 shadow-white/20"
              >
                List Your Business — ₹399/year <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            )}
          </div>
          <div className="mt-8 flex items-center justify-center gap-6 text-sm text-slate-400 font-medium">
            <span className="flex items-center"><CheckCircle2 className="w-4 h-4 mr-2 text-blue-500" /> Cancel anytime</span>
            <span className="flex items-center"><CheckCircle2 className="w-4 h-4 mr-2 text-blue-500" /> No hidden fees</span>
            <span className="flex items-center"><CheckCircle2 className="w-4 h-4 mr-2 text-blue-500" /> Live in 5 minutes</span>
          </div>
        </div>
      </section>

      {/* Product Preview Section */}
      <section className="-mt-16 relative z-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto mb-24">
        <div className="bg-white rounded-[2.5rem] p-4 shadow-2xl shadow-slate-900/10 border border-slate-200">
          <div className="bg-slate-50 rounded-[2rem] overflow-hidden border border-slate-100">
            {/* Fake Browser Chrome */}
            <div className="h-12 border-b border-slate-200 bg-white flex items-center px-6 gap-2">
              <div className="w-3 h-3 rounded-full bg-red-400"></div>
              <div className="w-3 h-3 rounded-full bg-amber-400"></div>
              <div className="w-3 h-3 rounded-full bg-green-400"></div>
              <div className="ml-4 h-6 w-64 bg-slate-100 rounded-md border border-slate-200 flex items-center px-3">
                <span className="text-[10px] font-mono text-slate-400">localfind.com/business/...</span>
              </div>
            </div>
            {/* Fake Content */}
            <div className="p-8 md:p-12">
              <div className="flex flex-col md:flex-row gap-8">
                <div className="w-full md:w-1/3">
                  <div className="w-full aspect-square rounded-2xl bg-slate-200 overflow-hidden relative shadow-inner">
                    <img src="https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=800&q=80" alt="Preview" className="w-full h-full object-cover" />
                  </div>
                </div>
                <div className="w-full md:w-2/3">
                  <div className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold uppercase tracking-wider mb-4">Healthcare</div>
                  <h3 className="text-4xl font-extrabold text-slate-900 mb-2">Premier Dental Studio</h3>
                  <div className="flex items-center gap-2 mb-6">
                    <div className="flex text-amber-400">{'★'.repeat(5)}</div>
                    <span className="font-bold text-slate-900">4.9</span>
                    <span className="text-slate-500">(128 reviews)</span>
                  </div>
                  <div className="flex flex-wrap gap-3 mb-8">
                    <div className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold shadow-md">Call Now</div>
                    <div className="px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold border border-slate-200">Get Directions</div>
                    <div className="px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold border border-slate-200">Visit Website</div>
                  </div>
                  <div className="space-y-4">
                    <div className="h-4 bg-slate-200 rounded w-full"></div>
                    <div className="h-4 bg-slate-200 rounded w-5/6"></div>
                    <div className="h-4 bg-slate-200 rounded w-4/6"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20 max-w-3xl mx-auto">
            <h2 className="text-4xl font-extrabold text-slate-900 mb-6 tracking-tight">Everything you need to grow online</h2>
            <p className="text-xl text-slate-600 leading-relaxed">More than just a directory. We give you a beautiful digital storefront equipped with tools to convert visitors into paying customers.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Globe className="h-6 w-6 text-blue-600" />,
                title: "SEO-Optimized Profile",
                desc: "Your dedicated page is structured technically to rank high on Google and other search engines instantly."
              },
              {
                icon: <Camera className="h-6 w-6 text-blue-600" />,
                title: "Rich Media Showcase",
                desc: "Upload high-quality photos, your logo, and add a video to show customers exactly what makes you special."
              },
              {
                icon: <MapPin className="h-6 w-6 text-blue-600" />,
                title: "Location & Directions",
                desc: "Integrated mapping technology so customers can easily find and navigate directly to your storefront."
              },
              {
                icon: <Store className="h-6 w-6 text-blue-600" />,
                title: "Services & Pricing",
                desc: "List exactly what you offer with pricing, so customers know you have what they need before they call."
              },
              {
                icon: <Clock className="h-6 w-6 text-blue-600" />,
                title: "Always Up-to-date",
                desc: "Update your business hours, contact info, and services instantly from your easy-to-use dashboard."
              },
              {
                icon: <Check className="h-6 w-6 text-blue-600" />,
                title: "Direct Contact Links",
                desc: "One-click Call, WhatsApp, and Website buttons drive direct, highly-qualified leads to you."
              }
            ].map((feature, i) => (
              <div key={i} className="bg-slate-50 p-8 rounded-3xl border border-slate-100 hover:border-blue-200 hover:shadow-lg transition-all group">
                <div className="bg-white w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-slate-100 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed font-medium">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1556761175-5973dc0f32b7?w=1600&q=80')] opacity-5 bg-cover bg-center"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h2 className="text-4xl font-extrabold text-center text-white mb-20 tracking-tight">How it works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 relative">
            {/* Connecting line for desktop */}
            <div className="hidden md:block absolute top-12 left-1/8 right-1/8 h-0.5 bg-slate-700" style={{ width: '75%', left: '12.5%' }}></div>
            
            {[
              { step: "1", title: "Sign Up", desc: "Create a free account in seconds." },
              { step: "2", title: "Add Details", desc: "Fill in your business information, photos, and services." },
              { step: "3", title: "Checkout", desc: "Pay securely via Razorpay (₹399/year)." },
              { step: "4", title: "Go Live", desc: "We review and approve your listing, and you're online!" }
            ].map((step, i) => (
              <div key={i} className="relative flex flex-col items-center text-center group">
                <div className="w-24 h-24 bg-slate-950 rounded-full border-4 border-slate-700 group-hover:border-blue-500 transition-colors flex items-center justify-center text-3xl font-extrabold text-white mb-8 relative z-10 shadow-xl">
                  {step.step}
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">{step.title}</h3>
                <p className="text-slate-400 font-medium">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-lg mx-auto bg-white rounded-[2.5rem] p-10 md:p-12 shadow-2xl border border-slate-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8">
              <Shield className="w-12 h-12 text-blue-100" />
            </div>
            
            <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Annual Listing</h2>
            <p className="text-slate-500 font-medium mb-8">Everything you need to get found locally.</p>
            
            <div className="mb-10 flex items-baseline">
              <span className="text-6xl font-extrabold text-slate-900 tracking-tight">₹399</span>
              <span className="text-xl text-slate-500 font-bold ml-2">/ year</span>
            </div>
            
            <ul className="space-y-5 mb-10">
              {['Premium Business Profile', 'Unlimited Services Listing', 'Photo & Video Gallery', 'Map Integration', 'SEO Optimization', 'Direct Contact Buttons', 'Analytics Dashboard'].map((item, i) => (
                <li key={i} className="flex items-center text-slate-700 font-medium">
                  <CheckCircle2 className="w-5 h-5 text-blue-600 mr-3 shrink-0" /> {item}
                </li>
              ))}
            </ul>
            
            {isAuthenticated ? (
              <form action={startBusinessOnboarding} className="inline-block w-full">
                <button type="submit" className="inline-flex items-center justify-center font-bold transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 w-full px-8 py-5 rounded-2xl text-lg text-white bg-blue-600 hover:bg-blue-700 shadow-blue-600/30">
                  List Your Business — ₹399/year <ArrowRight className="ml-2 w-5 h-5" />
                </button>
              </form>
            ) : (
              <Link
                href="/login?callbackUrl=/list-your-business"
                className="inline-flex items-center justify-center font-bold transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 w-full px-8 py-5 rounded-2xl text-lg text-white bg-blue-600 hover:bg-blue-700 shadow-blue-600/30"
              >
                List Your Business — ₹399/year <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            )}
            <p className="text-center text-sm text-slate-500 mt-6 font-medium">Secure payment via Razorpay.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
