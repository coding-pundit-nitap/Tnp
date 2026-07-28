"use client";

import { motion } from "framer-motion";
import { Mail, Phone } from "lucide-react";
import SectionHeading from "./SectionHeading";

const team = [
  {
    name: "Prof. (Dr.) Mihir Kumar Shome",
    role: "Faculty In-Charge, T&P Cell",
    img: "/mihr.jpg",
    email: "mihir@nitap.ac.in",
    phone: "+91 9911618801",
  },
  {
    name: "Dr. Dipak Sen",
    role: "Faculty Coordinator",
    img: "/deepak sen.jpg",
    email: "dipak@nitap.ac.in",
    phone: "+91 9485231949",
  },
  {
    name: "Dr. Tushar Dhabal Das",
    role: "Faculty Coordinator",
    img: "/td das.jpg",
    email: "tddas@nitap.ac.in",
    phone: "+91 9402618737",
  },
  {
    name: "Dr. Brajagopal Datta",
    role: "Faculty Coordinator",
    img: "/datta.jpg",
    email: "brajagopal@nitap.ac.in",
    phone: "+91 9402768977",
  },
];

export default function TnpTeam() {
  return (
    <section id="tnp-team" className="scroll-mt-20 bg-canvas py-20 sm:py-28">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Our Team"
          title="T&P Office Team"
          subtitle="Dedicated faculty ensuring excellent career opportunities for every student."
        />

        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {team.map((m, i) => (
            <motion.div
              key={m.name}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07, duration: 0.45, ease: "easeOut" }}
              viewport={{ once: true }}
              className="group flex flex-col items-center overflow-hidden rounded-2xl border border-gray-100 bg-surface px-5 pb-6 pt-8 shadow-soft transition-all duration-300 hover:bg-[#f8faff] hover:shadow-soft-hover"
            >
              {/* Photo */}
              <div className="h-[120px] w-[100px] overflow-hidden rounded-xl bg-surface-mid">
                <img
                  src={m.img}
                  alt={m.name}
                  className="h-full w-full object-cover object-top"
                />
              </div>

              {/* Name & role — centered, clear hierarchy */}
              <h3 className="mt-5 text-center text-[15px] font-bold leading-tight text-ink">
                {m.name}
              </h3>
              <p className="mt-1.5 text-center text-[12px] font-semibold uppercase tracking-wide text-navy/70">
                {m.role}
              </p>

              {/* Contact — clean sub-box, left-aligned inside */}
              <div className="mt-auto w-full pt-5">
                <div className="w-full rounded-lg bg-canvas/80 px-4 py-3">
                  <a
                    href={`mailto:${m.email}`}
                    className="flex items-center gap-2.5 text-[13px] leading-none text-ink-soft transition-colors hover:text-navy"
                  >
                    <Mail size={14} className="shrink-0 text-ink-muted" />
                    <span className="truncate">{m.email}</span>
                  </a>
                  <div className="mt-2.5 flex items-center gap-2.5 text-[13px] leading-none text-ink-muted">
                    <Phone size={14} className="shrink-0" />
                    <span>{m.phone}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
