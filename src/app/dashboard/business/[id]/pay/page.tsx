"use client";

import { useState, use } from "react";
import { useRouter } from "next/navigation";
import { CreditCard, CheckCircle } from "lucide-react";
import Script from "next/script";

export default function PaymentPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ businessId: unwrappedParams.id }),
      });

      if (!res.ok) throw new Error("Failed to create order");
      
      const { orderId, amount, currency } = await res.json();

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_placeholder",
        amount,
        currency,
        name: "LocalFind",
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
            setError("Payment verification failed. Please contact support.");
          }
        },
        prefill: {
          name: "Business Owner",
        },
        theme: {
          color: "#2563eb",
        },
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.open();
      
      paymentObject.on("payment.failed", function () {
        setError("Payment failed. Please try again.");
      });
      
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-white p-12 rounded-xl border border-gray-200 shadow-sm text-center max-w-lg mx-auto mt-10">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="h-10 w-10 text-green-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Payment Successful 🎉</h2>
        <p className="text-gray-600 text-lg mb-8">
          Your business listing has been submitted for approval. We will review it shortly.
        </p>
        <p className="text-sm text-gray-400">Redirecting to dashboard...</p>
      </div>
    );
  }

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      
      <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm max-w-lg mx-auto mt-10">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Complete Your Listing</h1>
        <p className="text-gray-600 mb-8">Pay securely to submit your listing for approval.</p>

        <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 mb-8">
          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-700">1 Year Subscription</span>
            <span className="font-bold text-gray-900">₹399.00</span>
          </div>
          <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
            <span>Taxes</span>
            <span>Included</span>
          </div>
          <div className="border-t border-gray-200 pt-4 flex justify-between items-center">
            <span className="font-bold text-gray-900">Total</span>
            <span className="text-2xl font-extrabold text-blue-600">₹399.00</span>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 text-red-500 p-4 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}

        <button
          onClick={handlePayment}
          disabled={loading}
          className="w-full flex justify-center items-center py-4 px-4 border border-transparent rounded-lg shadow-sm text-lg font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          <CreditCard className="h-5 w-5 mr-2" />
          {loading ? "Processing..." : "Pay ₹399 Now"}
        </button>
        <p className="text-center text-xs text-gray-500 mt-4">
          Secured by Razorpay
        </p>
      </div>
    </>
  );
}
