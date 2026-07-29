import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { getJobDetail } from "@/actions/job";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import JobApplyButton from "./JobApplyButton";
import EligibilityBadge from "@/components/EligibilityBadge";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function JobDetailPage({ params }: PageProps) {
  const { id } = await params;
  const session = await getSession();

  if (!session || session.role !== "STUDENT") {
    redirect("/login");
  }

  const result = await getJobDetail(id);

  if (!result.success || !result.data) {
    redirect("/student/jobs");
  }

  const job = result.data;

  // Get student profile
  const student = await prisma.student.findUnique({
    where: { userId: session.id },
  });

  if (!student) {
    redirect("/student");
  }

  // Check eligibility
  const isCgpaEligible = student.cgpa >= job.minCgpa;
  const isBranchEligible = job.allowedBranches.includes(student.branch);
  const isYearEligible = job.allowedYears.includes(student.year);
  const isEligible = isCgpaEligible && isBranchEligible && isYearEligible;

  // Check if already applied
  const existingApp = await prisma.application.findUnique({
    where: { jobId_studentId: { jobId: id, studentId: student.id } },
  });

  const hasApplied = !!existingApp;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link
            href="/student/jobs"
            className="text-2xl font-bold text-indigo-600"
          >
            ← Back to Jobs
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              {job.title}
            </h1>
            <p className="text-xl text-gray-600">{job.company}</p>
            <p className="text-gray-600 mt-2">📍 {job.location}</p>
          </div>

          {/* Key Info */}
          <div className="grid grid-cols-3 gap-4 mb-8 pb-8 border-b border-gray-200">
            <div>
              <p className="text-sm text-gray-600">CTC</p>
              <p className="text-2xl font-bold text-gray-900">
                ₹{job.ctc.toLocaleString()} LPA
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Min CGPA</p>
              <p className="text-2xl font-bold text-gray-900">
                {job.minCgpa.toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Posted By</p>
              <p className="text-lg font-semibold text-gray-900">
                {job.recruiter.contactName}
              </p>
            </div>
          </div>

          {/* Eligibility Summary */}
          <div className="mb-8 bg-gray-50 p-6 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-4">
              Your Eligibility
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-700">
                  Your CGPA ({student.cgpa.toFixed(2)})
                </span>
                <span
                  className={isCgpaEligible ? "text-green-600" : "text-red-600"}
                >
                  {isCgpaEligible ? "✓ Eligible" : "✗ Not Eligible"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">
                  Your Branch ({student.branch})
                </span>
                <span
                  className={
                    isBranchEligible ? "text-green-600" : "text-red-600"
                  }
                >
                  {isBranchEligible ? "✓ Eligible" : "✗ Not Eligible"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">
                  Your Year ({student.year})
                </span>
                <span
                  className={isYearEligible ? "text-green-600" : "text-red-600"}
                >
                  {isYearEligible ? "✓ Eligible" : "✗ Not Eligible"}
                </span>
              </div>
            </div>

            {/* Overall Eligibility */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <EligibilityBadge eligible={isEligible} />
            </div>
          </div>

          {/* Job Description */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              About this role
            </h3>
            <div className="text-gray-700 whitespace-pre-wrap">
              {job.description}
            </div>
          </div>

          {/* Criteria */}
          <div className="mb-8 bg-indigo-50 border border-indigo-200 p-6 rounded-lg">
            <h3 className="font-semibold text-indigo-900 mb-4">Job Criteria</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-indigo-800">Allowed Branches:</p>
                <p className="font-medium text-indigo-900">
                  {job.allowedBranches.join(", ")}
                </p>
              </div>
              <div>
                <p className="text-sm text-indigo-800">Allowed Years:</p>
                <p className="font-medium text-indigo-900">
                  {job.allowedYears.map((y) => `Year ${y}`).join(", ")}
                </p>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="bg-gray-50 p-6 rounded-lg mb-8">
            <h3 className="font-semibold text-gray-900 mb-4">
              Contact Information
            </h3>
            <p className="text-gray-700">
              <strong>Contact Name:</strong> {job.recruiter.contactName}
            </p>
            {/* Phone would be here but hidden for privacy in some systems */}
          </div>

          {/* Apply Button */}
          {isEligible && !hasApplied && <JobApplyButton jobId={id} />}

          {hasApplied && (
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
              <p className="text-blue-800">
                ✓ You have already applied to this job
              </p>
            </div>
          )}

          {!isEligible && (
            <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
              <p className="text-red-800">
                ✗ You are not eligible for this job. Please review the
                eligibility criteria above.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
