"use client";

import { motion } from "framer-motion";
import { BadgeCheck } from "lucide-react";
import SectionHeading from "./SectionHeading";

const students = [
  {
    name: "Vanshika Marwaha",
    branch: "Computer Science & Engineering",
    company: "Microsoft",
    package: "₹58 LPA",
    role: "Software Engineer · L3",
  },
  {
    name: "Sachin Pathak",
    branch: "Computer Science & Engineering",
    company: "UKG",
    package: "₹16 LPA",
    role: "Technology Analyst",
  },
  {
    name: "Tanya Sharma",
    branch: "Electronics & Communication",
    company: "Nexturn",
    package: "₹22 LPA",
    role: "Design Engineer",
  },
  {
    name: "Prajwalbilip Deshmukh",
    branch: "Electronics & Communication",
    company: "Nexturn",
    package: "₹15 LPA",
    role: "Hardware Engineer",
  },
  {
    name: "Kumari Manisha",
    branch: "Civil Engineering",
    company: "Vedanta",
    package: "₹10 LPA",
    role: "Graduate Engineer Trainee",
  },
  {
    name: "Runusukeerti",
    branch: "Electronics & Communication",
    company: "Hewlett Packard",
    package: "₹10 LPA",
    role: "Process Development Engineer",
  },
];

function initials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

export default function PlacedStudents() {
  return (
    <section
      id="placed-students"
      className="scroll-mt-20 bg-surface py-20 sm:py-28"
    >
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Achievers"
          title="Notable Placements"
          subtitle="Celebrating top achievers from the 2024–25 placement season."
        />

        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {students.map((s, i) => (
            <motion.div
              key={s.name}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.45, ease: "easeOut" }}
              viewport={{ once: true }}
              className="group rounded-2xl border border-gray-100 bg-surface p-6 shadow-soft transition-all duration-300 hover:bg-[#f8faff] hover:shadow-soft-hover"
            >
              {/* Header: avatar + name */}
              <div className="flex items-center gap-3.5">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-navy/[0.08] text-[13px] font-bold text-navy">
                  {initials(s.name)}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <p className="truncate text-[15px] font-semibold text-ink">
                      {s.name}
                    </p>
                    <BadgeCheck
                      size={15}
                      className="ml-0.5 shrink-0 text-navy"
                      strokeWidth={2.4}
                    />
                  </div>
                  <p className="mt-0.5 truncate text-[13px] text-ink-soft">
                    {s.branch}
                  </p>
                </div>
              </div>

              {/* Footer: company + salary — vertically centered */}
              <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-5">
                <div className="min-w-0">
                  <p className="truncate text-[15px] font-bold text-ink">
                    {s.company}
                  </p>
                  <p className="mt-0.5 truncate text-[13px] text-ink-soft">
                    {s.role}
                  </p>
                </div>
                <span className="ml-4 shrink-0 rounded-full bg-emerald-50 px-3.5 py-1.5 text-[13px] font-bold text-emerald-700 tabular-nums">
                  {s.package}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
