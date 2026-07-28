"use client";

import { useState } from "react";
import JobCard from "@/components/JobCard";
import Link from "next/link";

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  ctc: number;
  minCgpa: number;
  isEligible: boolean;
  eligibilityDetails: {
    cgpa: { eligible: boolean; required: number };
    branch: { eligible: boolean };
    year: { eligible: boolean };
  };
}

interface JobsListProps {
  jobs: Job[];
  eligibleCount: number;
}

export default function JobsList({ jobs, eligibleCount }: JobsListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterEligible, setFilterEligible] = useState<
    "all" | "eligible" | "not-eligible"
  >("all");
  const [sortBy, setSortBy] = useState<"ctc-high" | "ctc-low" | "recent">(
    "recent",
  );

  // Filter and sort jobs
  let filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterEligible === "all" ||
      (filterEligible === "eligible" && job.isEligible) ||
      (filterEligible === "not-eligible" && !job.isEligible);

    return matchesSearch && matchesFilter;
  });

  // Sort jobs
  if (sortBy === "ctc-high") {
    filteredJobs = filteredJobs.sort((a, b) => b.ctc - a.ctc);
  } else if (sortBy === "ctc-low") {
    filteredJobs = filteredJobs.sort((a, b) => a.ctc - b.ctc);
  }

  return (
    <>
      {/* Filter Bar */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search
            </label>
            <input
              type="text"
              placeholder="Search by job, company, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Eligibility Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Eligibility
            </label>
            <select
              value={filterEligible}
              onChange={(e) => setFilterEligible(e.target.value as any)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">All Jobs ({jobs.length})</option>
              <option value="eligible">Eligible Only ({eligibleCount})</option>
              <option value="not-eligible">
                Not Eligible ({jobs.length - eligibleCount})
              </option>
            </select>
          </div>

          {/* Sort */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="recent">Recently Posted</option>
              <option value="ctc-high">CTC (High to Low)</option>
              <option value="ctc-low">CTC (Low to High)</option>
            </select>
          </div>
        </div>

        {/* Active Filters Summary */}
        {(searchTerm || filterEligible !== "all") && (
          <div className="mt-4 flex items-center gap-2">
            <span className="text-sm text-gray-600">Active filters:</span>
            {searchTerm && (
              <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm">
                Search: "{searchTerm}"
                <button
                  onClick={() => setSearchTerm("")}
                  className="ml-2 text-indigo-900 hover:text-indigo-600"
                >
                  ×
                </button>
              </span>
            )}
            {filterEligible !== "all" && (
              <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm">
                {filterEligible === "eligible"
                  ? "Eligible Jobs"
                  : "Not Eligible"}
                <button
                  onClick={() => setFilterEligible("all")}
                  className="ml-2 text-indigo-900 hover:text-indigo-600"
                >
                  ×
                </button>
              </span>
            )}
          </div>
        )}
      </div>

      {/* Results Count */}
      <div className="mb-4">
        <p className="text-sm text-gray-600">
          Showing {filteredJobs.length} of {jobs.length} jobs
        </p>
      </div>

      {/* Jobs List */}
      {filteredJobs.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            No jobs found
          </h3>
          <p className="text-gray-600">
            Try adjusting your filters or search terms
          </p>
          {(searchTerm || filterEligible !== "all") && (
            <button
              onClick={() => {
                setSearchTerm("");
                setFilterEligible("all");
              }}
              className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Clear All Filters
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredJobs.map((job) => (
            <Link key={job.id} href={`/student/jobs/${job.id}`}>
              <JobCard
                id={job.id}
                title={job.title}
                company={job.company}
                location={job.location}
                ctc={job.ctc}
                minCgpa={job.minCgpa}
                isEligible={job.isEligible}
              >
                {!job.isEligible && (
                  <div className="text-xs text-red-700 bg-red-50 p-2 rounded mt-2">
                    <p>❌ Not eligible</p>
                    {!job.eligibilityDetails.cgpa.eligible && (
                      <p>
                        • Your CGPA is below the minimum (
                        {job.eligibilityDetails.cgpa.required})
                      </p>
                    )}
                    {!job.eligibilityDetails.branch.eligible && (
                      <p>• Your branch is not in the allowed list</p>
                    )}
                    {!job.eligibilityDetails.year.eligible && (
                      <p>• Your year is not eligible</p>
                    )}
                  </div>
                )}
              </JobCard>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
