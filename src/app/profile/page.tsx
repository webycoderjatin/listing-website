import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  if (session.user.role === "ADMIN") redirect("/admin");
  if (session.user.role === "BUSINESS_OWNER") redirect("/dashboard");

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <section className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
          <h1 className="text-2xl font-bold text-gray-900">Your profile</h1>
          <p className="mt-2 text-gray-600">Manage your account details and saved activity here.</p>
          <dl className="mt-8 divide-y divide-gray-100">
            <div className="py-4">
              <dt className="text-sm font-medium text-gray-500">Name</dt>
              <dd className="mt-1 text-gray-900">{session.user.name || "Not provided"}</dd>
            </div>
            <div className="py-4">
              <dt className="text-sm font-medium text-gray-500">Email</dt>
              <dd className="mt-1 text-gray-900">{session.user.email}</dd>
            </div>
          </dl>
        </section>
      </div>
    </div>
  );
}
