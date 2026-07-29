"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

const NAV_LINKS = [
  { name: "Home", href: "/" },
  { name: "Placements", href: "#placement-overview" },
  { name: "Departments", href: "#department-placements" },
  { name: "Recruiters", href: "#top-companies" },
  { name: "Why Recruit", href: "#why-recruit" },
  { name: "Our Team", href: "#tnp-team" },
  { name: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-all duration-300 ${
        scrolled
          ? "border-gray-200/60 bg-white/80 backdrop-blur-[10px] backdrop-saturate-[1.8]"
          : "border-transparent bg-white"
      }`}
    >
      <div className="mx-auto flex h-[68px] w-full max-w-screen-xl items-center justify-between px-4 sm:px-6">
        {/* Logo + Institute name */}
        <Link href="/" className="flex items-center gap-3.5">
          <Image
            src="/logo.png"
            alt="NIT Arunachal Pradesh"
            width={46}
            height={46}
            className="object-contain"
          />
          <div className="leading-tight">
            <p className="font-display text-[16px] font-bold tracking-tight text-ink">
              NIT Arunachal Pradesh
            </p>
            <p className="text-[12px] font-medium text-ink-muted">
              Training &amp; Placement Cell
            </p>
          </div>
        </Link>

        {/* Desktop links */}
        <nav className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="rounded-lg px-4 py-2 text-[14px] font-medium text-ink-soft transition-colors hover:bg-canvas hover:text-navy"
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Login button */}
        <Link
          href="/login"
          className="hidden rounded-xl bg-navy px-5 py-2.5 text-sm font-semibold text-white transition-shadow duration-300 hover:shadow-soft-hover lg:inline-flex"
        >
          Login
        </Link>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileOpen((v) => !v)}
          className="rounded-lg p-2 text-ink-soft transition-colors hover:bg-canvas lg:hidden"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-gray-100 bg-white px-4 pb-5 lg:hidden">
          <nav className="flex flex-col gap-0.5 pt-3">
            {NAV_LINKS.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-3 py-2.5 text-[14px] font-medium text-ink-soft transition-colors hover:bg-canvas hover:text-navy"
              >
                {item.name}
              </Link>
            ))}
          </nav>
          <Link
            href="/login"
            onClick={() => setMobileOpen(false)}
            className="mt-4 flex h-11 w-full items-center justify-center rounded-xl bg-navy text-[14px] font-semibold text-white"
          >
            Login
          </Link>
        </div>
      )}
    </header>
  );
}
