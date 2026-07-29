import { getSession } from "@/lib/session";
import { logoutAction } from "@/actions/logout";
import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getAnnouncements } from "@/actions/announcement";
import { getStudentInterviewResults } from "@/actions/result";

export default async function StudentPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  if (session.role !== "STUDENT") {
    redirect("/unauthorized");
  }

  // Fetch student data
  const student = await prisma.student.findUnique({
    where: { userId: session.id },
    include: { user: true },
  });

  if (!student) {
    redirect("/student/profile/setup");
  }

  // Fetch announcements (latest 3)
  const announcementsResult = await getAnnouncements();
  const announcements = announcementsResult.success
    ? announcementsResult.data?.slice(0, 3) || []
    : [];

  // Fetch interview results to show upcoming/pending interviews
  const interviewsResult = await getStudentInterviewResults(student.id);
  const allInterviews = interviewsResult.success
    ? interviewsResult.data || []
    : [];
  const upcomingInterviews = allInterviews
    .filter((i) => i.status === "PENDING")
    .slice(0, 3);

  // Fetch offers
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
  });

  const offerStats = {
    total: offers.length,
    accepted: offers.filter((o) => o.accepted === true).length,
    pending: offers.filter((o) => o.accepted === null).length,
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
          <div className="flex gap-3 items-center">
            <Link
              href="/student/profile"
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              👤 Profile
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
        <h2 className="text-3xl font-bold text-gray-900 mb-8">
          Welcome back, {student.user.name}!
        </h2>

        {/* Top Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Link
            href="/student/jobs"
            className="bg-indigo-600 hover:bg-indigo-700 text-white p-6 rounded-lg shadow-md transition-colors"
          >
            <div className="text-2xl mb-2">📋</div>
            <h3 className="font-semibold">Browse Jobs</h3>
            <p className="text-sm text-indigo-100">
              Browse available positions
            </p>
          </Link>
          <Link
            href="/student/applications"
            className="bg-blue-600 hover:bg-blue-700 text-white p-6 rounded-lg shadow-md transition-colors"
          >
            <div className="text-2xl mb-2">📝</div>
            <h3 className="font-semibold">My Applications</h3>
            <p className="text-sm text-blue-100">Track your progress</p>
          </Link>
          <Link
            href="/student/interviews"
            className="bg-purple-600 hover:bg-purple-700 text-white p-6 rounded-lg shadow-md transition-colors"
          >
            <div className="text-2xl mb-2">📅</div>
            <h3 className="font-semibold">Interviews</h3>
            <p className="text-sm text-purple-100">View your schedule</p>
          </Link>
        </div>

        {/* Offers Widget */}
        {offers.length > 0 && (
          <div className="mb-8">
            <Link href="/student/offers" className="block group">
              <div className="bg-white rounded-lg shadow p-6 group-hover:shadow-lg transition-shadow border-l-4 border-l-green-600">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Offers 💼
                </h3>
                <div className="grid grid-cols-4 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900">
                      {offerStats.total}
                    </p>
                    <p className="text-sm text-gray-600">Total</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">
                      {offerStats.accepted}
                    </p>
                    <p className="text-sm text-gray-600">Accepted</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">
                      {offerStats.pending}
                    </p>
                    <p className="text-sm text-gray-600">Pending</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-red-600">
                      {offerStats.declined}
                    </p>
                    <p className="text-sm text-gray-600">Declined</p>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* Upcoming Interviews Widget */}
        {upcomingInterviews.length > 0 && (
          <div className="mb-8">
            <Link href="/student/interviews" className="block group">
              <div className="bg-white rounded-lg shadow p-6 group-hover:shadow-lg transition-shadow border-l-4 border-l-orange-600">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Upcoming Interviews ({upcomingInterviews.length}) 📅
                </h3>
                <div className="space-y-3">
                  {upcomingInterviews.map((interview) => (
                    <div
                      key={interview.id}
                      className="p-3 bg-orange-50 rounded border border-orange-200"
                    >
                      <p className="font-medium text-gray-900">
                        {interview.round.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        {interview.round.job.title} •{" "}
                        {interview.round.job.company}
                      </p>
                      <p className="text-sm text-orange-700">
                        📌 {new Date(interview.round.date).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* Announcements Widget */}
        {announcements.length > 0 && (
          <div className="mb-8">
            <div className="bg-white rounded-lg shadow p-6 border-l-4 border-l-indigo-600">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Latest Announcements 📢
              </h3>
              <div className="space-y-3">
                {announcements.map((announcement) => (
                  <div
                    key={announcement.id}
                    className="p-4 bg-indigo-50 rounded border border-indigo-200"
                  >
                    <p className="font-medium text-gray-900">
                      {announcement.title}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      {announcement.message}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      {new Date(announcement.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {offers.length === 0 &&
          upcomingInterviews.length === 0 &&
          announcements.length === 0 && (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <p className="text-gray-600 text-lg">
                No active interviews or offers yet. Keep applying to jobs!
              </p>
            </div>
          )}
      </main>
    </div>
  );
}
