import Image from "next/image";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import LoginForm from "./LoginForm";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ message?: string; error?: string; email?: string }>;
}) {
  const params = await searchParams;
  const session = await getSession();

  if (session) {
    if (session.role === "ADMIN") redirect("/admin");
    if (session.role === "STUDENT") redirect("/student");
    redirect("/recruiter");
  }

  return (
    <div className="flex min-h-screen">
      {/* Left panel — branding */}
      <div className="relative hidden w-[42%] flex-col justify-between overflow-hidden bg-navy-dark p-10 lg:flex">
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: "url('/campus.jpg')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-navy-dark/60 via-navy/80 to-navy-dark" />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3.5">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm">
            <Image
              src="/logo.png"
              alt="NIT Arunachal Pradesh"
              width={44}
              height={44}
              className="object-contain"
            />
          </span>
          <div className="leading-tight">
            <p className="font-display text-[15px] font-bold text-white">
              NIT Arunachal Pradesh
            </p>
            <p className="text-[12px] text-white/50">
              Training &amp; Placement Cell
            </p>
          </div>
        </div>

        {/* Tagline */}
        <div className="relative z-10">
          <h2 className="font-display text-[32px] font-bold leading-tight tracking-tight text-white">
            Your career journey
            <br />
            starts here.
          </h2>
          <p className="mt-4 max-w-sm text-[14px] leading-relaxed text-white/60">
            Access placement drives, track applications, and connect with top
            recruiters through our structured placement portal.
          </p>
        </div>

        {/* Footer */}
        <p className="relative z-10 text-[12px] text-white/35">
          © {new Date().getFullYear()} NIT Arunachal Pradesh
        </p>
      </div>

      {/* Right panel — form */}
      <div className="flex flex-1 flex-col items-center justify-center bg-canvas px-4 py-10 sm:px-8">
        {/* Mobile logo */}
        <div className="mb-8 flex items-center gap-3 lg:hidden">
          <Image
            src="/logo.png"
            alt="NIT Arunachal Pradesh"
            width={40}
            height={40}
            className="object-contain"
          />
          <div className="leading-tight">
            <p className="font-display text-[15px] font-bold text-ink">
              NIT Arunachal Pradesh
            </p>
            <p className="text-[12px] text-ink-muted">
              Training &amp; Placement Cell
            </p>
          </div>
        </div>

        <div className="w-full max-w-[420px]">
          <LoginForm
            message={params.message}
            error={params.error}
            email={params.email}
          />
        </div>
      </div>
    </div>
  );
}
