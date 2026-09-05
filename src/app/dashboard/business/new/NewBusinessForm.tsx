"use client";

import { useActionState } from "react";
import { createBusiness } from "@/server/actions";
import { Store, MapPin, AlignLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function NewBusinessForm({ categories }: { categories: { id: string; name: string }[] }) {
  const [state, formAction, isPending] = useActionState(createBusiness, null);
  const router = useRouter();

  useEffect(() => {
    if (state?.success && state?.id) {
      router.push(`/dashboard/business/${state.id}/pay`);
    }
  }, [state, router]);

  return (
    <form action={formAction} className="space-y-8">
      {state?.error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg font-medium">
          {state.error}
        </div>
      )}
      {/* Basic Info */}
      <section>
        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
          <Store className="h-5 w-5 mr-2 text-blue-600" />
          Basic Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Business Name *</label>
            <input type="text" name="name" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" placeholder="e.g. Sharma Dental Clinic" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
            <select name="categoryId" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white">
              <option value="">Select a category</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Contact Info */}
      <section>
        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
          <AlignLeft className="h-5 w-5 mr-2 text-blue-600" />
          Contact Details
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <input type="tel" name="phone" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" placeholder="+91 9876543210" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp Number</label>
            <input type="tel" name="whatsapp" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" placeholder="+91 9876543210" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Website URL</label>
            <input type="url" name="website" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" placeholder="https://www.example.com" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
          <textarea name="description" required rows={4} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" placeholder="Tell customers about your business, what you offer, and why they should choose you..."></textarea>
        </div>
      </section>

      {/* Location Info */}
      <section>
        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
          <MapPin className="h-5 w-5 mr-2 text-blue-600" />
          Location
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Address *</label>
            <input type="text" name="address" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" placeholder="Shop No. 12, Main Market" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Locality/Area *</label>
              <input type="text" name="locality" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" placeholder="Sector 70" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
              <input type="text" name="city" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" placeholder="Mohali" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
              <input type="text" name="state" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" placeholder="Punjab" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Pincode *</label>
              <input type="text" name="pincode" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" placeholder="160071" />
            </div>
          </div>
        </div>
      </section>

      <div className="pt-6 border-t flex justify-end">
        <button type="submit" disabled={isPending} className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 transition shadow-sm disabled:opacity-50">
          {isPending ? "Saving..." : "Save & Continue to Payment (₹399)"}
        </button>
      </div>
    </form>
  );
}
