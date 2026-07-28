"use client";

import { motion } from "framer-motion";

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  subtitle?: string;
  align?: "center" | "left";
}

export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
}: SectionHeadingProps) {
  const centered = align === "center";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      viewport={{ once: true }}
      className={centered ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}
    >
      <div
        className={`flex items-center gap-2.5 ${
          centered ? "justify-center" : ""
        }`}
      >
        <span className="h-px w-6 bg-accent" />
        <span className="overline text-accent-dark">{eyebrow}</span>
      </div>

      <h2 className="mt-4 text-[28px] font-bold leading-[1.12] text-ink sm:text-[34px]">
        {title}
      </h2>

      {subtitle && (
        <p className="mt-3 text-[15px] leading-relaxed text-ink-muted sm:text-base">
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
