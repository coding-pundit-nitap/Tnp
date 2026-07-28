"use client";

import { motion } from "framer-motion";
import { Cpu, Radio, Cog, Zap, Building } from "lucide-react";
import SectionHeading from "./SectionHeading";

const data = [
  {
    dept: "Computer Science & Engineering",
    short: "CSE",
    rate: "79.68%",
    highest: "₹45 LPA",
    average: "₹15.2 LPA",
    icon: Cpu,
  },
  {
    dept: "Electronics & Communication",
    short: "ECE",
    rate: "80.33%",
    highest: "₹32 LPA",
    average: "₹12.8 LPA",
    icon: Radio,
  },
  {
    dept: "Electrical Engineering",
    short: "EE",
    rate: "90.91%",
    highest: "₹30 LPA",
    average: "₹12.0 LPA",
    icon: Zap,
  },
  {
    dept: "Mechanical Engineering",
    short: "ME",
    rate: "88.70%",
    highest: "₹28 LPA",
    average: "₹11.5 LPA",
    icon: Cog,
  },
  {
    dept: "Civil Engineering",
    short: "CE",
    rate: "85.40%",
    highest: "₹25 LPA",
    average: "₹10.2 LPA",
    icon: Building,
  },
];

export default function DepartmentWisePlacement() {
  return (
    <section
      id="department-placements"
      className="scroll-mt-20 bg-canvas py-20 sm:py-28"
    >
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Departments"
          title="Department-wise Statistics"
          subtitle="Branch-level placement performance for the 2024–25 session."
        />

        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {data.map((d, i) => (
            <motion.div
              key={d.dept}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07, duration: 0.45, ease: "easeOut" }}
              viewport={{ once: true }}
              className="group rounded-2xl border border-line bg-surface p-6 sm:p-8 shadow-soft transition-all duration-300 hover:bg-[#f8faff] hover:shadow-soft-hover"
            >
              {/* Header */}
              <div className="flex items-center gap-3 sm:gap-4">
                <span className="flex h-11 w-11 sm:h-14 sm:w-14 items-center justify-center rounded-xl bg-navy text-white">
                  <d.icon size={20} strokeWidth={2} />
                </span>
                <div className="min-w-0">
                  <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-navy/60">
                    {d.short}
                  </span>
                  <h3 className="text-sm sm:text-base font-bold text-ink leading-tight">
                    {d.dept}
                  </h3>
                </div>
              </div>

              {/* Placement rate - prominent */}
              <div className="mt-6 sm:mt-7 rounded-xl bg-navy/[0.04] px-4 sm:px-5 py-3 sm:py-4 text-center">
                <p className="text-2xl sm:text-3xl font-extrabold tabular-nums text-navy">
                  {d.rate}
                </p>
                <p className="mt-1 text-xs sm:text-sm font-medium text-ink-muted">
                  Placement Rate
                </p>
              </div>

              {/* Package stats */}
              <div className="mt-4 sm:mt-5 grid grid-cols-2 gap-3 sm:gap-4">
                <div className="rounded-lg bg-canvas px-3 sm:px-4 py-2.5 sm:py-3 text-center">
                  <p className="text-sm sm:text-base font-bold text-ink">{d.highest}</p>
                  <p className="mt-0.5 text-[11px] sm:text-xs text-ink-muted">Highest</p>
                </div>
                <div className="rounded-lg bg-canvas px-3 sm:px-4 py-2.5 sm:py-3 text-center">
                  <p className="text-sm sm:text-base font-bold text-ink">{d.average}</p>
                  <p className="mt-0.5 text-[11px] sm:text-xs text-ink-muted">Average</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
