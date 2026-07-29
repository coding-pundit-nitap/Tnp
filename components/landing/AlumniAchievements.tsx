"use client";

import { motion } from "framer-motion";
import { Trophy } from "lucide-react";
import SectionHeading from "./SectionHeading";

const alumni = [
  {
    name: "Yashni Nagarajan",
    batch: "2020",
    role: "IAS Officer",
    org: "Indian Administrative Service",
  },
  {
    name: "Vinayak Keshav Doifode",
    batch: "Alumni",
    role: "GATE Top Scorer",
    org: "Graduate Aptitude Test in Engineering",
  },
  {
    name: "NIT AP Alumni",
    batch: "Alumni",
    role: "Chief Manager - Finance",
    org: "Kotak General Insurance",
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

export default function AlumniAchievements() {
  return (
    <section className="scroll-mt-20 bg-canvas py-20 sm:py-28">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Alumni"
          title="Career Milestones"
          subtitle="NIT AP graduates lead teams, crack civil services, and rise to senior roles within years of graduation."
        />

        <div className="mt-14 grid gap-4 sm:grid-cols-3">
          {alumni.map((a, i) => (
            <motion.div
              key={a.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07, duration: 0.4, ease: "easeOut" }}
              viewport={{ once: true }}
              className="flex items-start gap-4 rounded-xl border border-line bg-surface p-5 shadow-soft transition-all duration-300 hover:shadow-soft-hover"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-navy/[0.08] text-[12px] font-bold text-navy">
                {initials(a.name)}
              </span>
              <div className="min-w-0">
                <p className="text-sm font-bold text-ink">{a.name}</p>
                <p className="mt-0.5 text-[13px] font-semibold text-navy">{a.role}</p>
                <p className="mt-0.5 text-[12px] text-ink-muted">{a.org}</p>
                <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700">
                  <Trophy size={10} />
                  Batch {a.batch}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
