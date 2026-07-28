"use client";

import { useState } from "react";
import { acceptOffer, declineOffer } from "@/actions/result";

interface ManageOfferButtonProps {
  applicationId: string;
}

export default function ManageOfferButton({
  applicationId,
}: ManageOfferButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAccept = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await acceptOffer(applicationId);
      if (!result.success) {
        setError(result.error || "Failed to accept offer");
      } else {
        setIsOpen(false);
        window.location.reload();
      }
    } catch (err) {
      setError("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleDecline = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await declineOffer(applicationId);
      if (!result.success) {
        setError(result.error || "Failed to decline offer");
      } else {
        setIsOpen(false);
        window.location.reload();
      }
    } catch (err) {
      setError("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="px-3 py-1 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
      >
        Manage
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full mx-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Manage Offer
        </h3>
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        <p className="text-gray-600 mb-6">
          Do you want to accept or decline this offer?
        </p>
        <div className="flex gap-3">
          <button
            onClick={handleDecline}
            disabled={loading}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400 transition-colors"
          >
            {loading ? "..." : "Decline"}
          </button>
          <button
            onClick={handleAccept}
            disabled={loading}
            className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition-colors"
          >
            {loading ? "..." : "Accept"}
          </button>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          disabled={loading}
          className="w-full mt-3 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 disabled:bg-gray-400 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
