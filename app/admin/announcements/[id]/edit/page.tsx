"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import {
  getAnnouncementById,
  updateAnnouncement,
} from "@/actions/announcement";

export default function EditAnnouncementPage() {
  const router = useRouter();
  const params = useParams();
  const announcementId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    message: "",
  });

  useEffect(() => {
    const loadAnnouncement = async () => {
      try {
        const result = await getAnnouncementById(announcementId);
        if (result.success && result.data) {
          setFormData({
            title: result.data.title,
            message: result.data.message,
          });
        } else {
          setError("Failed to load announcement");
        }
      } catch (err) {
        setError("Failed to load announcement");
      } finally {
        setLoading(false);
      }
    };

    loadAnnouncement();
  }, [announcementId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const result = await updateAnnouncement(
        announcementId,
        formData.title,
        formData.message,
      );

      if (result.success) {
        router.push("/admin/announcements");
      } else {
        setError(result.error || "Failed to update announcement");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <Link
              href="/admin/announcements"
              className="text-2xl font-bold text-indigo-600"
            >
              ← Back
            </Link>
          </div>
        </nav>
        <div className="max-w-2xl mx-auto px-4 py-8">
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link
            href="/admin/announcements"
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
            Edit Announcement
          </h1>
          <p className="text-gray-600 mb-8">Update announcement details.</p>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                placeholder="Announcement title"
              />
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message *
              </label>
              <textarea
                required
                rows={6}
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                placeholder="Announcement message"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-indigo-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? "Updating..." : "Update Announcement"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
