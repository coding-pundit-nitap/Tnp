"use client";

import { motion } from "framer-motion";
import { Cpu, Radio, Cog } from "lucide-react";
import SectionHeading from "./SectionHeading";
import CompanyMarquee from "./CompanyMarquee";

const data = [
  {
    dept: "Computer Science & Engineering",
    short: "CSE",
    rate: "79.68%",
    highest: "₹58 LPA",
    average: "₹7.37 LPA",
    icon: Cpu,
  },
  {
    dept: "Electronics & Communication Engineering",
    short: "ECE",
    rate: "80.33%",
    highest: "₹18.55 LPA",
    average: "₹6.92 LPA",
    icon: Radio,
  },
  {
    dept: "Mechanical Engineering",
    short: "ME",
    rate: "89.79%",
    highest: "₹15.50 LPA",
    average: "₹6.40 LPA",
    icon: Cog,
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
        <div className="mt-16 grid gap-5 lg:grid-cols-3">
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

        {/* Top recruiters */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mt-8 rounded-2xl border border-line bg-surface py-10 shadow-soft transition-all duration-300 hover:bg-[#f8faff] hover:shadow-soft-hover"
        >
          <div className="px-6 text-center">
            <span className="overline text-accent-dark">Trusted by</span>
            <h3 className="mt-3 text-xl font-bold tracking-tight text-ink">
              Our Top Recruiters
            </h3>
          </div>
          <div className="mt-8">
            <CompanyMarquee />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
