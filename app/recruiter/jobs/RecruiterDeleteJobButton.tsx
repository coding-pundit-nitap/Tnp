"use client";

import { useState } from "react";
import { deleteJob } from "@/actions/job";
import { useRouter } from "next/navigation";

interface RecruiterDeleteJobButtonProps {
  jobId: string;
}

export default function RecruiterDeleteJobButton({
  jobId,
}: RecruiterDeleteJobButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (
      !confirm(
        "Are you sure you want to delete this job? All applications will be deleted as well.",
      )
    ) {
      return;
    }

    setLoading(true);

    try {
      const result = await deleteJob(jobId);

      if (result.success) {
        router.refresh();
      }
    } catch (err) {
      console.error("Delete error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loading ? "Deleting..." : "🗑️ Delete"}
    </button>
  );
}
