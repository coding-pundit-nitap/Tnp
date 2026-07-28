import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface BackButtonProps {
  href: string;
  label?: string;
  className?: string;
}

export function BackButton({
  href,
  label = "← Back",
  className = "",
}: BackButtonProps) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium transition-colors ${className}`}
    >
      <ArrowLeft size={18} />
      <span>{label}</span>
    </Link>
  );
}
