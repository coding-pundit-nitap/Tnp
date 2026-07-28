import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { logoutAction } from "@/actions/logout";
import ExportButton from "@/components/ExportButton";
import {
  exportStudentsCSV,
  exportRecruitersCSV,
  exportJobsCSV,
  exportApplicationsCSV,
  exportPlacementsCSV,
} from "@/actions/export";
import { Download, FileText } from "lucide-react";

export default async function DataExport() {
  const session = await getSession();

  if (!session || session.role !== "ADMIN") {
    redirect("/login");
  }

  const exports = [
    {
      name: "Students List",
      description:
        "Export all student details including CGPA, branch, and placement status",
      action: exportStudentsCSV,
      color: "blue",
      icon: "👥",
    },
    {
      name: "Recruiters List",
      description:
        "Export all recruiter companies, contacts, and approval status",
      action: exportRecruitersCSV,
      color: "green",
      icon: "🏢",
    },
    {
      name: "Jobs Posted",
      description:
        "Export all job postings with CTC, eligibility criteria, and applications",
      action: exportJobsCSV,
      color: "purple",
      icon: "💼",
    },
    {
      name: "Applications",
      description: "Export all job applications with status and match scores",
      action: exportApplicationsCSV,
      color: "yellow",
      icon: "📝",
    },
    {
      name: "Placements Report",
      description:
        "Export final placements with student, company, and CTC details",
      action: exportPlacementsCSV,
      color: "red",
      icon: "🎯",
    },
  ];

  const handleExport = (action: any) => {
    return action;
  };

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
            <h2 className="text-3xl font-bold text-gray-900">Data Exports</h2>
            <p className="text-gray-600 mt-2">
              Download placement portal data in CSV format
            </p>
          </div>
          <Link
            href="/admin"
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            ← Back
          </Link>
        </div>

        {/* Export Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {exports.map((exp, idx) => (
            <div
              key={idx}
              className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="text-3xl">{exp.icon}</div>
                <FileText className="h-5 w-5 text-gray-400" />
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {exp.name}
              </h3>
              <p className="text-sm text-gray-600 mb-6">{exp.description}</p>

              <div className="pt-4 border-t border-gray-200">
                <ExportButton
                  label="Export CSV"
                  onClick={exp.action}
                  format="csv"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Info Box */}
        <div className="rounded-lg bg-indigo-50 border border-indigo-200 p-6">
          <h4 className="font-semibold text-indigo-900 mb-3">
            📊 Export Data Information
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-indigo-800">
            <div>
              <p className="font-medium mb-1">Includes:</p>
              <ul className="space-y-1 text-xs">
                <li>✓ Complete data records</li>
                <li>✓ Timestamps and status</li>
                <li>✓ All relevant details</li>
              </ul>
            </div>
            <div>
              <p className="font-medium mb-1">Format:</p>
              <ul className="space-y-1 text-xs">
                <li>✓ CSV (Comma Separated Values)</li>
                <li>✓ Openable in Excel/Sheets</li>
                <li>✓ Current date in filename</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Data Usage Guidelines */}
        <div className="mt-8 space-y-6">
          <div className="rounded-lg bg-white border border-gray-200 p-6 shadow-sm">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">
              📋 Data Export Guidelines
            </h4>
            <div className="space-y-4 text-sm text-gray-600">
              <div>
                <p className="font-medium text-gray-900 mb-1">
                  Students List Export:
                </p>
                <p>
                  Contains email, branch, year, CGPA, placement status, and
                  resume URL. Use for eligibility verification and reporting.
                </p>
              </div>
              <div>
                <p className="font-medium text-gray-900 mb-1">
                  Recruiters List Export:
                </p>
                <p>
                  Includes company details, contact information, approval
                  status, and job statistics. Use for recruiter management and
                  audit.
                </p>
              </div>
              <div>
                <p className="font-medium text-gray-900 mb-1">
                  Jobs Posted Export:
                </p>
                <p>
                  Contains job details, CTC, minimum CGPA, eligible
                  branches/years, and application counts. Use for recruitment
                  tracking.
                </p>
              </div>
              <div>
                <p className="font-medium text-gray-900 mb-1">
                  Applications Export:
                </p>
                <p>
                  Shows student names, job titles, companies, application
                  status, and match scores. Use for monitoring and analysis.
                </p>
              </div>
              <div>
                <p className="font-medium text-gray-900 mb-1">
                  Placements Report Export:
                </p>
                <p>
                  Final placement data with student details, company, job title,
                  and CTC. Use for official records and reporting.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-yellow-50 border border-yellow-200 p-6">
            <h4 className="font-semibold text-yellow-900 mb-3">
              ⚠️ Data Handling
            </h4>
            <ul className="space-y-2 text-sm text-yellow-800">
              <li>✓ All exports contain current data as of download time</li>
              <li>✓ Data is sensitive and should be handled securely</li>
              <li>✓ Keep backups of important exports</li>
              <li>✓ Follow your institution's data handling policies</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
