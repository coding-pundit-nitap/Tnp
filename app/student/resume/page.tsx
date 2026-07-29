import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import Link from "next/link";
import { logoutAction } from "@/actions/logout";
import { getStudentResume } from "@/actions/resume";
import ResumeUploadClient from "./ResumeUploadClient";

export default async function StudentResumeUpload() {
  const session = await getSession();

  if (!session || session.role !== "STUDENT") {
    redirect("/login");
  }

  const result = await getStudentResume();

  if (!result.success) {
    redirect("/login");
  }

  const resume = result.data;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-indigo-600">T&P Portal</h1>
            <p className="text-sm text-gray-600">Student Dashboard</p>
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
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">My Resume</h2>
            <p className="text-gray-600 mt-2">
              Upload and manage your resume for job applications
            </p>
          </div>
          <Link
            href="/student"
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            ← Back
          </Link>
        </div>

        <ResumeUploadClient existingResume={resume} />
      </main>
    </div>
  );
}
