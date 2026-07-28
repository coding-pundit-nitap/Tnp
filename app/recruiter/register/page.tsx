"use client";

import { registerRecruiter } from "@/actions/recruiter";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { CheckCircle } from "lucide-react";

export default function RecruiterRegisterPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    company: "",
    contactName: "",
    phone: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    if (!formData.company) newErrors.company = "Company name is required";
    if (!formData.contactName) newErrors.contactName = "Contact name is required";
    if (!formData.phone || formData.phone.length < 10) {
      newErrors.phone = "Valid phone number required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const result = await registerRecruiter(formData);
      if (result.success) {
        setSubmitted(true);
      } else {
        setErrors({ form: result.error });
      }
    } catch (error: any) {
      setErrors({ form: error.message });
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-canvas px-4">
        <div className="w-full max-w-md rounded-2xl border border-line bg-surface p-8 text-center shadow-soft">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50">
            <CheckCircle size={28} className="text-emerald-600" />
          </span>
          <h2 className="mt-5 font-display text-xl font-bold text-ink">
            Registration Submitted!
          </h2>
          <p className="mt-2 text-[14px] text-ink-soft">
            Thank you for registering. Please verify your email and wait for
            admin approval.
          </p>
          <p className="mt-3 text-[13px] text-ink-muted">
            You will receive a verification code and another email once approved.
          </p>
          <Link
            href="/login"
            className="mt-6 inline-block text-[14px] font-semibold text-navy hover:underline"
          >
            Back to Login
          </Link>
        </div>
      </div>
    );
  }

  const inputClass =
    "h-11 w-full rounded-xl border border-line bg-surface px-4 text-[14px] text-ink outline-none transition-all duration-200 placeholder:text-ink-muted/50 hover:border-line-strong focus:border-navy focus:ring-2 focus:ring-navy/10";

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
            Hire the best
            <br />
            talent from NIT AP.
          </h2>
          <p className="mt-4 max-w-sm text-[14px] leading-relaxed text-white/60">
            Register as a recruiter to post jobs, manage applications, and
            conduct placement drives seamlessly.
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
            Recruiter Registration
          </h1>
          <p className="mt-1.5 text-[14px] text-ink-muted">
            Create your recruiter account to begin hiring.
          </p>

          {errors.form && (
            <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
              <p className="text-sm font-medium text-red-800">{errors.form}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-7 space-y-5">
            <div>
              <label htmlFor="email" className="mb-2 block text-[13px] font-semibold text-ink-soft">
                Email Address
              </label>
              <input
                id="email" name="email" type="email" required
                value={formData.email} onChange={handleChange}
                className={inputClass}
                placeholder="recruiter@company.com"
              />
              {errors.email && <p className="mt-1.5 text-[12px] font-medium text-red-600">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="company" className="mb-2 block text-[13px] font-semibold text-ink-soft">
                Company Name
              </label>
              <input
                id="company" name="company" type="text" required
                value={formData.company} onChange={handleChange}
                className={inputClass}
                placeholder="e.g., Google, Microsoft"
              />
              {errors.company && <p className="mt-1.5 text-[12px] font-medium text-red-600">{errors.company}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="contactName" className="mb-2 block text-[13px] font-semibold text-ink-soft">
                  Contact Person
                </label>
                <input
                  id="contactName" name="contactName" type="text" required
                  value={formData.contactName} onChange={handleChange}
                  className={inputClass}
                  placeholder="Full name"
                />
                {errors.contactName && <p className="mt-1.5 text-[12px] font-medium text-red-600">{errors.contactName}</p>}
              </div>
              <div>
                <label htmlFor="phone" className="mb-2 block text-[13px] font-semibold text-ink-soft">
                  Phone Number
                </label>
                <input
                  id="phone" name="phone" type="tel" required
                  value={formData.phone} onChange={handleChange}
                  className={inputClass}
                  placeholder="+91 XXXXX XXXXX"
                />
                {errors.phone && <p className="mt-1.5 text-[12px] font-medium text-red-600">{errors.phone}</p>}
              </div>
            </div>

            <div>
              <label htmlFor="password" className="mb-2 block text-[13px] font-semibold text-ink-soft">
                Password
              </label>
              <input
                id="password" name="password" type="password" required
                value={formData.password} onChange={handleChange}
                className={inputClass}
                placeholder="Minimum 6 characters"
              />
              {errors.password && <p className="mt-1.5 text-[12px] font-medium text-red-600">{errors.password}</p>}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="mb-2 block text-[13px] font-semibold text-ink-soft">
                Confirm Password
              </label>
              <input
                id="confirmPassword" name="confirmPassword" type="password" required
                value={formData.confirmPassword} onChange={handleChange}
                className={inputClass}
                placeholder="Re-enter password"
              />
              {errors.confirmPassword && <p className="mt-1.5 text-[12px] font-medium text-red-600">{errors.confirmPassword}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 h-12 w-full rounded-xl bg-navy text-[14px] font-bold text-white transition-shadow duration-300 hover:shadow-soft-hover disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Registering..." : "Register"}
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
