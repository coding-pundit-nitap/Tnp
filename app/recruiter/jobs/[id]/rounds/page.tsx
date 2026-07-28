import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getJobRounds } from "@/actions/interview";
import { getJobDetail } from "@/actions/job";
import Link from "next/link";
import { logoutAction } from "@/actions/logout";
import DeleteInterviewRound from "./DeleteInterviewRound";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function JobRoundsPage({ params }: PageProps) {
  const { id } = await params;
  const session = await getSession();

  if (!session || session.role !== "RECRUITER") {
    redirect("/login");
  }

  const jobResult = await getJobDetail(id);
  if (!jobResult.success || !jobResult.data) {
    redirect("/recruiter/jobs");
  }

  const job = jobResult.data;

  const roundsResult = await getJobRounds(id);
  if (!roundsResult.success) {
    redirect("/recruiter/jobs");
  }

  const rounds = roundsResult.data || [];

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
            href="/recruiter/jobs"
            className="text-indigo-600 hover:text-indigo-800 font-semibold mb-4 inline-block"
          >
            ← Back to Jobs
          </Link>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Interview Rounds - {job.title}
          </h2>
          <p className="text-gray-600">
            {job.company} • {job.location}
          </p>
        </div>

        {/* Create Button */}
        <div className="mb-8">
          <Link
            href={`/recruiter/jobs/${id}/rounds/new`}
            className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
          >
            + Schedule New Round
          </Link>
        </div>

        {/* Rounds List */}
        {rounds.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="text-6xl mb-4">📅</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              No interview rounds scheduled
            </h3>
            <p className="text-gray-600 mb-6">
              Schedule interview rounds for shortlisted candidates
            </p>
            <Link
              href={`/recruiter/jobs/${id}/rounds/new`}
              className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Schedule First Round
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {rounds.map((round, index) => (
              <div
                key={round.id}
                className="bg-white rounded-lg shadow-md p-6 border-l-4 border-l-purple-600 hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-purple-100 text-purple-800 font-semibold text-sm">
                        {round.roundNumber}
                      </span>
                      <h3 className="text-xl font-semibold text-gray-900">
                        {round.name}
                      </h3>
                    </div>
                    <p className="text-gray-700 ml-11">📍 {round.location}</p>
                    <p className="text-gray-600 ml-11">
                      📅{" "}
                      {new Date(round.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                    {round.notes && (
                      <p className="text-sm text-gray-600 ml-11 mt-2">
                        📝 {round.notes}
                      </p>
                    )}
                  </div>
                  <span className="bg-purple-100 text-purple-800 px-4 py-2 rounded-full font-medium">
                    {round._count.results} Results
                  </span>
                </div>

                <div className="flex gap-3 mt-4">
                  <Link
                    href={`/recruiter/rounds/${round.id}/results`}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    👥 View Results
                  </Link>
                  <DeleteInterviewRound roundId={round.id} />
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
