import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { logoutAction } from "@/actions/logout";
import MetricCard from "@/components/MetricCard";
import ChartCard from "@/components/ChartCard";
import {
  getPlacementStats,
  getBranchPlacementStats,
  getCompanyStats,
  getRecruiterStats,
  getYearPlacementStats,
} from "@/actions/analytics";
import { BarChart3, TrendingUp, Users, Briefcase, Award } from "lucide-react";

export default async function AnalyticsDashboard() {
  const session = await getSession();

  if (!session || session.role !== "ADMIN") {
    redirect("/login");
  }

  const [stats, branchStats, companyStats, recruiterStats, yearStats] =
    await Promise.all([
      getPlacementStats(),
      getBranchPlacementStats(),
      getCompanyStats(),
      getRecruiterStats(),
      getYearPlacementStats(),
    ]);

  if (
    !stats.success ||
    !branchStats.success ||
    !companyStats.success ||
    !recruiterStats.success ||
    !yearStats.success
  ) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-indigo-600">T&P Portal</h1>
            <p className="text-sm text-gray-600">Admin Analytics</p>
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
            <h2 className="text-3xl font-bold text-gray-900">
              Analytics Dashboard
            </h2>
            <p className="text-gray-600 mt-2">
              Training & Placement Statistics
            </p>
          </div>
          <div className="flex gap-3 items-center">
            <Link
              href="/admin/audit-logs"
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              Audit Logs
            </Link>
            <Link
              href="/admin/export"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Export
            </Link>
            <Link
              href="/admin"
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              ← Back
            </Link>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <MetricCard
            label="Total Students"
            value={stats.data?.totalStudents || 0}
            icon={<Users size={24} />}
            color="blue"
          />
          <MetricCard
            label="Active Recruiters"
            value={stats.data?.totalRecruiters || 0}
            icon={<Briefcase size={24} />}
            color="green"
          />
          <MetricCard
            label="Total Jobs"
            value={stats.data?.totalJobs || 0}
            icon={<BarChart3 size={24} />}
            color="purple"
          />
          <MetricCard
            label="Placed Students"
            value={stats.data?.placedStudents || 0}
            subtitle={`${stats.data?.placementRate || 0}% rate`}
            icon={<Award size={24} />}
            color="yellow"
          />
          <MetricCard
            label="Average CTC"
            value={`₹${stats.data?.averageCtc || 0} LPA`}
            subtitle={`Highest: ₹${stats.data?.highestCtc || 0}`}
            icon={<TrendingUp size={24} />}
            color="indigo"
          />
        </div>

        {/* Branch-wise Placement */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <ChartCard
            title="Branch-wise Placement Rate"
            subtitle="Placement statistics by academic branch"
          >
            <div className="space-y-4">
              {branchStats.data?.map((branch: any) => (
                <div key={branch.branch}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      {branch.branch}
                    </span>
                    <span className="text-sm font-semibold text-indigo-600">
                      {branch.placementRate}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-indigo-600 h-2 rounded-full transition-all"
                      style={{ width: `${branch.placementRate}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {branch.placed} of {branch.total} students
                  </p>
                </div>
              ))}
            </div>
          </ChartCard>

          <ChartCard
            title="Year-wise Statistics"
            subtitle="Placement statistics by academic year"
          >
            <div className="space-y-4">
              {yearStats.data?.map((year: any) => (
                <div key={year.year}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      Year {year.year}
                    </span>
                    <span className="text-sm font-semibold text-green-600">
                      {year.placementRate}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full transition-all"
                      style={{ width: `${year.placementRate}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {year.placed} of {year.total} students
                  </p>
                </div>
              ))}
            </div>
          </ChartCard>
        </div>

        {/* Company & Recruiter Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ChartCard
            title="Top Companies by Selections"
            subtitle="Selection statistics by company"
          >
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 px-2 font-semibold">
                      Company
                    </th>
                    <th className="text-right py-2 px-2 font-semibold">
                      Selected
                    </th>
                    <th className="text-right py-2 px-2 font-semibold">Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {companyStats.data?.slice(0, 10).map((company: any) => (
                    <tr
                      key={company.jobTitle}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="py-2 px-2">
                        <div>
                          <p className="font-medium text-gray-900">
                            {company.company}
                          </p>
                          <p className="text-xs text-gray-500">
                            {company.jobTitle}
                          </p>
                        </div>
                      </td>
                      <td className="text-right py-2 px-2 font-semibold">
                        {company.accepted}
                      </td>
                      <td className="text-right py-2 px-2">
                        <span className="px-2 py-1 rounded-full bg-green-100 text-green-800 text-xs font-medium">
                          {company.selectionRate}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </ChartCard>

          <ChartCard
            title="Top Recruiters"
            subtitle="Recruiter performance by acceptances"
          >
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 px-2 font-semibold">
                      Recruiter
                    </th>
                    <th className="text-right py-2 px-2 font-semibold">
                      Accepted
                    </th>
                    <th className="text-right py-2 px-2 font-semibold">Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {recruiterStats.data?.slice(0, 10).map((recruiter: any) => (
                    <tr
                      key={recruiter.recruiter}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="py-2 px-2">
                        <div>
                          <p className="font-medium text-gray-900">
                            {recruiter.recruiter}
                          </p>
                          <p className="text-xs text-gray-500">
                            {recruiter.contactPerson}
                          </p>
                        </div>
                      </td>
                      <td className="text-right py-2 px-2 font-semibold">
                        {recruiter.accepted}
                      </td>
                      <td className="text-right py-2 px-2">
                        <span className="px-2 py-1 rounded-full bg-indigo-100 text-indigo-800 text-xs font-medium">
                          {recruiter.selectionRate}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </ChartCard>
        </div>
      </main>
    </div>
  );
}
