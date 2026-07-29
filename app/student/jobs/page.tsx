import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { getEligibleJobs } from "@/actions/application";
import Link from "next/link";
import { logoutAction } from "@/actions/logout";
import JobsList from "./JobsList";

export default async function StudentJobsPage() {
  const session = await getSession();

  if (!session || session.role !== "STUDENT") {
    redirect("/login");
  }

  const result = await getEligibleJobs();

  if (!result.success) {
    redirect("/student");
  }

  const jobs = result.data || [];
  const eligibleCount = jobs.filter((j) => j.isEligible).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-indigo-600">T&P Portal</h1>
            <p className="text-sm text-gray-600">Student Dashboard</p>
          </div>
          <div className="flex gap-3 items-center">
            <Link
              href="/student/profile"
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              👤 Profile
            </Link>
            <Link
              href="/student/applications"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              📋 My Applications
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
          <h2 className="text-3xl font-bold text-gray-900">Available Jobs</h2>
          <p className="text-gray-600 mt-2">
            {eligibleCount} of {jobs.length} jobs match your eligibility
            criteria
          </p>
        </div>

        {jobs.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              No jobs available yet
            </h3>
            <p className="text-gray-600">
              Check back soon for new job postings
            </p>
          </div>
        ) : (
          <JobsList jobs={jobs} eligibleCount={eligibleCount} />
        )}
      </main>
    </div>
  );
}
