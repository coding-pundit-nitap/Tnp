import { getSession } from "@/lib/auth";
import { logoutAction } from "@/actions/logout";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { getAnnouncements } from "@/actions/announcement";

export default async function AdminPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  if (session.role !== "ADMIN") {
    redirect("/unauthorized");
  }

  // Fetch stats
  const totalUsers = await prisma.user.count();
  const totalStudents = await prisma.student.count();
  const totalRecruiters = await prisma.recruiter.count();
  const pendingRecruiters = await prisma.recruiter.count({
    where: { approved: false },
  });
  const totalJobs = await prisma.job.count();
  const totalApplications = await prisma.application.count();
  const placedStudents = await prisma.application.count({
    where: { status: "SELECTED" },
  });

  // Fetch announcements
  const announcementsResult = await getAnnouncements();
  const announcements = announcementsResult.success
    ? announcementsResult.data?.slice(0, 3) || []
    : [];

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
        <h2 className="text-3xl font-bold text-gray-900 mb-8">
          Welcome, Administrator!
        </h2>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Link
            href="/admin/announcements"
            className="bg-indigo-600 hover:bg-indigo-700 text-white p-6 rounded-lg shadow-md transition-colors"
          >
            <div className="text-2xl mb-2">📢</div>
            <h3 className="font-semibold">Announcements</h3>
            <p className="text-sm text-indigo-100">Create & manage</p>
          </Link>
          <Link
            href="/admin/jobs"
            className="bg-blue-600 hover:bg-blue-700 text-white p-6 rounded-lg shadow-md transition-colors"
          >
            <div className="text-2xl mb-2">📋</div>
            <h3 className="font-semibold">Jobs</h3>
            <p className="text-sm text-blue-100">{totalJobs} posted</p>
          </Link>
          <Link
            href="/admin/recruiters"
            className="bg-purple-600 hover:bg-purple-700 text-white p-6 rounded-lg shadow-md transition-colors"
          >
            <div className="text-2xl mb-2">👥</div>
            <h3 className="font-semibold">Recruiters</h3>
            <p className="text-sm text-purple-100">
              {pendingRecruiters} pending
            </p>
          </Link>
          <Link
            href="/admin/analytics"
            className="bg-green-600 hover:bg-green-700 text-white p-6 rounded-lg shadow-md transition-colors"
          >
            <div className="text-2xl mb-2">📊</div>
            <h3 className="font-semibold">Analytics</h3>
            <p className="text-sm text-green-100">View insights</p>
          </Link>
        </div>

        {/* Additional Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Link
            href="/admin/audit-logs"
            className="bg-white hover:bg-gray-50 border-2 border-gray-300 p-4 rounded-lg shadow transition-colors"
          >
            <div className="text-2xl mb-2">📝</div>
            <h3 className="font-semibold text-gray-900">Audit Logs</h3>
            <p className="text-sm text-gray-600">Track system activities</p>
          </Link>
          <Link
            href="/admin/export"
            className="bg-white hover:bg-gray-50 border-2 border-gray-300 p-4 rounded-lg shadow transition-colors"
          >
            <div className="text-2xl mb-2">📥</div>
            <h3 className="font-semibold text-gray-900">Export Data</h3>
            <p className="text-sm text-gray-600">Download reports</p>
          </Link>
          <Link
            href="/admin/settings"
            className="bg-white hover:bg-gray-50 border-2 border-gray-300 p-4 rounded-lg shadow transition-colors"
          >
            <div className="text-2xl mb-2">⚙️</div>
            <h3 className="font-semibold text-gray-900">Settings</h3>
            <p className="text-sm text-gray-600">Configure system</p>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <p className="text-2xl font-bold text-blue-600">{totalUsers}</p>
            <p className="text-sm text-gray-600">Total Users</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <p className="text-2xl font-bold text-green-600">{totalStudents}</p>
            <p className="text-sm text-gray-600">Students</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <p className="text-2xl font-bold text-purple-600">
              {totalRecruiters}
            </p>
            <p className="text-sm text-gray-600">Recruiters</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <p className="text-2xl font-bold text-orange-600">
              {placedStudents}
            </p>
            <p className="text-sm text-gray-600">Placed</p>
          </div>
        </div>

        {/* Placement Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Jobs</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Posted</span>
                <span className="font-bold text-indigo-600">{totalJobs}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Applications</span>
                <span className="font-bold text-blue-600">
                  {totalApplications}
                </span>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Students
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Registered</span>
                <span className="font-bold text-green-600">
                  {totalStudents}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Placed</span>
                <span className="font-bold text-emerald-600">
                  {placedStudents}
                </span>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Recruiters
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Total</span>
                <span className="font-bold text-purple-600">
                  {totalRecruiters}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Pending</span>
                <span className="font-bold text-orange-600">
                  {pendingRecruiters}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Announcements Widget */}
        {announcements.length > 0 && (
          <div className="mb-8">
            <div className="bg-white rounded-lg shadow p-6 border-l-4 border-l-indigo-600">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Recent Announcements 📢
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
      </main>
    </div>
  );
}
