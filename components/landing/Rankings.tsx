"use client";

import { motion } from "framer-motion";
import { Award, Star, Landmark } from "lucide-react";

const rankings = [
  {
    icon: Award,
    title: "NIRF Ranked",
    value: "101–150",
    subtitle: "Engineering Category 2024",
  },
  {
    icon: Star,
    title: "ARIIA Band A",
    value: "4th",
    subtitle: "Among all NITs in India",
  },
  {
    icon: Landmark,
    title: "Institute of",
    value: "National Importance",
    subtitle: "Under Ministry of Education, Govt. of India",
  },
];

export default function Rankings() {
  return (
    <section className="border-b border-line bg-surface py-6">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {rankings.map((r, i) => (
            <motion.div
              key={r.title}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              viewport={{ once: true }}
              className="flex items-center gap-3 rounded-lg px-4 py-3"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-navy/[0.06] text-navy">
                <r.icon size={18} strokeWidth={2} />
              </span>
              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-muted">
                  {r.title}
                </p>
                <p className="text-sm font-bold text-ink">{r.value}</p>
                <p className="text-[11px] text-ink-muted leading-tight">{r.subtitle}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
