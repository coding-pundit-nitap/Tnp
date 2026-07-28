import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getStudentApplications } from "@/actions/application";
import Link from "next/link";
import StatusBadge from "@/components/StatusBadge";
import { logoutAction } from "@/actions/logout";

export default async function StudentApplicationsPage() {
  const session = await getSession();

  if (!session || session.role !== "STUDENT") {
    redirect("/login");
  }

  const result = await getStudentApplications();

  if (!result.success) {
    redirect("/student");
  }

  const applications = result.data || [];

  const stats = {
    total: applications.length,
    applied: applications.filter((a) => a.status === "APPLIED").length,
    shortlisted: applications.filter((a) => a.status === "SHORTLISTED").length,
    rejected: applications.filter((a) => a.status === "REJECTED").length,
    selected: applications.filter((a) => a.status === "SELECTED").length,
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
              href="/student/jobs"
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              🔍 Browse Jobs
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
          <Link
            href="/student"
            className="text-indigo-600 hover:text-indigo-800 font-semibold mb-4 inline-block"
          >
            ← Back to Dashboard
          </Link>
          <h2 className="text-3xl font-bold text-gray-900">My Applications</h2>
          <p className="text-gray-600 mt-2">
            Track your job applications and their status
          </p>
        </div>

        {/* Stats */}
        {applications.length > 0 && (
          <div className="grid grid-cols-5 gap-4 mb-8">
            <div className="bg-white rounded-lg shadow p-4 text-center">
              <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
              <p className="text-sm text-gray-600">Total</p>
            </div>
            <div className="bg-blue-50 rounded-lg shadow p-4 text-center">
              <p className="text-3xl font-bold text-blue-900">
                {stats.applied}
              </p>
              <p className="text-sm text-blue-600">Applied</p>
            </div>
            <div className="bg-purple-50 rounded-lg shadow p-4 text-center">
              <p className="text-3xl font-bold text-purple-900">
                {stats.shortlisted}
              </p>
              <p className="text-sm text-purple-600">Shortlisted</p>
            </div>
            <div className="bg-red-50 rounded-lg shadow p-4 text-center">
              <p className="text-3xl font-bold text-red-900">
                {stats.rejected}
              </p>
              <p className="text-sm text-red-600">Rejected</p>
            </div>
            <div className="bg-green-50 rounded-lg shadow p-4 text-center">
              <p className="text-3xl font-bold text-green-900">
                {stats.selected}
              </p>
              <p className="text-sm text-green-600">Selected</p>
            </div>
          </div>
        )}

        {/* Applications List */}
        {applications.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              No applications yet
            </h3>
            <p className="text-gray-600 mb-6">
              Start applying to jobs to track your progress
            </p>
            <Link
              href="/student/jobs"
              className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Browse Jobs
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Job Title
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Company
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      CTC
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Applied
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map((app) => (
                    <tr
                      key={app.id}
                      className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        <Link
                          href={`/student/jobs/${app.job.id}`}
                          className="text-indigo-600 hover:text-indigo-800 font-semibold"
                        >
                          {app.job.title}
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {app.job.company}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {app.job.location}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        ₹{app.job.ctc.toLocaleString()} LPA
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {new Date(app.appliedAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={app.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
