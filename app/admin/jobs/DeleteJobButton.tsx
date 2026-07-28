"use client";

import { useState } from "react";
import { adminDeleteJob } from "@/actions/job";
import { useRouter } from "next/navigation";

interface DeleteJobButtonProps {
  jobId: string;
}

export default function DeleteJobButton({ jobId }: DeleteJobButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleDelete = async () => {
    if (
      !confirm(
        "Are you sure you want to delete this job? All applications will be deleted as well.",
      )
    ) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result = await adminDeleteJob(jobId);

      if (result.success) {
        router.refresh();
      } else {
        setError(result.error || "Failed to delete job");
      }
    } catch (err) {
      setError("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return <div className="text-red-600 text-xs">{error}</div>;
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loading ? "Deleting..." : "Delete"}
    </button>
  );
}
