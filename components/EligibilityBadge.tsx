interface EligibilityBadgeProps {
  eligible: boolean;
  reason?: string;
}

export default function EligibilityBadge({
  eligible,
  reason,
}: EligibilityBadgeProps) {
  return (
    <div
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-medium ${
        eligible ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
      }`}
    >
      <span>{eligible ? "✓ Eligible" : "✗ Not Eligible"}</span>
      {reason && <span className="text-xs opacity-75">({reason})</span>}
    </div>
  );
}
