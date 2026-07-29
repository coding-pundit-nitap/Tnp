import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { logoutAction } from "@/actions/logout";

export default async function StudentInterviewsPage() {
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

  // Get all interview results for this student
  const results = await prisma.interviewResult.findMany({
    where: {
      application: {
        studentId: student.id,
      },
    },
    include: {
      round: {
        include: {
          job: true,
        },
      },
      application: true,
    },
    orderBy: {
      round: {
        date: "desc",
      },
    },
  });

  const stats = {
    total: results.length,
    pass: results.filter((r) => r.status === "PASS").length,
    fail: results.filter((r) => r.status === "FAIL").length,
    pending: results.filter((r) => r.status === "PENDING").length,
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
          <h2 className="text-3xl font-bold text-gray-900">
            Interview Schedule & Results
          </h2>
          <p className="text-gray-600 mt-2">
            Track your interview rounds and results
          </p>
        </div>

        {/* Statistics Cards */}
        {results.length > 0 && (
          <div className="grid grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-lg shadow p-4 text-center">
              <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
              <p className="text-sm text-gray-600">Total</p>
            </div>
            <div className="bg-green-50 rounded-lg shadow p-4 text-center">
              <p className="text-3xl font-bold text-green-900">{stats.pass}</p>
              <p className="text-sm text-green-600">Passed</p>
            </div>
            <div className="bg-red-50 rounded-lg shadow p-4 text-center">
              <p className="text-3xl font-bold text-red-900">{stats.fail}</p>
              <p className="text-sm text-red-600">Failed</p>
            </div>
            <div className="bg-yellow-50 rounded-lg shadow p-4 text-center">
              <p className="text-3xl font-bold text-yellow-900">
                {stats.pending}
              </p>
              <p className="text-sm text-yellow-600">Pending</p>
            </div>
          </div>
        )}

        {/* Results Timeline */}
        {results.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="text-6xl mb-4">📅</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              No interview rounds scheduled
            </h3>
            <p className="text-gray-600 mb-6">
              You will see interview rounds here once you're shortlisted
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
            {results.map((result) => (
              <div
                key={result.id}
                className="bg-white rounded-lg shadow-md p-6 border-l-4 border-l-blue-600 hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {result.round.name} - {result.round.job.title}
                    </h3>
                    <p className="text-gray-600 mt-1">
                      {result.round.job.company} • {result.round.location}
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      📅{" "}
                      {new Date(result.round.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                    {result.remarks && (
                      <p className="text-sm text-gray-600 mt-3 bg-gray-50 p-2 rounded">
                        📝 {result.remarks}
                      </p>
                    )}
                  </div>
                  <span
                    className={`inline-flex items-center px-4 py-2 rounded-full font-semibold text-sm ${
                      result.status === "PASS"
                        ? "bg-green-100 text-green-800"
                        : result.status === "FAIL"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {result.status === "PASS" && "✓ Passed"}
                    {result.status === "FAIL" && "✗ Failed"}
                    {result.status === "PENDING" && "⏳ Pending"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
