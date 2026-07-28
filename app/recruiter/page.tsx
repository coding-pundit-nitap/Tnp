import { getSession } from "@/lib/auth";
import { logoutAction } from "@/actions/logout";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getAnnouncements } from "@/actions/announcement";
import Link from "next/link";

export default async function RecruiterPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  if (session.role !== "RECRUITER") {
    redirect("/unauthorized");
  }

  // Get recruiter info
  const recruiter = await prisma.recruiter.findUnique({
    where: { userId: session.id },
    include: { user: true },
  });

  if (!recruiter) {
    redirect("/recruiter/register");
  }

  // Fetch announcements (latest 3)
  const announcementsResult = await getAnnouncements();
  const announcements = announcementsResult.success
    ? announcementsResult.data?.slice(0, 3) || []
    : [];

  // Fetch recruiter's jobs
  const jobs = await prisma.job.findMany({
    where: { recruiterId: recruiter.id },
    include: { _count: { select: { applications: true } } },
    orderBy: { createdAt: "desc" },
  });

  // Fetch pending offers (SELECTED applications without offers)
  const pendingOffers = await prisma.application.findMany({
    where: {
      status: "SELECTED",
      job: { recruiterId: recruiter.id },
      offer: null,
    },
    include: {
      student: { select: { user: { select: { name: true } } } },
      job: { select: { title: true } },
    },
  });

  // Fetch extended offers
  const extendedOffers = await prisma.application.findMany({
    where: {
      status: "SELECTED",
      job: { recruiterId: recruiter.id },
      offer: { isNot: null },
    },
    include: {
      student: { select: { user: { select: { name: true } } } },
      job: { select: { title: true } },
      offer: true,
    },
  });

  const offerStats = {
    pending: pendingOffers.length,
    extended: extendedOffers.length,
    accepted: extendedOffers.filter((a) => a.offer?.accepted === true).length,
    declined: extendedOffers.filter((a) => a.offer?.accepted === false).length,
  };

  const applicantStats = {
    total: jobs.reduce((sum, job) => sum + job._count.applications, 0),
    jobsPosted: jobs.length,
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
        <h2 className="text-3xl font-bold text-gray-900 mb-8">
          Welcome back, {recruiter.user.name}!
        </h2>

        {/* Top Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Link
            href="/recruiter/jobs"
            className="bg-indigo-600 hover:bg-indigo-700 text-white p-6 rounded-lg shadow-md transition-colors"
          >
            <div className="text-2xl mb-2">📋</div>
            <h3 className="font-semibold">Manage Jobs</h3>
            <p className="text-sm text-indigo-100">{jobs.length} posted</p>
          </Link>
          <Link
            href="/recruiter/offers"
            className="bg-green-600 hover:bg-green-700 text-white p-6 rounded-lg shadow-md transition-colors"
          >
            <div className="text-2xl mb-2">💼</div>
            <h3 className="font-semibold">Offers</h3>
            <p className="text-sm text-green-100">
              {offerStats.pending} to create
            </p>
          </Link>
          <div className="bg-blue-600 p-6 rounded-lg shadow-md">
            <div className="text-2xl mb-2">👥</div>
            <h3 className="font-semibold text-white">Applicants</h3>
            <p className="text-sm text-blue-100">
              {applicantStats.total} total
            </p>
          </div>
          <div className="bg-purple-600 p-6 rounded-lg shadow-md">
            <div className="text-2xl mb-2">📅</div>
            <h3 className="font-semibold text-white">Interviews</h3>
            <p className="text-sm text-purple-100">Schedule rounds</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <p className="text-2xl font-bold text-gray-900">
              {applicantStats.jobsPosted}
            </p>
            <p className="text-sm text-gray-600">Jobs Posted</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <p className="text-2xl font-bold text-yellow-600">
              {offerStats.pending}
            </p>
            <p className="text-sm text-gray-600">Pending Offers</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <p className="text-2xl font-bold text-green-600">
              {offerStats.accepted}
            </p>
            <p className="text-sm text-gray-600">Accepted</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <p className="text-2xl font-bold text-red-600">
              {offerStats.declined}
            </p>
            <p className="text-sm text-gray-600">Declined</p>
          </div>
        </div>

        {/* Pending Offers Widget */}
        {pendingOffers.length > 0 && (
          <div className="mb-8">
            <Link href="/recruiter/offers" className="block group">
              <div className="bg-white rounded-lg shadow p-6 group-hover:shadow-lg transition-shadow border-l-4 border-l-yellow-600">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Candidates Awaiting Offers ({pendingOffers.length}) ⏳
                </h3>
                <div className="space-y-2">
                  {pendingOffers.slice(0, 3).map((app) => (
                    <div
                      key={app.id}
                      className="p-3 bg-yellow-50 rounded border border-yellow-200"
                    >
                      <p className="font-medium text-gray-900">
                        {app.student.user.name}
                      </p>
                      <p className="text-sm text-gray-600">{app.job.title}</p>
                    </div>
                  ))}
                </div>
                {pendingOffers.length > 3 && (
                  <p className="text-sm text-indigo-600 mt-3">
                    +{pendingOffers.length - 3} more pending...
                  </p>
                )}
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
        {jobs.length === 0 && (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-600 text-lg mb-4">
              No jobs posted yet. Start by posting a job opening!
            </p>
            <Link
              href="/recruiter/jobs/new"
              className="inline-block px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Post a Job
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
