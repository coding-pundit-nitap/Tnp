import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { logoutAction } from "@/actions/logout";
import GenerateOfferButton from "./GenerateOfferButton";

export default async function RecruiterOffersPage() {
  const session = await getSession();

  if (!session || session.role !== "RECRUITER") {
    redirect("/login");
  }

  const recruiter = await prisma.recruiter.findUnique({
    where: { userId: session.id },
  });

  if (!recruiter) {
    redirect("/recruiter");
  }

  // Get all SELECTED applications for recruiter's jobs without offers
  const selectedApplications = await prisma.application.findMany({
    where: {
      status: "SELECTED",
      job: {
        recruiterId: recruiter.id,
      },
      offer: null,
    },
    include: {
      student: {
        select: {
          branch: true,
          year: true,
          cgpa: true,
          user: {
            select: { name: true, email: true },
          },
        },
      },
      job: true,
    },
    orderBy: { appliedAt: "desc" },
  });

  // Get all offers offered by this recruiter
  const offeredApplications = await prisma.application.findMany({
    where: {
      status: "SELECTED",
      job: {
        recruiterId: recruiter.id,
      },
      offer: {
        isNot: null,
      },
    },
    include: {
      student: {
        select: {
          branch: true,
          year: true,
          cgpa: true,
          user: {
            select: { name: true, email: true },
          },
        },
      },
      job: true,
      offer: true,
    },
    orderBy: { appliedAt: "desc" },
  });

  const stats = {
    selected: selectedApplications.length + offeredApplications.length,
    pending: selectedApplications.length,
    offered: offeredApplications.length,
    accepted: offeredApplications.filter((a) => a.offer?.accepted === true)
      .length,
    declined: offeredApplications.filter((a) => a.offer?.accepted === false)
      .length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-indigo-600">T&P Portal</h1>
            <p className="text-sm text-gray-600">Recruiter Dashboard</p>
          </div>
          <div className="flex gap-4 items-center">
            <Link
              href="/recruiter/jobs"
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Manage Jobs
            </Link>
            <Link
              href="/recruiter"
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
          <h2 className="text-3xl font-bold text-gray-900">Offer Management</h2>
          <p className="text-gray-600 mt-2">
            Generate and track offers for selected candidates
          </p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <p className="text-3xl font-bold text-gray-900">{stats.selected}</p>
            <p className="text-sm text-gray-600">Selected</p>
          </div>
          <div className="bg-yellow-50 rounded-lg shadow p-4 text-center">
            <p className="text-3xl font-bold text-yellow-900">
              {stats.pending}
            </p>
            <p className="text-sm text-yellow-600">To Offer</p>
          </div>
          <div className="bg-blue-50 rounded-lg shadow p-4 text-center">
            <p className="text-3xl font-bold text-blue-900">{stats.offered}</p>
            <p className="text-sm text-blue-600">Offered</p>
          </div>
          <div className="bg-green-50 rounded-lg shadow p-4 text-center">
            <p className="text-3xl font-bold text-green-900">
              {stats.accepted}
            </p>
            <p className="text-sm text-green-600">Accepted</p>
          </div>
          <div className="bg-red-50 rounded-lg shadow p-4 text-center">
            <p className="text-3xl font-bold text-red-900">{stats.declined}</p>
            <p className="text-sm text-red-600">Declined</p>
          </div>
        </div>

        {/* Pending Offers Section */}
        {selectedApplications.length > 0 && (
          <div className="mb-8">
            <div className="bg-yellow-50 rounded-lg shadow p-6 border-l-4 border-l-yellow-600">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Pending Offers ({selectedApplications.length})
              </h3>
              <div className="space-y-3">
                {selectedApplications.map((app) => (
                  <div
                    key={app.id}
                    className="bg-white rounded p-4 border border-gray-200 flex justify-between items-center"
                  >
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        {app.student.user.name}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {app.student.branch} • {app.student.year}Y • CGPA:{" "}
                        {app.student.cgpa.toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        Applied for: {app.job.title}
                      </p>
                    </div>
                    <GenerateOfferButton applicationId={app.id} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Offered Candidates Section */}
        {offeredApplications.length > 0 && (
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Offers Extended ({offeredApplications.length})
            </h3>
            <div className="space-y-3">
              {offeredApplications.map((app) => (
                <div
                  key={app.id}
                  className={`rounded-lg p-4 border-l-4 ${
                    app.offer?.accepted === true
                      ? "bg-green-50 border-l-green-600"
                      : app.offer?.accepted === false
                        ? "bg-red-50 border-l-red-600"
                        : "bg-blue-50 border-l-blue-600"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        {app.student.user.name}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {app.student.branch} • {app.student.year}Y • CGPA:{" "}
                        {app.student.cgpa.toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        Position: {app.job.title}
                      </p>
                      {app.offer && (
                        <p className="text-sm text-gray-600 mt-2">
                          CTC: ₹{app.offer.ctcFinal.toLocaleString()} LPA
                        </p>
                      )}
                    </div>
                    {app.offer && (
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full font-semibold text-sm ${
                          app.offer.accepted === true
                            ? "bg-green-100 text-green-800"
                            : app.offer.accepted === false
                              ? "bg-red-100 text-red-800"
                              : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {app.offer.accepted === true && "✓ Accepted"}
                        {app.offer.accepted === false && "✗ Declined"}
                        {app.offer.accepted === null && "⏳ Pending"}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedApplications.length === 0 &&
          offeredApplications.length === 0 && (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <div className="text-6xl mb-4">💼</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                No selected candidates
              </h3>
              <p className="text-gray-600">
                You will see candidates to generate offers for once they are
                selected
              </p>
            </div>
          )}
      </main>
    </div>
  );
}
