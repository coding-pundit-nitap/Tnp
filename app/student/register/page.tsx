import { registerStudentAction } from "@/actions/register";
import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";

export default async function StudentRegisterPage() {
  const session = await getSession();
  if (session) {
    if (session.role === "ADMIN") redirect("/admin");
    if (session.role === "STUDENT") redirect("/student");
    redirect("/recruiter");
  }

  return (
    <div className="flex min-h-screen">
      {/* Left branding panel */}
      <div className="relative hidden w-[42%] flex-col justify-between overflow-hidden bg-navy-dark p-10 lg:flex">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: "url('/campus.jpg')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-navy-dark/60 via-navy/80 to-navy-dark" />

        <div className="relative z-10 flex items-center gap-3.5">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm">
            <Image src="/logo.png" alt="NIT AP" width={44} height={44} className="object-contain" />
          </span>
          <div className="leading-tight">
            <p className="font-display text-[15px] font-bold text-white">NIT Arunachal Pradesh</p>
            <p className="text-[12px] text-white/50">Training &amp; Placement Cell</p>
          </div>
        </div>

        <div className="relative z-10">
          <h2 className="font-display text-[32px] font-bold leading-tight tracking-tight text-white">
            Join the placement
            <br />
            network.
          </h2>
          <p className="mt-4 max-w-sm text-[14px] leading-relaxed text-white/60">
            Register to access campus drives, track your applications, and land
            your dream role.
          </p>
        </div>

        <p className="relative z-10 text-[12px] text-white/35">
          © {new Date().getFullYear()} NIT Arunachal Pradesh
        </p>
      </div>

      {/* Right form panel */}
      <div className="flex flex-1 flex-col items-center justify-center bg-canvas px-4 py-10 sm:px-8">
        {/* Mobile logo */}
        <div className="mb-8 flex items-center gap-3 lg:hidden">
          <Image src="/logo.png" alt="NIT AP" width={40} height={40} className="object-contain" />
          <div className="leading-tight">
            <p className="font-display text-[15px] font-bold text-ink">NIT Arunachal Pradesh</p>
            <p className="text-[12px] text-ink-muted">Training &amp; Placement Cell</p>
          </div>
        </div>

        <div className="w-full max-w-[480px]">
          <h1 className="font-display text-[26px] font-bold tracking-tight text-ink">
            Student Registration
          </h1>
          <p className="mt-1.5 text-[14px] text-ink-muted">
            Create your account to get started.
          </p>

          <form action={registerStudentAction} className="mt-7 space-y-5">
            <div>
              <label htmlFor="name" className="mb-2 block text-[13px] font-semibold text-ink-soft">
                Full Name
              </label>
              <input
                id="name" name="name" type="text" required
                className="h-11 w-full rounded-xl border border-line bg-surface px-4 text-[14px] text-ink outline-none transition-all duration-200 placeholder:text-ink-muted/50 hover:border-line-strong focus:border-navy focus:ring-2 focus:ring-navy/10"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label htmlFor="email" className="mb-2 block text-[13px] font-semibold text-ink-soft">
                Email Address <span className="font-normal text-ink-muted">(must be @nitap.ac.in)</span>
              </label>
              <input
                id="email" name="email" type="email" required
                className="h-11 w-full rounded-xl border border-line bg-surface px-4 text-[14px] text-ink outline-none transition-all duration-200 placeholder:text-ink-muted/50 hover:border-line-strong focus:border-navy focus:ring-2 focus:ring-navy/10"
                placeholder="yourname.dept.23@nitap.ac.in"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="branch" className="mb-2 block text-[13px] font-semibold text-ink-soft">
                  Branch
                </label>
                <input
                  id="branch" name="branch" type="text" required
                  className="h-11 w-full rounded-xl border border-line bg-surface px-4 text-[14px] text-ink outline-none transition-all duration-200 placeholder:text-ink-muted/50 hover:border-line-strong focus:border-navy focus:ring-2 focus:ring-navy/10"
                  placeholder="CSE, ECE, ME"
                />
              </div>
              <div>
                <label htmlFor="year" className="mb-2 block text-[13px] font-semibold text-ink-soft">
                  Year
                </label>
                <select
                  id="year" name="year" required
                  className="h-11 w-full rounded-xl border border-line bg-surface px-4 text-[14px] text-ink outline-none transition-all duration-200 hover:border-line-strong focus:border-navy focus:ring-2 focus:ring-navy/10"
                >
                  <option value="">Select</option>
                  <option value="1">1st Year</option>
                  <option value="2">2nd Year</option>
                  <option value="3">3rd Year</option>
                  <option value="4">4th Year</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="cgpa" className="mb-2 block text-[13px] font-semibold text-ink-soft">
                CGPA <span className="font-normal text-ink-muted">(0.0 – 10.0)</span>
              </label>
              <input
                id="cgpa" name="cgpa" type="number" step="0.01" min="0" max="10" required
                className="h-11 w-full rounded-xl border border-line bg-surface px-4 text-[14px] text-ink outline-none transition-all duration-200 placeholder:text-ink-muted/50 hover:border-line-strong focus:border-navy focus:ring-2 focus:ring-navy/10"
                placeholder="7.50"
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-2 block text-[13px] font-semibold text-ink-soft">
                Password
              </label>
              <input
                id="password" name="password" type="password" required
                className="h-11 w-full rounded-xl border border-line bg-surface px-4 text-[14px] text-ink outline-none transition-all duration-200 placeholder:text-ink-muted/50 hover:border-line-strong focus:border-navy focus:ring-2 focus:ring-navy/10"
                placeholder="••••••••"
              />
              <p className="mt-1 text-[12px] text-ink-muted">At least 8 characters</p>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="mb-2 block text-[13px] font-semibold text-ink-soft">
                Confirm Password
              </label>
              <input
                id="confirmPassword" name="confirmPassword" type="password" required
                className="h-11 w-full rounded-xl border border-line bg-surface px-4 text-[14px] text-ink outline-none transition-all duration-200 placeholder:text-ink-muted/50 hover:border-line-strong focus:border-navy focus:ring-2 focus:ring-navy/10"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              className="mt-2 h-12 w-full rounded-xl bg-navy text-[14px] font-bold text-white transition-shadow duration-300 hover:shadow-soft-hover"
            >
              Create Account
            </button>
          </form>

          <div className="mt-6 border-t border-line pt-5 text-center">
            <p className="text-[13px] text-ink-muted">
              Already have an account?{" "}
              <Link href="/login" className="font-semibold text-navy hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
