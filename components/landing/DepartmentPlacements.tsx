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
    dept: "Electronics & Communication Engineering",
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

        {/* Department cards */}
        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {data.map((d, i) => (
            <motion.div
              key={d.dept}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07, duration: 0.45, ease: "easeOut" }}
              viewport={{ once: true }}
              className="group rounded-2xl border border-line bg-surface p-7 shadow-soft transition-all duration-300 hover:bg-[#f8faff] hover:shadow-soft-hover"
            >
              <div className="flex items-center gap-3.5">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-navy text-white">
                  <d.icon size={20} strokeWidth={2.1} />
                </span>
                <div className="min-w-0">
                  <span className="overline text-ink-muted">{d.short}</span>
                  <h3 className="mt-0.5 text-[15px] font-semibold leading-snug text-ink">
                    {d.dept}
                  </h3>
                </div>
              </div>

              <dl className="mt-7 divide-y divide-line border-t border-line">
                {[
                  { k: "Placement Rate", v: d.rate, hl: true },
                  { k: "Highest Package", v: d.highest },
                  { k: "Average Package", v: d.average },
                ].map((row) => (
                  <div
                    key={row.k}
                    className="flex items-center justify-between py-3"
                  >
                    <dt className="text-sm text-ink-muted">{row.k}</dt>
                    <dd
                      className={`text-sm font-bold tabular-nums ${
                        row.hl ? "text-navy" : "text-ink"
                      }`}
                    >
                      {row.v}
                    </dd>
                  </div>
                ))}
              </dl>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
