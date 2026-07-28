"use client";

import { useState } from "react";
import { deleteInterviewRound } from "@/actions/interview";
import { useRouter } from "next/navigation";

interface DeleteInterviewRoundProps {
  roundId: string;
}

export default function DeleteInterviewRound({
  roundId,
}: DeleteInterviewRoundProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (
      !confirm(
        "Are you sure you want to delete this round? All associated results will be deleted.",
      )
    ) {
      return;
    }

    setLoading(true);

    try {
      const result = await deleteInterviewRound(roundId);

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
      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
    >
      {loading ? "Deleting..." : "🗑️ Delete"}
    </button>
  );
}
