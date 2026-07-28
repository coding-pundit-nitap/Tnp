"use client";

import { ReactNode } from "react";

interface FormInputProps {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  value?: string | number;
  onChange?: (e: any) => void;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  maxLength?: number;
  multiline?: boolean;
  rows?: number;
  children?: ReactNode;
}

export default function FormInput({
  label,
  name,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  required = false,
  disabled = false,
  maxLength,
  multiline = false,
  rows = 4,
  children,
}: FormInputProps) {
  const baseStyles =
    "h-11 w-full rounded-xl border border-line bg-surface px-4 text-[14px] text-ink outline-none transition-all duration-200 placeholder:text-ink-muted/50 hover:border-line-strong focus:border-navy focus:ring-2 focus:ring-navy/10 disabled:cursor-not-allowed disabled:bg-canvas disabled:text-ink-muted";

  return (
    <div>
      <label
        htmlFor={name}
        className="mb-2 block text-[13px] font-semibold text-ink-soft"
      >
        {label}
        {required && <span className="ml-0.5 text-red-500">*</span>}
      </label>

      {multiline ? (
        <textarea
          id={name}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange as any}
          disabled={disabled}
          maxLength={maxLength}
          rows={rows}
          className={`${baseStyles} h-auto py-3`}
        />
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          maxLength={maxLength}
          className={baseStyles}
          required={required}
        />
      )}

      {children}

      {error && (
        <p className="mt-1.5 text-[12px] font-medium text-red-600">{error}</p>
      )}
    </div>
  );
}
