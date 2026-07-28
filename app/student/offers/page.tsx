import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { logoutAction } from "@/actions/logout";
import ManageOfferButton from "./ManageOfferButton";

export default async function StudentOffersPage() {
  const session = await getSession();

  if (!session || session.role !== "STUDENT") {
    redirect("/login");
  }

  const student = await prisma.student.findUnique({
    where: { userId: session.id },
  });

  if (!student) {
    redirect("/student");
  }

  // Get all offers for this student
  const offers = await prisma.offer.findMany({
    where: {
      application: {
        studentId: student.id,
      },
    },
    include: {
      application: {
        include: {
          job: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const stats = {
    total: offers.length,
    pending: offers.filter((o) => o.accepted === null).length,
    accepted: offers.filter((o) => o.accepted === true).length,
    declined: offers.filter((o) => o.accepted === false).length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-indigo-600">T&P Portal</h1>
            <p className="text-sm text-gray-600">Student Dashboard</p>
          </div>
          <div className="flex gap-4 items-center">
            <Link
              href="/student/profile"
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              👤 Profile
            </Link>
            <Link
              href="/student"
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Dashboard
            </Link>
            <form action={logoutAction}>
              <button
                type="submit"
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            </form>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">My Offers</h2>
          <p className="text-gray-600 mt-2">
            View and manage your placement offers
          </p>
        </div>

        {/* Statistics Cards */}
        {offers.length > 0 && (
          <div className="grid grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-lg shadow p-4 text-center">
              <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
              <p className="text-sm text-gray-600">Total</p>
            </div>
            <div className="bg-blue-50 rounded-lg shadow p-4 text-center">
              <p className="text-3xl font-bold text-blue-900">
                {stats.pending}
              </p>
              <p className="text-sm text-blue-600">Pending</p>
            </div>
            <div className="bg-green-50 rounded-lg shadow p-4 text-center">
              <p className="text-3xl font-bold text-green-900">
                {stats.accepted}
              </p>
              <p className="text-sm text-green-600">Accepted</p>
            </div>
            <div className="bg-red-50 rounded-lg shadow p-4 text-center">
              <p className="text-3xl font-bold text-red-900">
                {stats.declined}
              </p>
              <p className="text-sm text-red-600">Declined</p>
            </div>
          </div>
        )}

        {/* Offers List */}
        {offers.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="text-6xl mb-4">📄</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              No offers yet
            </h3>
            <p className="text-gray-600 mb-6">
              You will see offers here once a company selects you
            </p>
            <Link
              href="/student/jobs"
              className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Browse Jobs
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {offers.map((offer) => (
              <div
                key={offer.id}
                className={`rounded-lg shadow-md p-6 border-l-4 ${
                  offer.accepted === true
                    ? "bg-green-50 border-l-green-600"
                    : offer.accepted === false
                      ? "bg-red-50 border-l-red-600"
                      : "bg-white border-l-blue-600"
                } hover:shadow-lg transition-shadow`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {offer.application.job.title}
                    </h3>
                    <p className="text-gray-600 mt-1">
                      {offer.application.job.company} •{" "}
                      {offer.application.job.location}
                    </p>
                    <div className="mt-4 p-4 bg-white rounded border border-gray-200">
                      <p className="text-sm text-gray-600">CTC</p>
                      <p className="text-2xl font-bold text-gray-900">
                        ₹{offer.ctcFinal.toLocaleString()} LPA
                      </p>
                    </div>
                    {offer.offerLetterUrl && (
                      <p className="text-sm text-gray-600 mt-3">
                        📄 Offer letter available
                      </p>
                    )}
                    <p className="text-sm text-gray-500 mt-4">
                      Generated on{" "}
                      {new Date(offer.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <span
                      className={`inline-flex items-center px-4 py-2 rounded-full font-semibold text-sm ${
                        offer.accepted === true
                          ? "bg-green-100 text-green-800"
                          : offer.accepted === false
                            ? "bg-red-100 text-red-800"
                            : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {offer.accepted === true && "✓ Accepted"}
                      {offer.accepted === false && "✗ Declined"}
                      {offer.accepted === null && "⏳ Pending"}
                    </span>
                    {offer.accepted === null && (
                      <ManageOfferButton applicationId={offer.applicationId} />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
