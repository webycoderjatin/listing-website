import Link from "next/link";
import { Check, Store, MapPin, Globe, Clock, Camera } from "lucide-react";
import type { Metadata } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "List Your Business | LocalFind",
  description: "Get your business online and attract more local customers with a premium profile on LocalFind for just ₹399/year.",
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

  const cta = isAuthenticated ? (
    <form action={startBusinessOnboarding}>
      <button type="submit" className="inline-block bg-white text-blue-600 font-bold px-8 py-4 rounded-full text-lg shadow-lg hover:shadow-xl hover:bg-gray-50 transition-all transform hover:-translate-y-1">
        Create My Listing — ₹399/year
      </button>
    </form>
  ) : (
    <Link
      href="/login?callbackUrl=/list-your-business"
      className="inline-block bg-white text-blue-600 font-bold px-8 py-4 rounded-full text-lg shadow-lg hover:shadow-xl hover:bg-gray-50 transition-all transform hover:-translate-y-1"
    >
      Create My Listing — ₹399/year
    </Link>
  );

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="bg-blue-600 text-white pt-20 pb-24 text-center px-4">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">
          Reach More Local Customers
        </h1>
        <p className="text-xl max-w-2xl mx-auto text-blue-100 mb-8">
          Create a premium, SEO-friendly online presence for your business in minutes. 
          Get found when locals search for your services.
        </p>
        {cta}
        <p className="mt-4 text-blue-200 text-sm">No hidden fees. Cancel anytime.</p>
      </div>

      {/* Benefits */}
      <div className="max-w-7xl mx-auto py-20 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900">Everything you need to grow online</h2>
          <p className="mt-4 text-xl text-gray-600">More than just a directory, it&apos;s your local digital storefront.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {[
            {
              icon: <Globe className="h-8 w-8 text-blue-600" />,
              title: "SEO-Optimized Profile",
              desc: "Your dedicated page is structured to rank high on Google and other search engines."
            },
            {
              icon: <Camera className="h-8 w-8 text-blue-600" />,
              title: "Rich Media Showcase",
              desc: "Upload photos, your logo, and add a video to show customers what makes you special."
            },
            {
              icon: <MapPin className="h-8 w-8 text-blue-600" />,
              title: "Location & Directions",
              desc: "Integrated maps so customers can easily find and navigate to your storefront."
            },
            {
              icon: <Store className="h-8 w-8 text-blue-600" />,
              title: "Services & Pricing",
              desc: "List exactly what you offer so customers know before they even call you."
            },
            {
              icon: <Clock className="h-8 w-8 text-blue-600" />,
              title: "Always Up-to-date",
              desc: "Update your business hours, contact info, and services instantly from your dashboard."
            },
            {
              icon: <Check className="h-8 w-8 text-blue-600" />,
              title: "Direct Contact Links",
              desc: "One-click Call, WhatsApp, and Website buttons drive direct leads to you."
            }
          ].map((feature, i) => (
            <div key={i} className="bg-gray-50 p-8 rounded-2xl border border-gray-100 hover:border-blue-200 transition-colors">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* How it works */}
      <div className="bg-gray-50 py-20 px-4 sm:px-6 lg:px-8 border-t border-gray-200">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-16">How it works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            {/* Connecting line for desktop */}
            <div className="hidden md:block absolute top-12 left-1/8 right-1/8 h-0.5 bg-gray-200" style={{ width: '75%', left: '12.5%' }}></div>
            
            {[
              { step: "1", title: "Sign Up", desc: "Create a free account in seconds." },
              { step: "2", title: "Add Details", desc: "Fill in your business information, photos, and services." },
              { step: "3", title: "Checkout", desc: "Pay securely via Razorpay (₹399/year)." },
              { step: "4", title: "Go Live", desc: "We review and approve your listing, and you're online!" }
            ].map((step, i) => (
              <div key={i} className="relative flex flex-col items-center text-center">
                <div className="w-24 h-24 bg-white rounded-full border-4 border-blue-600 flex items-center justify-center text-3xl font-bold text-blue-600 mb-6 relative z-10 shadow-sm">
                  {step.step}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="py-20 px-4 sm:px-6 lg:px-8 text-center max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Ready to get discovered?</h2>
        <p className="text-xl text-gray-600 mb-10">Join the platform that helps local customers find you.</p>
        {isAuthenticated ? (
          <form action={startBusinessOnboarding}>
            <button type="submit" className="inline-block bg-blue-600 text-white font-bold px-10 py-5 rounded-xl text-lg shadow-xl shadow-blue-600/30 hover:bg-blue-700 transition-colors">
              Get Started Now — Just ₹399/year
            </button>
          </form>
        ) : (
          <Link href="/login?callbackUrl=/list-your-business" className="inline-block bg-blue-600 text-white font-bold px-10 py-5 rounded-xl text-lg shadow-xl shadow-blue-600/30 hover:bg-blue-700 transition-colors">
            Get Started Now — Just ₹399/year
          </Link>
        )}
      </div>
    </div>
  );
}
