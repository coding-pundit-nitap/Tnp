"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Cpu, Radio, Cog, Zap, Building, FlaskConical } from "lucide-react";
import SectionHeading from "./SectionHeading";

const sessions = {
  "2025-26": [
    { dept: "Computer Science & Engineering", short: "CSE", rate: "88%", highest: "₹11.8 LPA", average: "₹8 LPA", icon: Cpu, isNew: false },
    { dept: "Electronics & Communication", short: "ECE", rate: "83.3%", highest: "₹17 LPA", average: "₹7 LPA", icon: Radio, isNew: false },
    { dept: "Electrical Engineering", short: "EE", rate: "58.8%", highest: "₹14 LPA", average: "₹7.1 LPA", icon: Zap, isNew: false },
    { dept: "Mechanical Engineering", short: "ME", rate: "90.9%", highest: "₹13 LPA", average: "₹6.8 LPA", icon: Cog, isNew: false },
    { dept: "Civil Engineering", short: "CE", rate: "91.6%", highest: "₹11 LPA", average: "₹6.8 LPA", icon: Building, isNew: false },
    { dept: "Bio Technology", short: "BT", rate: "—", highest: "—", average: "—", icon: FlaskConical, isNew: true },
  ],
  "2024-25": [
    { dept: "Computer Science & Engineering", short: "CSE", rate: "79.68%", highest: "₹45 LPA", average: "₹15.2 LPA", icon: Cpu, isNew: false },
    { dept: "Electronics & Communication", short: "ECE", rate: "80.33%", highest: "₹32 LPA", average: "₹12.8 LPA", icon: Radio, isNew: false },
    { dept: "Electrical Engineering", short: "EE", rate: "90.91%", highest: "₹30 LPA", average: "₹12.0 LPA", icon: Zap, isNew: false },
    { dept: "Mechanical Engineering", short: "ME", rate: "88.70%", highest: "₹28 LPA", average: "₹11.5 LPA", icon: Cog, isNew: false },
    { dept: "Civil Engineering", short: "CE", rate: "85.40%", highest: "₹25 LPA", average: "₹10.2 LPA", icon: Building, isNew: false },
    { dept: "Bio Technology", short: "BT", rate: "—", highest: "—", average: "—", icon: FlaskConical, isNew: true },
  ],
};

type SessionKey = keyof typeof sessions;

export default function DepartmentWisePlacement() {
  const [activeYear, setActiveYear] = useState<SessionKey>("2025-26");
  const data = sessions[activeYear];

  return (
    <section
      id="department-placements"
      className="scroll-mt-20 bg-canvas py-20 sm:py-28"
    >
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Departments"
          title="Department-wise Statistics"
          subtitle="Branch-level placement performance by session."
        />

        {/* Year toggle */}
        <div className="mt-10 flex justify-center">
          <div className="inline-flex rounded-lg border border-line bg-surface p-1">
            {(Object.keys(sessions) as SessionKey[]).map((year) => (
              <button
                key={year}
                onClick={() => setActiveYear(year)}
                className={`rounded-md px-5 py-2 text-sm font-semibold transition-all ${
                  activeYear === year
                    ? "bg-navy text-white shadow-sm"
                    : "text-ink-muted hover:text-ink"
                }`}
              >
                {year}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.map((d, i) => (
            <motion.div
              key={`${activeYear}-${d.short}`}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.35, ease: "easeOut" }}
              className="group relative rounded-xl border border-line bg-surface p-5 sm:p-6 shadow-soft transition-all duration-300 hover:shadow-soft-hover"
            >
              {/* New branch badge */}
              {d.isNew && (
                <span className="absolute top-3 right-3 rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-emerald-600">
                  New
                </span>
              )}
              {/* Header */}
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-navy text-white">
                  <d.icon size={18} strokeWidth={2} />
                </span>
                <div className="min-w-0">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-ink-muted">
                    {d.short}
                  </span>
                  <h3 className="text-sm font-bold text-ink leading-tight">
                    {d.dept}
                  </h3>
                </div>
              </div>

              {/* Placement rate */}
              <div className="mt-5 text-center">
                <p className="text-2xl font-extrabold tabular-nums text-navy">
                  {d.rate}
                </p>
                <p className="mt-0.5 text-[11px] font-medium text-ink-muted">
                  {d.isNew ? "First batch yet to graduate" : "Placement Rate"}
                </p>
              </div>

              {/* Package stats */}
              <div className="mt-4 flex items-center justify-between border-t border-line pt-4">
                <div className="text-center flex-1">
                  <p className="text-sm font-bold text-ink">{d.highest}</p>
                  <p className="text-[10px] text-ink-muted">Highest</p>
                </div>
                <div className="h-8 w-px bg-line" />
                <div className="text-center flex-1">
                  <p className="text-sm font-bold text-ink">{d.average}</p>
                  <p className="text-[10px] text-ink-muted">Average</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
