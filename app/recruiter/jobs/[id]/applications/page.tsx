import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { getJobApplications, getJobDetail } from "@/actions/job";
import Link from "next/link";
import StatusBadge from "@/components/StatusBadge";
import UpdateApplicationStatus from "./UpdateApplicationStatus";
import { logoutAction } from "@/actions/logout";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function JobApplicationsPage({ params }: PageProps) {
  const { id } = await params;
  const session = await getSession();

  if (!session || session.role !== "RECRUITER") {
    redirect("/login");
  }

  const jobResult = await getJobDetail(id);
  const appResult = await getJobApplications(id);

  if (!jobResult.success || !appResult.success || !jobResult.data) {
    redirect("/recruiter/jobs");
  }

  const job = jobResult.data;
  const applications = (appResult.data as any[]) || [];

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
            <p className="text-sm text-gray-600">Recruiter Dashboard</p>
          </div>
          <div className="flex gap-3 items-center">
            <Link
              href="/recruiter/jobs"
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Jobs
            </Link>
            <Link
              href="/recruiter"
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
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
        {/* Back Button and Title */}
        <div className="mb-8">
          <Link
            href="/recruiter/jobs"
            className="text-indigo-600 hover:text-indigo-800 font-semibold mb-4 inline-block"
          >
            ← Back to Jobs
          </Link>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Applicants for {job.title}
          </h2>
          <p className="text-gray-600">
            {job.company} • {job.location} • ₹{job.ctc.toLocaleString()} LPA
          </p>
        </div>

        {/* Statistics Cards */}
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

        {/* Applicants Table */}
        {applications.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-600">No applications yet</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Branch
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Year
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      CGPA
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Applied
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map((app) => (
                    <tr
                      key={app.id}
                      className="border-b border-gray-200 hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {app.student.user.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {app.student.user.email}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {app.student.branch}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        Year {app.student.year}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {app.student.cgpa.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {new Date(app.appliedAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={app.status} />
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <UpdateApplicationStatus
                          applicationId={app.id}
                          currentStatus={app.status}
                        />
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
