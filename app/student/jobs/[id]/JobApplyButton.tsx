"use client";

import { useState } from "react";
import { applyToJob } from "@/actions/application";
import { useRouter } from "next/navigation";

interface JobApplyButtonProps {
  jobId: string;
}

export default function JobApplyButton({ jobId }: JobApplyButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleApply = async () => {
    setLoading(true);
    setError("");

    try {
      const result = await applyToJob(jobId);

      if (result.success) {
        setSuccess(true);
        setTimeout(() => {
          router.refresh();
        }, 1500);
      } else {
        setError(result.error || "Failed to apply");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
        <p className="text-green-800">✓ Application submitted successfully!</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
        <p className="text-red-800">{error}</p>
      </div>
    );
  }

  return (
    <button
      onClick={handleApply}
      disabled={loading}
      className="w-full bg-indigo-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loading ? "Applying..." : "Apply Now"}
    </button>
  );
}
