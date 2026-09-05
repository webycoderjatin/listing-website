"use client";

import { FormEvent, Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

function VerifyEmailForm() {
  const router = useRouter();
  const params = useSearchParams();

  const email = params.get("email") ?? "";
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, code }),
      });

      const data = await response.json();

      if (response.ok) {
        const callbackUrl = params.get("callbackUrl");

        router.push(
          `/login?verified=true${
            callbackUrl
              ? `&callbackUrl=${encodeURIComponent(callbackUrl)}`
              : ""
          }`
        );

        return;
      }

      setMessage(data.message || "Unable to verify email.");
    } catch {
      setMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const resend = async () => {
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      setMessage(data.message || "Unable to resend verification code.");
    } catch {
      setMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <section className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl border border-slate-100">
        <p className="text-blue-600 font-bold">ShowListing</p>

        <h1 className="mt-3 text-3xl font-extrabold text-slate-900">
          Verify your email
        </h1>

        <p className="mt-3 text-slate-600">
          Enter the six-digit code sent to{" "}
          <strong>{email || "your email"}</strong>. It expires in 10 minutes.
        </p>

        <form onSubmit={submit} className="mt-8 space-y-5">
          <label
            className="block text-sm font-bold text-slate-700"
            htmlFor="verification-code"
          >
            Verification code

            <input
              id="verification-code"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              pattern="[0-9]{6}"
              required
              value={code}
              onChange={(event) =>
                setCode(event.target.value.replace(/\D/g, ""))
              }
              className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-4 text-center text-2xl font-bold tracking-[0.5em]"
            />
          </label>

          {message && (
            <p role="alert" className="text-sm text-red-600">
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-blue-600 py-3 font-bold text-white disabled:opacity-50"
          >
            {loading ? "Please wait…" : "Verify email"}
          </button>
        </form>

        <div className="mt-6 flex justify-between text-sm">
          <button
            type="button"
            onClick={resend}
            disabled={loading}
            className="font-bold text-blue-600 disabled:opacity-50"
          >
            Resend code
          </button>

          <Link
            className="font-bold text-slate-600"
            href="/register"
          >
            Change email
          </Link>
        </div>
      </section>
    </main>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
          <div className="text-slate-600 font-medium">
            Loading verification…
          </div>
        </main>
      }
    >
      <VerifyEmailForm />
    </Suspense>
  );
}
