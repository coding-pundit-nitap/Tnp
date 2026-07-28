"use client";

import { motion } from "framer-motion";
import { TrendingUp, Building2, Users, Award } from "lucide-react";
import SectionHeading from "./SectionHeading";

const stats = [
  {
    label: "Highest Package",
    value: "₹58L",
    description: "Microsoft · 2024–25",
    icon: TrendingUp,
    tint: "bg-navy/10 text-navy",
  },
  {
    label: "Average Package",
    value: "₹7.37L",
    description: "Across all branches",
    icon: Award,
    tint: "bg-navy/[0.07] text-navy-mid",
  },
  {
    label: "Total Offers",
    value: "295+",
    description: "Session 2024–25",
    icon: Users,
    tint: "bg-navy/[0.07] text-navy-mid",
  },
  {
    label: "Companies Visited",
    value: "100+",
    description: "Leading recruiters",
    icon: Building2,
    tint: "bg-navy/10 text-navy",
  },
];

export default function PlacementOverview() {
  return (
    <section
      id="placement-overview"
      className="scroll-mt-20 bg-canvas py-20 sm:py-28"
    >
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Highlights"
          title="Placement at a Glance"
          subtitle="Key achievements from the academic year 2024–25."
        />

        <div className="mt-16 grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-5">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07, duration: 0.45, ease: "easeOut" }}
              viewport={{ once: true }}
              className="group flex flex-col rounded-2xl border border-line bg-surface px-6 pb-7 pt-7 shadow-soft transition-all duration-300 hover:bg-[#f8faff] hover:shadow-soft-hover"
            >
              <span
                className={`inline-flex h-11 w-11 items-center justify-center rounded-xl ${s.tint}`}
              >
                <s.icon size={20} strokeWidth={2.2} />
              </span>
              <p className="mt-6 text-[30px] font-bold leading-none tracking-tight text-ink tabular-nums">
                {s.value}
              </p>
              <p className="mt-3 text-[14px] font-semibold text-ink">
                {s.label}
              </p>
              <p className="mt-1 text-[13px] text-ink-soft">
                {s.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* About T&P */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mt-8 grid overflow-hidden rounded-2xl border border-line bg-surface shadow-soft transition-all duration-300 hover:bg-[#f8faff] hover:shadow-soft-hover lg:grid-cols-5"
        >
          <div className="relative hidden bg-navy lg:col-span-2 lg:block">
            <div className="bg-grid absolute inset-0" />
            <div className="relative flex h-full flex-col justify-between p-9">
              <span className="overline text-blue-200/70">Est. NIT AP</span>
              <div>
                <p className="font-display text-6xl font-extrabold leading-none text-white">
                  T&amp;P
                </p>
                <p className="mt-3 max-w-[14rem] text-sm leading-relaxed text-blue-100/80">
                  Connecting talent with opportunity, every season.
                </p>
              </div>
            </div>
          </div>
          <div className="p-8 sm:p-10 lg:col-span-3">
            <h3 className="text-xl font-bold tracking-tight text-ink">
              About the T&amp;P Cell
            </h3>
            <p className="mt-4 text-[15px] leading-7 text-ink-soft">
              The Training &amp; Placement Cell at NIT Arunachal Pradesh serves
              as the primary interface between the institute and the industry.
              It is committed to providing students with excellent career
              opportunities by organising campus recruitment drives, internship
              programs, skill development workshops and industry interaction
              sessions.
            </p>
            <p className="mt-3 text-[15px] leading-7 text-ink-soft">
              The cell works year-round to ensure students are well-prepared and
              connected with leading employers across sectors.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
