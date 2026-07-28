"use client";

import { useState } from "react";
import Link from "next/link";
import { updateSystemSettings } from "@/actions/settings";

interface SettingsFormProps {
  initialData: any;
}

export default function SettingsForm({ initialData }: SettingsFormProps) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    placementSeasonYear:
      initialData?.placementSeasonYear || new Date().getFullYear(),
    defaultCgpaCutoff: initialData?.defaultCgpaCutoff || 6.0,
    portalOpen: initialData?.portalOpen ?? true,
    allowedDomains: initialData?.allowedDomains?.join(", ") || "",
    emailFrom: initialData?.emailFrom || "noreply@placement.portal.com",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);

    try {
      const result = await updateSystemSettings({
        placementSeasonYear: parseInt(formData.placementSeasonYear.toString()),
        defaultCgpaCutoff: parseFloat(formData.defaultCgpaCutoff.toString()),
        portalOpen: formData.portalOpen,
        allowedDomains: formData.allowedDomains
          .split(",")
          .map((d: string) => d.trim())
          .filter((d: string) => d),
        emailFrom: formData.emailFrom,
      });

      if (result.success) {
        setSuccess("Settings updated successfully!");
      } else {
        setError(result.error || "Failed to update settings");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <form onSubmit={handleSubmit} className="p-8 space-y-6">
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {success && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800">{success}</p>
          </div>
        )}

        {/* Placement Season Year */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Placement Season Year
          </label>
          <input
            type="number"
            min="2000"
            max="2100"
            value={formData.placementSeasonYear}
            onChange={(e) =>
              setFormData({
                ...formData,
                placementSeasonYear: parseInt(e.target.value),
              })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
          />
          <p className="text-sm text-gray-500 mt-1">
            The academic year for which placements are being held
          </p>
        </div>

        {/* Default CGPA Cutoff */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Default CGPA Cutoff
          </label>
          <input
            type="number"
            min="0"
            max="10"
            step="0.1"
            value={formData.defaultCgpaCutoff}
            onChange={(e) =>
              setFormData({
                ...formData,
                defaultCgpaCutoff: parseFloat(e.target.value),
              })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
          />
          <p className="text-sm text-gray-500 mt-1">
            Default minimum CGPA requirement for job eligibility
          </p>
        </div>

        {/* Portal Open/Close */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Portal Status
          </label>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                checked={formData.portalOpen}
                onChange={() => setFormData({ ...formData, portalOpen: true })}
                className="w-4 h-4"
              />
              <span className="text-sm text-gray-700">Open</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                checked={!formData.portalOpen}
                onChange={() => setFormData({ ...formData, portalOpen: false })}
                className="w-4 h-4"
              />
              <span className="text-sm text-gray-700">Closed</span>
            </label>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Close the portal to prevent new applications
          </p>
        </div>

        {/* Allowed Domains */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Allowed Email Domains
          </label>
          <textarea
            value={formData.allowedDomains}
            onChange={(e) =>
              setFormData({
                ...formData,
                allowedDomains: e.target.value,
              })
            }
            rows={4}
            placeholder="iit.ac.in, nit.ac.in, edu.ac.in"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
          />
          <p className="text-sm text-gray-500 mt-1">
            Comma-separated list of allowed email domains. Leave empty to allow
            all.
          </p>
        </div>

        {/* Email From */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email From Address
          </label>
          <input
            type="email"
            value={formData.emailFrom}
            onChange={(e) =>
              setFormData({
                ...formData,
                emailFrom: e.target.value,
              })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
          />
          <p className="text-sm text-gray-500 mt-1">
            Sender email address for system notifications
          </p>
        </div>

        {/* Submit Button */}
        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={submitting}
            className="flex-1 bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
          >
            {submitting ? "Saving..." : "Save Settings"}
          </button>
          <Link
            href="/admin"
            className="flex-1 bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300 text-center"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
