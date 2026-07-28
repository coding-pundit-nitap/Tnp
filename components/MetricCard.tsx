"use client";

import React from "react";

interface MetricCardProps {
  label: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  color?: "blue" | "green" | "red" | "yellow" | "purple" | "indigo";
  trend?: { value: number; isPositive: boolean };
}

const colorClasses = {
  blue: "bg-blue-50 border-blue-200 text-blue-900",
  green: "bg-green-50 border-green-200 text-green-900",
  red: "bg-red-50 border-red-200 text-red-900",
  yellow: "bg-yellow-50 border-yellow-200 text-yellow-900",
  purple: "bg-purple-50 border-purple-200 text-purple-900",
  indigo: "bg-indigo-50 border-indigo-200 text-indigo-900",
};

const iconColorClasses = {
  blue: "text-blue-600 bg-blue-100",
  green: "text-green-600 bg-green-100",
  red: "text-red-600 bg-red-100",
  yellow: "text-yellow-600 bg-yellow-100",
  purple: "text-purple-600 bg-purple-100",
  indigo: "text-indigo-600 bg-indigo-100",
};

export default function MetricCard({
  label,
  value,
  subtitle,
  icon,
  color = "indigo",
  trend,
}: MetricCardProps) {
  return (
    <div className={`rounded-lg border p-6 ${colorClasses[color]}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium opacity-75">{label}</p>
          <p className="mt-2 text-3xl font-bold">{value}</p>
          {subtitle && <p className="mt-1 text-sm opacity-75">{subtitle}</p>}
          {trend && (
            <div className="mt-2 flex items-center gap-1">
              <span
                className={trend.isPositive ? "text-green-600" : "text-red-600"}
              >
                {trend.isPositive ? "↑" : "↓"}
              </span>
              <span
                className={`text-sm font-medium ${trend.isPositive ? "text-green-600" : "text-red-600"}`}
              >
                {Math.abs(trend.value)}%
              </span>
            </div>
          )}
        </div>
        {icon && (
          <div className={`rounded-full p-3 ${iconColorClasses[color]}`}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
