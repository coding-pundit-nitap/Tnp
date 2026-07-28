"use client";

import { useState } from "react";
import { updateInterviewResult } from "@/actions/result";
import { useRouter } from "next/navigation";
import { RoundResultStatus } from "@prisma/client";

interface UpdateRoundResultProps {
  resultId: string;
  applicationId: string;
  roundId: string;
  currentStatus: RoundResultStatus;
  currentRemarks?: string | null;
}

export default function UpdateRoundResult({
  resultId,
  applicationId,
  roundId,
  currentStatus,
  currentRemarks,
}: UpdateRoundResultProps) {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [remarks, setRemarks] = useState(currentRemarks || "");
  const [selectedStatus, setSelectedStatus] =
    useState<RoundResultStatus>(currentStatus);

  const handleStatusUpdate = async (status: RoundResultStatus) => {
    setLoading(true);

    try {
      const result = await updateInterviewResult(
        applicationId,
        roundId,
        status,
        remarks || undefined,
      );

      if (result.success) {
        router.refresh();
        setShowModal(false);
      }
    } catch (err) {
      console.error("Update error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!showModal) {
    return (
      <button
        onClick={() => setShowModal(true)}
        className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition"
      >
        Update
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-sm w-full mx-4">
        <div className="p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            Update Result
          </h2>

          {/* Remarks */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Remarks
            </label>
            <textarea
              rows={3}
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
              placeholder="Add any remarks..."
            />
          </div>

          {/* Status Buttons */}
          <div className="space-y-2">
            <button
              onClick={() => handleStatusUpdate("PASS")}
              disabled={loading}
              className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 text-sm"
            >
              ✓ Pass
            </button>
            <button
              onClick={() => handleStatusUpdate("FAIL")}
              disabled={loading}
              className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 text-sm"
            >
              ✗ Fail
            </button>
            <button
              onClick={() => handleStatusUpdate("PENDING")}
              disabled={loading}
              className="w-full px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors disabled:opacity-50 text-sm"
            >
              ⏳ Pending
            </button>
            <button
              onClick={() => setShowModal(false)}
              className="w-full px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
