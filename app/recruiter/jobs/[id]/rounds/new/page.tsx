"use client";

import { useState } from "react";
import { createInterviewRound } from "@/actions/interview";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { useTransition } from "react";

export default function CreateInterviewRoundPage() {
  const router = useRouter();
  const params = useParams();
  const jobId = params.id as string;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    roundNumber: 1,
    date: "",
    location: "",
    notes: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!formData.name || !formData.date || !formData.location) {
      setError("Please fill all required fields");
      setLoading(false);
      return;
    }

    try {
      const result = await createInterviewRound({
        jobId,
        name: formData.name,
        roundNumber: formData.roundNumber,
        date: formData.date,
        location: formData.location,
        notes: formData.notes || undefined,
      });

      if (result.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push(`/recruiter/jobs/${jobId}/rounds`);
        }, 1500);
      } else {
        setError(result.error || "Failed to create round");
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
            href={`/recruiter/jobs/${jobId}/rounds`}
            className="text-2xl font-bold text-indigo-600"
          >
            ← Back
          </Link>
        </div>
      </nav>

      {/* Form */}
      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Schedule Interview Round
          </h1>
          <p className="text-gray-600 mb-8">
            Create a new interview round for shortlisted candidates.
          </p>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800">
                ✓ Interview round created successfully! Redirecting...
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Round Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Round Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                placeholder="e.g., Aptitude Round, Technical Round, HR Round"
              />
            </div>

            {/* Round Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Round Number *
              </label>
              <input
                type="number"
                min="1"
                required
                value={formData.roundNumber}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    roundNumber: parseInt(e.target.value),
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                placeholder="1"
              />
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date & Time *
              </label>
              <input
                type="datetime-local"
                required
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
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
                placeholder="e.g., Bangalore Office, Online, Room 101"
              />
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes (Optional)
              </label>
              <textarea
                rows={3}
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                placeholder="Additional instructions or details..."
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Scheduling..." : "Schedule Round"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
