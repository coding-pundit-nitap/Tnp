"use client";

import { deleteAnnouncement } from "@/actions/announcement";
import { useState } from "react";

export default function DeleteAnnouncementButton({
  announcementId,
}: {
  announcementId: string;
}) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this announcement?")) {
      return;
    }

    setLoading(true);
    try {
      await deleteAnnouncement(announcementId);
      window.location.reload();
    } catch (error) {
      alert("Failed to delete announcement");
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm disabled:opacity-50"
    >
      {loading ? "Deleting..." : "🗑️ Delete"}
    </button>
  );
}
