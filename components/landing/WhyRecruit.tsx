"use client";

import { motion } from "framer-motion";
import {
  GraduationCap,
  Code2,
  Lightbulb,
  Users,
  Rocket,
  Brain,
} from "lucide-react";
import SectionHeading from "./SectionHeading";

const reasons = [
  {
    icon: GraduationCap,
    title: "Strong Academic Foundation",
    desc: "Rigorous NIT curriculum combining core engineering with modern technologies, lab work, and project-based learning.",
  },
  {
    icon: Code2,
    title: "Industry-Oriented Skills",
    desc: "Students build expertise in AI, data science, cloud computing, VLSI, and software development through internships and certifications.",
  },
  {
    icon: Lightbulb,
    title: "Innovation & Research Culture",
    desc: "50+ sponsored projects, publications, open-source contributions, and faculty-mentored research through the Prakousol Innovation Centre.",
  },
  {
    icon: Users,
    title: "Leadership & Teamwork",
    desc: "Technical clubs, NSS, NCC, entrepreneurship cells, and national competitions develop communication and organizational skills.",
  },
  {
    icon: Rocket,
    title: "Competitive Programming",
    desc: "Active coding culture with hackathon participation, competitive programming practice, and strong problem-solving abilities.",
  },
  {
    icon: Brain,
    title: "Adaptable & Quick Learners",
    desc: "Trained to work in multidisciplinary teams, rapidly learn emerging technologies, and contribute effectively from day one.",
  },
];

export default function WhyRecruit() {
  return (
    <section className="scroll-mt-20 bg-canvas py-20 sm:py-28" id="why-recruit">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="For Recruiters"
          title="Why Recruit from NIT Arunachal Pradesh"
          subtitle="Evidence-based reasons why leading organizations choose our graduates."
        />

        {/* Trusted by strip */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-6 text-center text-[13px] text-ink-muted"
        >
          Trusted by{" "}
          <span className="font-semibold text-ink">
            Microsoft · Morgan Stanley · Amazon · Nvidia · Deloitte · Intel · Oracle · L&T · TCS · Infosys
          </span>
        </motion.p>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {reasons.map((r, i) => (
            <motion.div
              key={r.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06, duration: 0.4, ease: "easeOut" }}
              viewport={{ once: true }}
              className="rounded-xl border border-line bg-surface p-5 shadow-soft transition-all duration-300 hover:shadow-soft-hover"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-navy/[0.06] text-navy">
                <r.icon size={18} strokeWidth={2} />
              </span>
              <h3 className="mt-3 text-sm font-bold text-ink">{r.title}</h3>
              <p className="mt-1.5 text-[13px] leading-relaxed text-ink-muted">
                {r.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
