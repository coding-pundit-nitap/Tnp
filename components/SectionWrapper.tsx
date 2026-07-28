import type { ReactNode } from "react";

export default function SectionWrapper({
  children,
  variant = "none",
}: {
  children: ReactNode;
  variant?: "none" | "light" | "dark";
}) {
  return (
    <section
      className={
        variant === "dark"
          ? "w-full bg-linear-to-b from-[#0f172a] to-[#020617] text-gray-200"
          : variant === "light"
            ? "w-full bg-slate-50"
            : "w-full"
      }
    >
      <div className="mx-auto max-w-6xl px-6 py-24">{children}</div>
    </section>
  );
}
