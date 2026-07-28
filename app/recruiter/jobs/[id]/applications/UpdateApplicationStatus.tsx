"use client";

import { useState } from "react";
import { updateApplicationStatus } from "@/actions/application";
import { useRouter } from "next/navigation";
import { ApplicationStatus } from "@prisma/client";

interface UpdateApplicationStatusProps {
  applicationId: string;
  currentStatus: ApplicationStatus;
}

export default function UpdateApplicationStatus({
  applicationId,
  currentStatus,
}: UpdateApplicationStatusProps) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState("");

  const handleStatusUpdate = async (newStatus: ApplicationStatus) => {
    setLoading(newStatus);
    setError("");

    try {
      const result = await updateApplicationStatus(applicationId, newStatus);

      if (result.success) {
        router.refresh();
      } else {
        setError(result.error || "Failed to update status");
      }
    } catch (err) {
      setError("An error occurred");
    } finally {
      setLoading(null);
    }
  };

  if (error) {
    return (
      <div className="text-red-600 text-xs p-2 bg-red-50 rounded">{error}</div>
    );
  }

  return (
    <div className="flex gap-2 flex-wrap">
      {currentStatus === "APPLIED" && (
        <>
          <button
            onClick={() => handleStatusUpdate("SHORTLISTED")}
            disabled={loading !== null}
            className="px-3 py-1 bg-purple-600 text-white text-xs rounded hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading === "SHORTLISTED" ? "..." : "Shortlist"}
          </button>
          <button
            onClick={() => handleStatusUpdate("REJECTED")}
            disabled={loading !== null}
            className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading === "REJECTED" ? "..." : "Reject"}
          </button>
        </>
      )}
      {currentStatus === "SHORTLISTED" && (
        <>
          <button
            onClick={() => handleStatusUpdate("SELECTED")}
            disabled={loading !== null}
            className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading === "SELECTED" ? "..." : "Select"}
          </button>
          <button
            onClick={() => handleStatusUpdate("REJECTED")}
            disabled={loading !== null}
            className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading === "REJECTED" ? "..." : "Reject"}
          </button>
        </>
      )}
      {(currentStatus === "REJECTED" || currentStatus === "SELECTED") && (
        <span className="text-xs text-gray-600 py-1">No further actions</span>
      )}
    </div>
  );
}
