"use client";

import { useState } from "react";
import { generateOffer } from "@/actions/result";

interface GenerateOfferButtonProps {
  applicationId: string;
}

export default function GenerateOfferButton({
  applicationId,
}: GenerateOfferButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ctcFinal, setCtcFinal] = useState("");
  const [offerLetterUrl, setOfferLetterUrl] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!ctcFinal || isNaN(parseFloat(ctcFinal))) {
      setError("Please enter a valid CTC amount");
      setLoading(false);
      return;
    }

    try {
      const result = await generateOffer(
        applicationId,
        parseFloat(ctcFinal),
        offerLetterUrl || undefined,
      );

      if (!result.success) {
        setError(result.error || "Failed to generate offer");
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
        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors whitespace-nowrap"
      >
        Generate Offer
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full mx-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Generate Offer
        </h3>
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              CTC (LPA) *
            </label>
            <input
              type="number"
              step="0.5"
              min="0"
              value={ctcFinal}
              onChange={(e) => setCtcFinal(e.target.value)}
              placeholder="e.g., 15.5"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Offer Letter URL (optional)
            </label>
            <input
              type="url"
              value={offerLetterUrl}
              onChange={(e) => setOfferLetterUrl(e.target.value)}
              placeholder="https://..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              disabled={loading}
            />
          </div>
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 transition-colors"
            >
              {loading ? "..." : "Generate"}
            </button>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              disabled={loading}
              className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 disabled:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
