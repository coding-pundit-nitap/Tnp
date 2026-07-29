import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { getRoundResults } from "@/actions/result";
import Link from "next/link";
import { logoutAction } from "@/actions/logout";
import UpdateRoundResult from "./UpdateRoundResult";

interface PageProps {
  params: Promise<{ roundId: string }>;
}

export default async function RoundResultsPage({ params }: PageProps) {
  const { roundId } = await params;
  const session = await getSession();

  if (!session || session.role !== "RECRUITER") {
    redirect("/login");
  }

  const result = await getRoundResults(roundId);

  if (!result.success || !result.data) {
    redirect("/recruiter/jobs");
  }

  const round = result.data;
  const job = round.job;

  // Get all shortlisted applications for this job
  const shortlistedApps = round.results || [];

  const stats = {
    total: shortlistedApps.length,
    pass: shortlistedApps.filter((r) => r.status === "PASS").length,
    fail: shortlistedApps.filter((r) => r.status === "FAIL").length,
    pending: shortlistedApps.filter((r) => r.status === "PENDING").length,
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
        {/* Back Button and Title */}
        <div className="mb-8">
          <Link
            href={`/recruiter/jobs/${round.jobId}/rounds`}
            className="text-indigo-600 hover:text-indigo-800 font-semibold mb-4 inline-block"
          >
            ← Back to Rounds
          </Link>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {round.name} - {job.title}
          </h2>
          <p className="text-gray-600">
            {new Date(round.date).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}{" "}
            • {round.location}
          </p>
        </div>

        {/* Statistics Cards */}
        {shortlistedApps.length > 0 && (
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

        {/* Results Table */}
        {shortlistedApps.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-600 mb-4">
              No shortlisted applicants for this round yet
            </p>
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
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {shortlistedApps.map((result) => (
                    <tr
                      key={result.id}
                      className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {result.application.student.user.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {result.application.student.user.email}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {result.application.student.branch}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        Year {result.application.student.year}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {result.application.student.cgpa.toFixed(2)}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                            result.status === "PASS"
                              ? "bg-green-100 text-green-800"
                              : result.status === "FAIL"
                                ? "bg-red-100 text-red-800"
                                : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {result.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <UpdateRoundResult
                          resultId={result.id}
                          applicationId={result.applicationId}
                          roundId={roundId}
                          currentStatus={result.status}
                          currentRemarks={result.remarks}
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
