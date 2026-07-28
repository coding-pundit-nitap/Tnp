interface JobCardProps {
  id: string;
  title: string;
  company: string;
  location: string;
  ctc: number;
  minCgpa: number;
  isEligible?: boolean;
  onClick?: () => void;
  children?: React.ReactNode;
}

export default function JobCard({
  id,
  title,
  company,
  location,
  ctc,
  minCgpa,
  isEligible,
  onClick,
  children,
}: JobCardProps) {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-lg shadow-md border-l-4 transition-all hover:shadow-lg p-6 cursor-pointer ${
        isEligible === true
          ? "border-l-green-600"
          : isEligible === false
            ? "border-l-red-500"
            : "border-l-blue-600"
      }`}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-600 mt-1">{company}</p>
        </div>
        {isEligible !== undefined && (
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              isEligible
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {isEligible ? "Eligible" : "Not Eligible"}
          </span>
        )}
      </div>

      <div className="flex gap-4 text-sm text-gray-700 mb-4">
        <div className="flex items-center gap-1">
          <span className="text-gray-500">📍</span>
          {location}
        </div>
        <div className="flex items-center gap-1">
          <span className="text-gray-500">💰</span>₹{ctc.toLocaleString()} LPA
        </div>
      </div>

      <div className="text-xs text-gray-600 mb-4 bg-gray-50 p-2 rounded">
        Min CGPA: <strong>{minCgpa?.toFixed(2)}</strong>
      </div>

      {children && <div>{children}</div>}
    </div>
  );
}
