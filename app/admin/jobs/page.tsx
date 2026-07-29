import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { getAdminJobs, adminDeleteJob } from "@/actions/job";
import Link from "next/link";
import DeleteJobButton from "./DeleteJobButton";
import { logoutAction } from "@/actions/logout";

export default async function AdminJobsPage() {
  const session = await getSession();

  if (!session || session.role !== "ADMIN") {
    redirect("/login");
  }

  const result = await getAdminJobs();

  if (!result.success) {
    redirect("/login");
  }

  const jobs = result.data || [];

  const stats = {
    total: jobs.length,
    totalApplications: jobs.reduce(
      (sum, job) => sum + job._count.applications,
      0,
    ),
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-indigo-600">T&P Portal</h1>
            <p className="text-sm text-gray-600">Admin Dashboard</p>
          </div>
          <form action={logoutAction}>
            <button
              type="submit"
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Logout
            </button>
          </form>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Job Management</h2>
          <p className="text-gray-600 mt-2">
            Monitor all job postings and placements
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600 mb-2">Total Jobs</p>
            <p className="text-4xl font-bold text-gray-900">{stats.total}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600 mb-2">Total Applications</p>
            <p className="text-4xl font-bold text-gray-900">
              {stats.totalApplications}
            </p>
          </div>
        </div>

        {/* Jobs Table */}
        {jobs.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              No jobs posted yet
            </h3>
            <p className="text-gray-600">No job postings in the system</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Title
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
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Applications
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.map((job) => (
                    <tr
                      key={job.id}
                      className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {job.title}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {job.company}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {job.location}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        ₹{job.ctc.toLocaleString()} LPA
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {job.recruiter.contactName}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                          {job._count.applications}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <DeleteJobButton jobId={job.id} />
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
