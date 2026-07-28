"use client";

import { loginAction } from "@/actions/auth";
import Link from "next/link";
import { useState } from "react";

interface LoginFormProps {
  message?: string;
  error?: string;
  email?: string;
}

export default function LoginForm({ message, error, email }: LoginFormProps) {
  const [selectedRole, setSelectedRole] = useState<
    "STUDENT" | "RECRUITER" | "ADMIN"
  >("STUDENT");

  const placeholders = {
    STUDENT: "yourname.dept.23@nitap.ac.in",
    RECRUITER: "yourcompany@mail.com",
    ADMIN: "admin@nitap.ac.in",
  };

  const roles = [
    { value: "STUDENT" as const, label: "Student" },
    { value: "RECRUITER" as const, label: "Recruiter" },
    { value: "ADMIN" as const, label: "Admin" },
  ];

  return (
    <>
      {/* Development notice */}
      <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
        <p className="text-[13px] font-medium text-amber-800">
          🚧 This portal is currently under development. Some features may not be available yet.
        </p>
      </div>

      {/* Alerts */}
      {message && (
        <div className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
          <p className="text-sm font-medium text-emerald-800">{message}</p>
        </div>
      )}
      {error && (
        <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
          <p className="text-sm font-medium text-red-800">{error}</p>
        </div>
      )}

      {/* Header */}
      <h1 className="font-display text-[26px] font-bold tracking-tight text-ink">
        Sign in
      </h1>
      <p className="mt-1.5 text-[14px] text-ink-muted">
        Enter your credentials to access the portal.
      </p>

      {/* Role selector */}
      <div className="mt-7 grid grid-cols-3 gap-1 rounded-xl bg-surface-mid p-1">
        {roles.map((role) => (
          <label
            key={role.value}
            className={`cursor-pointer rounded-lg px-3 py-2.5 text-center text-[13px] font-semibold transition-all duration-200 ${
              selectedRole === role.value
                ? "bg-surface text-navy shadow-soft"
                : "text-ink-muted hover:text-ink-soft"
            }`}
          >
            <input
              type="radio"
              name="roleSelect"
              value={role.value}
              checked={selectedRole === role.value}
              onChange={(e) =>
                setSelectedRole(e.target.value as typeof selectedRole)
              }
              className="hidden"
            />
            {role.label}
          </label>
        ))}
      </div>

      {/* Form */}
      <form action={loginAction} className="mt-7 space-y-5">
        <input type="hidden" name="role" value={selectedRole} />

        <div>
          <label
            htmlFor="email"
            className="mb-2 block text-[13px] font-semibold text-ink-soft"
          >
            Email Address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            defaultValue={email}
            className="h-12 w-full rounded-xl border border-line bg-surface px-4 text-[14px] text-ink outline-none transition-all duration-200 placeholder:text-ink-muted/50 hover:border-line-strong focus:border-navy focus:ring-2 focus:ring-navy/10"
            placeholder={placeholders[selectedRole]}
            key={selectedRole}
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="mb-2 block text-[13px] font-semibold text-ink-soft"
          >
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            className="h-12 w-full rounded-xl border border-line bg-surface px-4 text-[14px] text-ink outline-none transition-all duration-200 placeholder:text-ink-muted/50 hover:border-line-strong focus:border-navy focus:ring-2 focus:ring-navy/10"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          className="mt-2 h-12 w-full rounded-xl bg-navy text-[14px] font-bold text-white transition-shadow duration-300 hover:shadow-soft-hover"
        >
          Sign In
        </button>
      </form>

      {/* Register links */}
      <div className="mt-8 border-t border-line pt-6">
        <p className="text-center text-[13px] text-ink-muted">
          Don't have an account?
        </p>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <Link
            href="/student/register"
            className="rounded-xl border border-line bg-surface px-4 py-2.5 text-center text-[13px] font-semibold text-ink-soft transition-all duration-200 hover:border-navy/25 hover:bg-[#f8faff] hover:text-navy"
          >
            Student Signup
          </Link>
          <Link
            href="/recruiter/register"
            className="rounded-xl border border-line bg-surface px-4 py-2.5 text-center text-[13px] font-semibold text-ink-soft transition-all duration-200 hover:border-navy/25 hover:bg-[#f8faff] hover:text-navy"
          >
            Recruiter Signup
          </Link>
        </div>
      </div>
    </>
  );
}
