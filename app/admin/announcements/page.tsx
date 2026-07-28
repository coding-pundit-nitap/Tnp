import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getAnnouncements } from "@/actions/announcement";
import Link from "next/link";
import { logoutAction } from "@/actions/logout";
import CreateAnnouncementButton from "./CreateAnnouncementButton";
import DeleteAnnouncementButton from "./DeleteAnnouncementButton";

export default async function AdminAnnouncementsPage() {
  const session = await getSession();

  if (!session || session.role !== "ADMIN") {
    redirect("/login");
  }

  const result = await getAnnouncements();

  if (!result.success) {
    redirect("/login");
  }

  const announcements = result.data || [];

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
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Announcements</h2>
            <p className="text-gray-600 mt-2">
              Manage announcements for students and recruiters
            </p>
          </div>
          <CreateAnnouncementButton />
        </div>

        {announcements.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="text-6xl mb-4">📢</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              No announcements yet
            </h3>
            <p className="text-gray-600 mb-6">
              Create your first announcement to notify students and recruiters
            </p>
            <CreateAnnouncementButton />
          </div>
        ) : (
          <div className="space-y-4">
            {announcements.map((announcement) => (
              <div
                key={announcement.id}
                className="bg-white rounded-lg shadow-md p-6 border-l-4 border-l-blue-600 hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900">
                      {announcement.title}
                    </h3>
                    <p className="text-gray-700 mt-2">{announcement.message}</p>
                    <p className="text-sm text-gray-500 mt-4">
                      Created on{" "}
                      {new Date(announcement.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Link
                      href={`/admin/announcements/${announcement.id}/edit`}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      ✏️ Edit
                    </Link>
                    <DeleteAnnouncementButton
                      announcementId={announcement.id}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
