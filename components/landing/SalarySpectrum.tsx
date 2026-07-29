"use client";

import { motion } from "framer-motion";

const spectrum = [
  { label: "Minimum", value: "₹4.2L", position: 0 },
  { label: "Median", value: "₹6.5L", position: 33 },
  { label: "Top 10%", value: "₹11.8L", position: 66 },
  { label: "Highest", value: "₹17L", position: 100 },
];

export default function SalarySpectrum() {
  return (
    <section className="bg-surface pb-20 sm:pb-28">
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="mx-auto max-w-screen-xl px-4 sm:px-6"
      >
        <div className="rounded-xl border border-line bg-surface p-6 shadow-soft sm:p-8">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-ink">Salary Distribution · 2025–26</h3>
            <p className="mt-0.5 text-[12px] text-ink-muted">
              CTC range across all placed students
            </p>
          </div>
          <span className="hidden rounded-full bg-navy/[0.06] px-3 py-1 text-[11px] font-bold text-navy sm:inline-flex">
            Annual CTC in LPA
          </span>
        </div>

        {/* Spectrum bar */}
        <div className="mt-6">
          <div className="relative h-3 w-full overflow-hidden rounded-full bg-gray-100">
            <div className="absolute inset-y-0 left-0 w-full rounded-full bg-gradient-to-r from-navy/20 via-navy/50 to-navy" />
          </div>

          {/* Labels */}
          <div className="mt-4 grid grid-cols-4 gap-2">
            {spectrum.map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-lg font-bold tabular-nums text-ink sm:text-xl">
                  {s.value}
                </p>
                <p className="mt-0.5 text-[11px] font-medium text-ink-muted">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
      </motion.div>
    </section>
  );
}
