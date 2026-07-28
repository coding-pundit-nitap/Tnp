"use client";

import { motion } from "framer-motion";
import { Bell } from "lucide-react";

const notices = [
  "Infosys onboarded 22 freshers for full-stack developer roles",
  "Deloitte hired 5 business analysts from MBA & CSE",
  "Qualcomm selected 3 embedded systems engineers from ECE",
  "HCL placed 15 students for cloud computing roles",
  "EY conducted internship drive — 12 final-years selected",
  "Microsoft placed 5 CS students in SDE roles",
  "Google picks 3 innovators from ECE & CSE",
  "Amazon offered roles to 8 cross-branch talents",
  "TCS selects 25 future leaders across departments",
  "Samsung hired 6 AI & ML specialists from ECE & CSE",
  "Capgemini placed 20 students across CS, IT & EEE",
  "L&T hires 12 Civil & Mechanical engineering graduates",
  "Wipro takes 10 CSE & ECE bright minds",
];

export default function NewsTicker() {
  return (
    <section className="overflow-hidden border-y border-line bg-amber-50/50 py-3">
      <div className="mx-auto flex max-w-screen-xl items-center gap-4 px-4 sm:px-6">
        <span className="flex shrink-0 items-center gap-2 rounded-full bg-navy px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-white">
          <Bell size={12} />
          News
        </span>
        <div className="relative flex-1 overflow-hidden">
          <motion.div
            className="flex gap-12 whitespace-nowrap"
            animate={{ x: ["0%", "-50%"] }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 40,
                ease: "linear",
              },
            }}
          >
            {[...notices, ...notices].map((notice, i) => (
              <span
                key={i}
                className="inline-block text-[13px] font-medium text-ink-soft"
              >
                📌 {notice}
              </span>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
