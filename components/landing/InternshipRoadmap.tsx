"use client";

import { motion } from "framer-motion";
import { Briefcase, MapPin, Calendar, IndianRupee } from "lucide-react";
import SectionHeading from "./SectionHeading";

const internships = [
  {
    name: "B Salmon Naik",
    branch: "ECE",
    position: "Full Stack Developer",
    company: "CampusBuzz",
    duration: "6 months",
    location: "Hyderabad, India",
    stipend: "₹10,000/month",
    date: "Jan 2025",
  },
  {
    name: "B Charan",
    branch: "Mechanical Engineering",
    position: "Full Stack Developer",
    company: "Intern Pe",
    duration: "1 month",
    location: "Itanagar",
    stipend: "₹10,000/month",
    date: "Jan 2025",
  },
  {
    name: "Manasvi Sharma",
    branch: "CSE",
    position: "Software Intern",
    company: "Amazon",
    duration: "3 months",
    location: "Hyderabad, Telangana",
    stipend: "₹25,000/month",
    date: "Jan 2025",
  },
  {
    name: "Animesh Basak",
    branch: "CSE",
    position: "Software Intern",
    company: "Orangewood",
    duration: "3 months",
    location: "Noida, India",
    stipend: "₹10,000/month",
    date: "Feb 2025",
  },
  {
    name: "Sahil Hussain",
    branch: "CSE",
    position: "Software Intern",
    company: "GO Motive",
    duration: "3 months",
    location: "Bengaluru, Karnataka",
    stipend: "₹10,000/month",
    date: "Feb 2025",
  },
  {
    name: "Taga Tapang",
    branch: "CSE",
    position: "Software Intern",
    company: "C-DAC",
    duration: "3 months",
    location: "Mumbai, Maharashtra",
    stipend: "₹10,000/month",
    date: "Mar 2025",
  },
];

export default function InternshipRoadmap() {
  return (
    <section className="scroll-mt-20 bg-surface py-20 sm:py-28" id="internships">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Internships"
          title="Internship Journey 2025"
          subtitle="Students gaining industry experience through internship programs across India."
        />

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {internships.map((intern, i) => (
            <motion.div
              key={intern.name}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06, duration: 0.45, ease: "easeOut" }}
              viewport={{ once: true }}
              className="group rounded-2xl border border-line bg-surface p-6 shadow-soft transition-all duration-300 hover:bg-[#f8faff] hover:shadow-soft-hover"
            >
              {/* Header */}
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-navy/10 px-3 py-1 text-[11px] font-bold text-navy">
                  {intern.branch}
                </span>
                <span className="flex items-center gap-1 text-[12px] text-ink-muted">
                  <Calendar size={12} />
                  {intern.date}
                </span>
              </div>

              {/* Student & Company */}
              <h3 className="mt-4 text-[16px] font-bold text-ink">
                {intern.name}
              </h3>
              <div className="mt-2 flex items-center gap-2">
                <Briefcase size={14} className="text-ink-muted" />
                <span className="text-[14px] font-semibold text-navy">
                  {intern.company}
                </span>
              </div>
              <p className="mt-1 text-[13px] text-ink-soft">{intern.position}</p>

              {/* Details */}
              <div className="mt-4 space-y-2 border-t border-line pt-4">
                <div className="flex items-center gap-2 text-[13px] text-ink-muted">
                  <MapPin size={13} />
                  {intern.location}
                </div>
                <div className="flex items-center gap-2 text-[13px] text-ink-muted">
                  <IndianRupee size={13} />
                  {intern.stipend}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
