"use client";

import { motion } from "framer-motion";
import SectionHeading from "./SectionHeading";

const yearData = [
  { year: "2024-25", rate: "91.5%", highlight: true },
  { year: "2023-24", rate: "89.2%" },
  { year: "2022-23", rate: "86.8%" },
  { year: "2021-22", rate: "84.5%" },
  { year: "2020-21", rate: "82.1%" },
];

const highlights = [
  { label: "Highest Package", value: "₹58 LPA" },
  { label: "Average Package", value: "₹7.37 LPA" },
  { label: "Total Offers", value: "295+" },
  { label: "Companies Visited", value: "100+" },
];

export default function YearWiseTrends() {
  return (
    <section className="scroll-mt-20 bg-canvas py-20 sm:py-28">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Trends"
          title="Year-wise Placement Performance"
          subtitle="Consistent growth in placement rates over the last five years."
        />

        {/* Achievement badges */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          viewport={{ once: true }}
          className="mt-10 flex flex-wrap items-center justify-center gap-3"
        >
          {highlights.map((h) => (
            <span
              key={h.label}
              className="inline-flex items-center gap-2 rounded-full border border-navy/20 bg-navy/5 px-4 py-2 text-[13px] font-semibold text-navy"
            >
              {h.label}: <span className="font-bold">{h.value}</span>
            </span>
          ))}
        </motion.div>

        {/* Year cards */}
        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
          {yearData.map((d, i) => (
            <motion.div
              key={d.year}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06, duration: 0.4, ease: "easeOut" }}
              viewport={{ once: true }}
              className={`relative flex flex-col items-center rounded-2xl border p-6 text-center shadow-soft transition-all duration-300 hover:shadow-soft-hover ${
                d.highlight
                  ? "border-navy bg-navy text-white"
                  : "border-line bg-surface hover:bg-[#f8faff]"
              }`}
            >
              {d.highlight && (
                <span className="absolute -top-2.5 rounded-full bg-emerald-500 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                  Latest
                </span>
              )}
              <p
                className={`text-[13px] font-semibold ${
                  d.highlight ? "text-white/70" : "text-ink-muted"
                }`}
              >
                {d.year}
              </p>
              <p
                className={`mt-3 text-[32px] font-bold tabular-nums leading-none ${
                  d.highlight ? "text-white" : "text-ink"
                }`}
              >
                {d.rate}
              </p>
              <p
                className={`mt-2 text-[12px] ${
                  d.highlight ? "text-white/60" : "text-ink-muted"
                }`}
              >
                Students Placed
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
