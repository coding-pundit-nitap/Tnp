import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { getRecruiterJobs } from "@/actions/job";
import Link from "next/link";
import { logoutAction } from "@/actions/logout";
import RecruiterDeleteJobButton from "./RecruiterDeleteJobButton";

export default async function RecruiterJobsPage() {
  const session = await getSession();

  if (!session || session.role !== "RECRUITER") {
    redirect("/login");
  }

  const result = await getRecruiterJobs();

  if (!result.success) {
    redirect("/login");
  }

  const jobs = result.data || [];

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
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">My Jobs</h2>
            <p className="text-gray-600 mt-2">
              Manage and monitor your job postings
            </p>
          </div>
          <Link
            href="/recruiter/jobs/new"
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
          >
            + Post New Job
          </Link>
        </div>

        {jobs.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              No jobs posted yet
            </h3>
            <p className="text-gray-600 mb-6">
              Start posting jobs to attract talented students
            </p>
            <Link
              href="/recruiter/jobs/new"
              className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Post Your First Job
            </Link>
          </div>
        ) : (
          <div className="grid gap-6">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="bg-white rounded-lg shadow-md p-6 border-l-4 border-l-indigo-600 hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900">
                      {job.title}
                    </h3>
                    <p className="text-gray-600 mt-1">{job.location}</p>
                  </div>
                  <span className="bg-indigo-100 text-indigo-800 px-4 py-2 rounded-full font-medium">
                    {job._count.applications} Applications
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-6 text-sm">
                  <div className="bg-gray-50 p-3 rounded">
                    <p className="text-gray-600">CTC</p>
                    <p className="text-lg font-semibold text-gray-900">
                      ₹{job.ctc.toLocaleString()} LPA
                    </p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded">
                    <p className="text-gray-600">Min CGPA</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {job.minCgpa.toFixed(2)}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded">
                    <p className="text-gray-600">Branches</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {job.allowedBranches.join(", ")}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 flex-wrap">
                  <Link
                    href={`/recruiter/jobs/${job.id}/applications`}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    👥 View Applicants
                  </Link>
                  <Link
                    href={`/recruiter/jobs/${job.id}/rounds`}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    📅 Manage Interviews
                  </Link>
                  <Link
                    href={`/recruiter/jobs/${job.id}/edit`}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    ✏️ Edit
                  </Link>
                  <RecruiterDeleteJobButton jobId={job.id} />
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
