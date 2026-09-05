"use client";

import { useState, use } from "react";
import { useRouter } from "next/navigation";
import { CreditCard, CheckCircle, ShieldCheck } from "lucide-react";
import Script from "next/script";

export default function PaymentPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [checkoutReady, setCheckoutReady] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    setError("");

    try {
      if (!checkoutReady || !window.Razorpay) {
        throw new Error("The payment checkout is still loading. Please try again in a moment.");
      }

      const key = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
      if (!key) {
        throw new Error("Payments are not configured. Please contact support.");
      }

      const res = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ businessId: unwrappedParams.id }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null) as { error?: string } | null;
        throw new Error(data?.error || "Failed to create order");
      }
      
      const { orderId, amount, currency } = await res.json();

      const options = {
        key,
        amount,
        currency,
        name: "Show Listing",
        description: "1 Year Business Listing Subscription",
        order_id: orderId,
        handler: async function (response: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) {
          const verifyRes = await fetch("/api/razorpay/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              businessId: unwrappedParams.id,
            }),
          });

          if (verifyRes.ok) {
            setSuccess(true);
            setTimeout(() => {
              router.push("/dashboard");
              router.refresh();
            }, 3000);
          } else {
            const data = await verifyRes.json().catch(() => null) as { error?: string } | null;
            setError(data?.error || "Payment verification failed. Please contact support.");
          }
        },
        prefill: {
          name: "Business Owner",
        },
        theme: {
          color: "#2563eb",
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
      
      paymentObject.on("payment.failed", function () {
        setError("Payment failed. Please try again.");
      });
      
    } catch (error) {
      setError(error instanceof Error ? error.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-white p-12 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/40 text-center max-w-lg mx-auto mt-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-24 -mt-24 w-64 h-64 rounded-full bg-green-600/5 blur-3xl"></div>
        <div className="relative z-10">
          <div className="w-24 h-24 bg-green-50 border-[6px] border-green-100 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner shadow-green-600/10">
            <CheckCircle className="h-12 w-12 text-green-500" />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 mb-4 tracking-tight">Payment Successful!</h2>
          <p className="text-slate-500 text-lg mb-10 font-medium">
            Your business listing has been submitted for approval. We will review it shortly.
          </p>
          
          <div className="flex justify-center items-center gap-3">
            <svg className="animate-spin h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-sm font-bold text-slate-700">Redirecting to dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" onLoad={() => setCheckoutReady(true)} />
      
      <div className="bg-white p-8 md:p-12 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/40 max-w-lg mx-auto mt-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-24 -mt-24 w-64 h-64 rounded-full bg-blue-600/5 blur-3xl"></div>
        
        <div className="relative z-10 text-center mb-8">
          <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-blue-100">
            <CreditCard className="h-8 w-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Complete Your Listing</h1>
          <p className="text-slate-500 mt-3 font-medium">Pay securely to submit your listing for approval.</p>
        </div>

        <div className="relative z-10 bg-slate-50 p-6 md:p-8 rounded-2xl border border-slate-200/60 mb-8">
          <div className="flex justify-between items-center mb-5">
            <span className="text-slate-600 font-bold">1 Year Subscription</span>
            <span className="font-extrabold text-slate-900 text-lg">₹399.00</span>
          </div>
          <div className="flex justify-between items-center text-sm text-slate-500 mb-6 font-medium">
            <span>Taxes</span>
            <span>Included</span>
          </div>
          <div className="border-t border-slate-200 pt-5 flex justify-between items-end">
            <span className="font-bold text-slate-900">Total to pay</span>
            <span className="text-4xl font-extrabold text-blue-600 tracking-tight">₹399</span>
          </div>
        </div>

        {error && (
          <div className="relative z-10 bg-red-50 text-red-600 p-4 rounded-xl mb-8 text-sm font-medium border border-red-100 flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        )}

        <div className="relative z-10">
          <button
            onClick={handlePayment}
            disabled={loading || !checkoutReady}
            className="w-full flex justify-center items-center py-4 px-6 rounded-xl shadow-lg shadow-blue-600/30 hover:shadow-blue-600/40 text-lg font-bold text-white bg-blue-600 hover:bg-blue-700 hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 disabled:opacity-50 transition-all group"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : checkoutReady ? (
              <span className="flex items-center">
                Pay ₹399 Securely
                <ShieldCheck className="ml-2 w-5 h-5 opacity-70 group-hover:opacity-100 transition-opacity" />
              </span>
            ) : (
              "Loading payment..."
            )}
          </button>
          
          <div className="flex items-center justify-center gap-2 mt-6 text-sm font-medium text-slate-500">
            <ShieldCheck className="w-4 h-4 text-slate-400" />
            Secured by <span className="text-slate-700 font-bold">Razorpay</span>
          </div>
        </div>
      </div>
    </>
  );
}
