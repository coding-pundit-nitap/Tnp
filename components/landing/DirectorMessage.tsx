"use client";

import { motion } from "framer-motion";
import SectionHeading from "./SectionHeading";

export default function DirectorMessage() {
  return (
    <section className="scroll-mt-20 bg-surface py-20 sm:py-28">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Message"
          title="From the Director's Desk"
          subtitle="A word from our Director on the institute's vision for training and placement."
        />

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          viewport={{ once: true }}
          className="mt-14 grid overflow-hidden rounded-2xl border border-line bg-surface shadow-soft lg:grid-cols-3"
        >
          {/* Director photo + info */}
          <div className="flex flex-col items-center justify-center bg-navy p-8 text-center lg:p-10">
            <div className="h-32 w-32 overflow-hidden rounded-full border-4 border-white/20">
              <img
                src="https://res.cloudinary.com/dniihkck2/image/upload/v1749371321/310243512_misgnm.jpg"
                alt="Prof. Mohan V Aware"
                className="h-full w-full object-cover"
              />
            </div>
            <h3 className="mt-5 text-lg font-bold text-white">
              Prof. Mohan V Aware
            </h3>
            <p className="mt-1 text-sm text-white/70">
              Director, NIT Arunachal Pradesh
            </p>
          </div>

          {/* Message content */}
          <div className="p-8 sm:p-10 lg:col-span-2">
            <p className="text-[15px] leading-7 text-ink-soft">
              The National Institute of Technology, Arunachal Pradesh was
              inaugurated on 18th August, 2010 as a member of a group of ten new
              NITs established by the Government of India under the Ministry of
              Education. Since its inception, the institute has been committed to
              nurturing young minds and preparing them for leadership roles in
              technology and innovation.
            </p>
            <p className="mt-4 text-[15px] leading-7 text-ink-soft">
              Our Training &amp; Placement Cell serves as a vital bridge between
              academia and industry. It works tirelessly to ensure that our
              students are well-equipped with the skills, exposure, and
              opportunities needed to excel in their professional careers. With
              growing industry partnerships and consistent improvement in
              placement records, we are proud of the progress we continue to
              make.
            </p>
            <p className="mt-4 text-[15px] leading-7 text-ink-soft">
              I encourage all stakeholders — students, faculty, and recruiters —
              to actively engage with the T&amp;P Cell and contribute to making
              our placement ecosystem more robust and rewarding.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
