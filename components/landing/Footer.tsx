import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin, ArrowRight } from "lucide-react";

const quickLinks = [
  { name: "Home", href: "/" },
  { name: "Placements", href: "/placements" },
  { name: "Student Login", href: "/login" },
  { name: "Recruiter Login", href: "/login" },
  { name: "NIT AP Main Site", href: "https://www.nitap.ac.in" },
];

export default function Footer() {
  return (
    <footer id="contact" className="bg-navy-dark text-white">
      {/* CTA band */}
      <div className="border-b border-white/[0.08]">
        <div className="mx-auto flex max-w-screen-xl flex-col items-center justify-between gap-5 px-4 py-14 sm:flex-row sm:px-6">
          <div>
            <h3 className="font-display text-[22px] font-bold tracking-tight sm:text-2xl">
              Ready to begin your journey?
            </h3>
            <p className="mt-1.5 text-[14px] text-white/60">
              Log in to access placements, applications and interview updates.
            </p>
          </div>
          <Link
            href="/login"
            className="group inline-flex shrink-0 items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold text-navy shadow-lg transition-shadow duration-300 hover:shadow-2xl"
          >
            Get Started
            <ArrowRight
              size={16}
              className="transition-transform group-hover:translate-x-0.5"
            />
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-screen-xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 md:grid-cols-3">
          {/* Institute info */}
          <div>
            <div className="flex items-center gap-3.5">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10">
                <Image
                  src="/logo.png"
                  alt="NIT AP"
                  width={32}
                  height={32}
                  className="object-contain"
                />
              </span>
              <div className="leading-tight">
                <p className="font-display text-[15px] font-bold">
                  NIT Arunachal Pradesh
                </p>
                <p className="text-[12px] text-white/50">
                  Training &amp; Placement Cell
                </p>
              </div>
            </div>
            <p className="mt-5 max-w-sm text-[13px] leading-relaxed text-white/55">
              Facilitating industry interaction, campus placements and career
              development for students through structured, transparent processes.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-[0.14em] text-white/50">
              Quick Links
            </h4>
            <ul className="mt-5 space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-[13px] text-white/60 transition-colors hover:text-white"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-[0.14em] text-white/50">
              Contact Us
            </h4>
            <ul className="mt-5 space-y-4">
              <li className="flex items-center gap-3">
                <Mail size={14} className="shrink-0 text-white/40" />
                <span className="text-[13px] text-white/70">tnp@nitap.ac.in</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={14} className="shrink-0 text-white/40" />
                <span className="text-[13px] text-white/70">+91 9436290384</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={14} className="mt-0.5 shrink-0 text-white/40" />
                <span className="text-[13px] leading-relaxed text-white/70">
                  NIT Arunachal Pradesh
                  <br />
                  Jote, Papum Pare
                  <br />
                  Arunachal Pradesh – 791113
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-white/[0.08] pt-6 sm:flex-row">
          <p className="text-[12px] text-white/40">
            © {new Date().getFullYear()} NIT Arunachal Pradesh. All rights reserved.
          </p>
          <p className="text-[12px] text-white/40">
            Training &amp; Placement Cell Portal
          </p>
        </div>
      </div>
    </footer>
  );
}
