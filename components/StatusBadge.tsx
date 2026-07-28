"use client";

interface StatusBadgeProps {
  status:
    | "APPROVED"
    | "PENDING"
    | "REJECTED"
    | "ACTIVE"
    | "APPLIED"
    | "SHORTLISTED"
    | "SELECTED";
  label?: string;
}

const statusColors: Record<string, { bg: string; text: string }> = {
  APPROVED: { bg: "bg-green-100", text: "text-green-800" },
  PENDING: { bg: "bg-yellow-100", text: "text-yellow-800" },
  REJECTED: { bg: "bg-red-100", text: "text-red-800" },
  ACTIVE: { bg: "bg-blue-100", text: "text-blue-800" },
  APPLIED: { bg: "bg-blue-100", text: "text-blue-800" },
  SHORTLISTED: { bg: "bg-purple-100", text: "text-purple-800" },
  SELECTED: { bg: "bg-green-100", text: "text-green-800" },
};

export default function StatusBadge({ status, label }: StatusBadgeProps) {
  const colors = statusColors[status] || statusColors.PENDING;

  return (
    <span
      className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${colors.bg} ${colors.text}`}
    >
      {label || status}
    </span>
  );
}
