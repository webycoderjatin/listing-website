"use client";

import { useActionState } from "react";
import { createBusiness } from "@/server/actions";
import { Store, MapPin, AlignLeft, ArrowRight } from "lucide-react";

export function NewBusinessForm({ categories }: { categories: { id: string; name: string }[] }) {
  const [state, formAction, isPending] = useActionState(createBusiness, null);

  return (
    <form action={formAction} className="space-y-10">
      {state?.error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl font-medium border border-red-100 flex items-center gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          {state.error}
        </div>
      )}
      
      {/* Basic Info */}
      <section className="bg-white rounded-2xl">
        <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center border-b border-slate-100 pb-4">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center mr-4">
            <Store className="h-5 w-5 text-blue-600" />
          </div>
          Basic Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Business Name <span className="text-red-500">*</span></label>
            <input type="text" name="name" required className="w-full px-5 py-3.5 border border-slate-200 bg-slate-50 text-slate-900 font-medium rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent focus:bg-white transition-all" placeholder="e.g. Sharma Dental Clinic" />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Category <span className="text-red-500">*</span></label>
            <select name="categoryId" required className="w-full px-5 py-3.5 border border-slate-200 bg-slate-50 text-slate-900 font-medium rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent focus:bg-white transition-all appearance-none cursor-pointer">
              <option value="">Select a category</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="bg-white rounded-2xl">
        <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center border-b border-slate-100 pb-4">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center mr-4">
            <AlignLeft className="h-5 w-5 text-blue-600" />
          </div>
          Contact Details & Description
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Phone Number</label>
            <input type="tel" name="phone" className="w-full px-5 py-3.5 border border-slate-200 bg-slate-50 text-slate-900 font-medium rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent focus:bg-white transition-all" placeholder="+91 9876543210" />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">WhatsApp Number</label>
            <input type="tel" name="whatsapp" className="w-full px-5 py-3.5 border border-slate-200 bg-slate-50 text-slate-900 font-medium rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent focus:bg-white transition-all" placeholder="+91 9876543210" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-bold text-slate-700 mb-2">Website URL</label>
            <input type="url" name="website" className="w-full px-5 py-3.5 border border-slate-200 bg-slate-50 text-slate-900 font-medium rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent focus:bg-white transition-all" placeholder="https://www.example.com" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Description <span className="text-red-500">*</span></label>
          <textarea name="description" required rows={5} className="w-full px-5 py-3.5 border border-slate-200 bg-slate-50 text-slate-900 font-medium rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent focus:bg-white transition-all resize-y" placeholder="Tell customers about your business, what you offer, and why they should choose you..."></textarea>
        </div>
      </section>

      {/* Location Info */}
      <section className="bg-white rounded-2xl">
        <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center border-b border-slate-100 pb-4">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center mr-4">
            <MapPin className="h-5 w-5 text-blue-600" />
          </div>
          Location
        </h2>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Full Address <span className="text-red-500">*</span></label>
            <input type="text" name="address" required className="w-full px-5 py-3.5 border border-slate-200 bg-slate-50 text-slate-900 font-medium rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent focus:bg-white transition-all" placeholder="Shop No. 12, Main Market" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Locality/Area <span className="text-red-500">*</span></label>
              <input type="text" name="locality" required className="w-full px-5 py-3.5 border border-slate-200 bg-slate-50 text-slate-900 font-medium rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent focus:bg-white transition-all" placeholder="Sector 70" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">City <span className="text-red-500">*</span></label>
              <input type="text" name="city" required className="w-full px-5 py-3.5 border border-slate-200 bg-slate-50 text-slate-900 font-medium rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent focus:bg-white transition-all" placeholder="Mohali" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">State <span className="text-red-500">*</span></label>
              <input type="text" name="state" required className="w-full px-5 py-3.5 border border-slate-200 bg-slate-50 text-slate-900 font-medium rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent focus:bg-white transition-all" placeholder="Punjab" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Pincode <span className="text-red-500">*</span></label>
              <input type="text" name="pincode" required className="w-full px-5 py-3.5 border border-slate-200 bg-slate-50 text-slate-900 font-medium rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent focus:bg-white transition-all" placeholder="160071" />
            </div>
          </div>
        </div>
      </section>

      <div className="pt-8 border-t border-slate-100 flex justify-end">
        <button type="submit" disabled={isPending} className="group flex items-center justify-center bg-blue-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/30 hover:shadow-blue-600/40 disabled:opacity-50 hover:-translate-y-0.5 active:translate-y-0 w-full md:w-auto">
          {isPending ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving Details...
            </span>
          ) : (
            <span className="flex items-center text-lg">
              Save & Continue to Payment (₹399)
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
          )}
        </button>
      </div>
    </form>
  );
}
