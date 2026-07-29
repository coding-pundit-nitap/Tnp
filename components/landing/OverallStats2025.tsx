"use client";

import { motion } from "framer-motion";
import { TrendingUp, IndianRupee, Handshake } from "lucide-react";
import SectionHeading from "./SectionHeading";
import { TrendChart, Gauge, type TrendPoint } from "./PlacementCharts";

const trend: TrendPoint[] = [
  { year: "2020–21", value: 82.1 },
  { year: "2021–22", value: 84.5 },
  { year: "2022–23", value: 86.8 },
  { year: "2023–24", value: 89.2 },
  { year: "2024–25", value: 91.5 },
  { year: "2025–26", value: 90.0 },
];

function Metric({
  icon: Icon,
  value,
  label,
  sublabel,
}: {
  icon: typeof IndianRupee;
  value: string;
  label: string;
  sublabel: string;
}) {
  return (
    <div className="flex items-center gap-3.5 rounded-xl bg-canvas p-4">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-navy text-white">
        <Icon size={19} strokeWidth={2.1} />
      </span>
      <div className="min-w-0">
        <p className="font-display text-xl font-bold leading-none tracking-tight text-ink tabular-nums">
          {value}
        </p>
        <p className="mt-1 truncate text-[12.5px] font-medium text-ink-soft">
          {label}
        </p>
        <p className="truncate text-[11px] text-ink-muted">{sublabel}</p>
      </div>
    </div>
  );
}

export default function OverallPlacementStats() {
  return (
    <section id="overall-stats" className="scroll-mt-20 bg-surface py-20 sm:py-28">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Statistics"
          title="Overall Placement Statistics"
          subtitle="A consolidated view of performance across the academic year 2025–26."
        />

        <div className="mt-16 grid gap-5 lg:grid-cols-5">
          {/* Trend chart */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            viewport={{ once: true }}
            className="rounded-2xl border border-line bg-surface p-6 shadow-soft transition-all duration-300 hover:bg-[#f8faff] hover:shadow-soft-hover sm:p-8 lg:col-span-3"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold tracking-tight text-ink">
                  Placement Trend
                </h3>
                <p className="mt-1 text-[13px] text-ink-muted">
                  Eligible students placed · last 5 years
                </p>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-[12.5px] font-semibold text-emerald-700">
                <TrendingUp size={14} strokeWidth={2.4} />
                +9.4 pts
              </span>
            </div>

            <div className="mt-4">
              <TrendChart data={trend} />
            </div>
          </motion.div>

          {/* Gauges + metrics */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08, ease: "easeOut" }}
            viewport={{ once: true }}
            className="flex flex-col gap-6 rounded-2xl border border-line bg-surface p-6 shadow-soft transition-all duration-300 hover:bg-[#f8faff] hover:shadow-soft-hover sm:p-8 lg:col-span-2"
          >
            <div className="grid grid-cols-2 gap-4">
              <Gauge value={90} label="Students Placed" sublabel="Session 2025–26" />
              <Gauge value={88} label="Internships" sublabel="Summer training" />
            </div>

            <div className="grid grid-cols-1 gap-3 border-t border-line pt-6 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              <Metric
                icon={IndianRupee}
                value="₹17L"
                label="Highest CTC"
                sublabel="B.Tech, per annum"
              />
              <Metric
                icon={Handshake}
                value="25+"
                label="Industry Partners"
                sublabel="MoU & programs"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
