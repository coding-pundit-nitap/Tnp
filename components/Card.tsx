"use client";

import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  title?: string;
}

export default function Card({ children, className = "", title }: CardProps) {
  return (
    <div
      className={`rounded-2xl border border-line bg-surface p-6 shadow-soft sm:p-8 ${className}`}
    >
      {title && (
        <h2 className="mb-6 font-display text-xl font-bold tracking-tight text-ink">
          {title}
        </h2>
      )}
      {children}
    </div>
  );
}
