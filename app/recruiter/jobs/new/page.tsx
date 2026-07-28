"use client";

import { useState } from "react";
import { createJob } from "@/actions/job";
import { useRouter } from "next/navigation";
import Link from "next/link";
import MultiSelect from "@/components/MultiSelect";

const BRANCHES = [
  "CSE",
  "ECE",
  "Mechanical",
  "Civil",
  "Electrical",
  "Production",
];
const YEARS = [1, 2, 3, 4];

export default function CreateJobPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    company: "",
    location: "",
    ctc: "",
    minCgpa: "",
    allowedBranches: [] as string[],
    allowedYears: [] as number[],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (
      !formData.title ||
      !formData.description ||
      !formData.location ||
      !formData.ctc ||
      !formData.minCgpa
    ) {
      setError("Please fill all required fields");
      setLoading(false);
      return;
    }

    if (formData.allowedBranches.length === 0) {
      setError("Select at least one branch");
      setLoading(false);
      return;
    }

    if (formData.allowedYears.length === 0) {
      setError("Select at least one year");
      setLoading(false);
      return;
    }

    try {
      const result = await createJob({
        title: formData.title,
        description: formData.description,
        company: formData.company,
        location: formData.location,
        ctc: parseFloat(formData.ctc),
        minCgpa: parseFloat(formData.minCgpa),
        allowedBranches: formData.allowedBranches,
        allowedYears: formData.allowedYears,
      });

      if (result.success) {
        setSuccess(true);
        setTimeout(() => router.push("/recruiter/jobs"), 1500);
      } else {
        setError(result.error || "Failed to create job");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link
            href="/recruiter/jobs"
            className="text-2xl font-bold text-indigo-600"
          >
            ← Back to Jobs
          </Link>
        </div>
      </nav>

      {/* Form */}
      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Post a New Job
          </h1>
          <p className="text-gray-600 mb-8">
            Fill in the job details below. Students will see this job if they
            meet the criteria.
          </p>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800">
                ✓ Job posted successfully! Redirecting...
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Job Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                placeholder="e.g., Software Engineer, Data Analyst"
              />
            </div>

            {/* Company */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company Name *
              </label>
              <input
                type="text"
                required
                value={formData.company}
                onChange={(e) =>
                  setFormData({ ...formData, company: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                placeholder="Your company name"
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location *
              </label>
              <input
                type="text"
                required
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                placeholder="e.g., Bangalore, Mumbai, Hyderabad"
              />
            </div>

            {/* CTC and Min CGPA */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CTC (LPA) *
                </label>
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  required
                  value={formData.ctc}
                  onChange={(e) =>
                    setFormData({ ...formData, ctc: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                  placeholder="e.g., 12"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum CGPA *
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="10"
                  required
                  value={formData.minCgpa}
                  onChange={(e) =>
                    setFormData({ ...formData, minCgpa: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                  placeholder="e.g., 7.5"
                />
              </div>
            </div>

            {/* Allowed Branches */}
            <div>
              <MultiSelect
                label="Allowed Branches *"
                name="allowedBranches"
                options={BRANCHES}
                selected={formData.allowedBranches}
                onChange={(selected) =>
                  setFormData({
                    ...formData,
                    allowedBranches: selected as string[],
                  })
                }
                isString={true}
              />
            </div>

            {/* Allowed Years */}
            <div>
              <MultiSelect
                label="Allowed Years *"
                name="allowedYears"
                options={YEARS}
                selected={formData.allowedYears}
                onChange={(selected) =>
                  setFormData({
                    ...formData,
                    allowedYears: selected as number[],
                  })
                }
                isString={false}
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Description *
              </label>
              <textarea
                required
                rows={6}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                placeholder="Describe the role, responsibilities, and what you're looking for in candidates..."
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Posting Job..." : "Post Job"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
