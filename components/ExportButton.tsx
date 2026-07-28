"use client";

import React, { useState } from "react";
import { Download } from "lucide-react";

interface ExportButtonProps {
  label?: string;
  format?: "csv" | "pdf" | "excel";
  onClick: () => Promise<{ success: boolean; csv?: string; error?: string }>;
  filename?: string;
  disabled?: boolean;
}

export default function ExportButton({
  label = "Export",
  format = "csv",
  onClick,
  filename,
  disabled = false,
}: ExportButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleExport = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await onClick();
      if (result.success && result.csv) {
        // Create blob and download
        const blob = new Blob([result.csv], {
          type: "text/csv;charset=utf-8;",
        });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download =
          filename ||
          `export_${new Date().toISOString().split("T")[0]}.${format}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        setError(result.error || "Export failed");
      }
    } catch (err: any) {
      setError(err.message || "Failed to export");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={handleExport}
        disabled={loading || disabled}
        className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Download size={18} />
        {loading ? "Exporting..." : label}
      </button>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}
