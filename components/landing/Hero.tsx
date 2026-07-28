"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { GraduationCap, Briefcase, ArrowRight } from "lucide-react";

const STATS = [
  { value: "₹58", suffix: "LPA", label: "Highest Package" },
  { value: "95", suffix: "%", label: "Placement Rate" },
  { value: "100", suffix: "+", label: "Companies" },
  { value: "295", suffix: "+", label: "Offers Made" },
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-navy-dark">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/campus.jpg')" }}
      />
      {/* Overlay — reduced to let landscape subtly show */}
      <div className="absolute inset-0 bg-gradient-to-b from-navy-dark/80 via-navy/68 to-navy-dark/85" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center_top,rgba(58,95,148,0.22),transparent_70%)]" />

      <div className="relative z-10 mx-auto flex max-w-screen-xl flex-col items-center px-4 py-24 text-center sm:px-6 sm:py-32 lg:py-40">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex flex-col items-center"
        >
          {/* Title — single line */}
          <h1 className="font-display text-[32px] font-extrabold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-[64px] lg:leading-none">
            Training &amp; <span className="text-gradient">Placement Cell</span>
          </h1>

          <p className="mt-4 text-base font-medium text-white/90 sm:text-lg">
            National Institute of Technology, Arunachal Pradesh
          </p>

          <p className="mx-auto mt-5 max-w-xl text-[15px] leading-relaxed text-[#e2e8f0] sm:text-base">
            Bridging academic excellence with industry opportunity. A
            structured, transparent and efficient placement experience for
            students and recruiters.
          </p>

          {/* CTAs — no jump, just glow */}
          <div className="mt-9 flex flex-wrap justify-center gap-3.5">
            <Link
              href="/login"
              className="group inline-flex items-center gap-2 rounded-xl bg-white px-7 py-3.5 text-sm font-bold text-navy shadow-lg transition-shadow duration-300 hover:shadow-2xl"
            >
              <GraduationCap size={18} />
              Student Login
              <ArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-0.5"
              />
            </Link>

            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-xl border border-white/25 bg-white/[0.08] px-7 py-3.5 text-sm font-bold text-white backdrop-blur-md transition-colors duration-300 hover:border-white/40 hover:bg-white/15"
            >
              <Briefcase size={18} />
              Recruiter Login
            </Link>
          </div>
        </motion.div>

        {/* Stat strip — glassmorphic */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          className="mt-14 grid w-full max-w-3xl grid-cols-2 divide-x divide-y divide-white/[0.08] overflow-hidden rounded-xl border border-white/[0.15] bg-white/[0.05] backdrop-blur-[14px] sm:grid-cols-4 sm:divide-y-0"
        >
          {STATS.map((stat) => (
            <div key={stat.label} className="px-5 py-7 sm:px-6 sm:py-8">
              <p className="text-[28px] font-bold leading-none tracking-tight text-white tabular-nums sm:text-[30px]">
                {stat.value}
                <span className="ml-1.5 text-[14px] font-medium text-white/60 sm:text-[15px]">
                  {stat.suffix}
                </span>
              </p>
              <p className="mt-2.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-white/75">
                {stat.label}
              </p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-canvas to-transparent" />
    </section>
  );
}
