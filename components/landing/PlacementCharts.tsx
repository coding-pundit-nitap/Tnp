"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  PolarAngleAxis,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const NAVY = "#003366";
const NAVY_SOFT = "#3a5f94";
const LINE = "#e4eaf3";
const RING_BG = "#e5eeff";
const INK_MUTED = "#6b7280";

/* ------------------------------------------------------------------ */
/*  Trend area chart                                                  */
/* ------------------------------------------------------------------ */
export interface TrendPoint {
  year: string;
  value: number;
}

interface TooltipPayload {
  value: number;
  payload: TrendPoint;
}

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: TooltipPayload[];
  label?: string;
}) {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div className="rounded-xl border border-line bg-white px-3.5 py-2.5 shadow-card">
      <p className="text-[11px] font-medium uppercase tracking-wide text-ink-muted">
        {label}
      </p>
      <p className="mt-0.5 text-sm font-bold text-navy tabular-nums">
        {payload[0].value.toFixed(1)}% placed
      </p>
    </div>
  );
}

export function TrendChart({ data }: { data: TrendPoint[] }) {
  return (
    <div className="h-[240px] w-full sm:h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 24, right: 12, left: -16, bottom: 4 }}
        >
          <defs>
            <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={NAVY} stopOpacity={0.2} />
              <stop offset="100%" stopColor={NAVY} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            vertical={false}
            strokeDasharray="3 6"
            stroke={LINE}
          />
          <XAxis
            dataKey="year"
            tickLine={false}
            axisLine={false}
            tick={{ fill: INK_MUTED, fontSize: 12 }}
            dy={8}
          />
          <YAxis
            domain={[78, 98]}
            tickLine={false}
            axisLine={false}
            tick={{ fill: INK_MUTED, fontSize: 12 }}
            tickFormatter={(v) => `${v}%`}
            width={44}
          />
          <Tooltip
            content={<ChartTooltip />}
            cursor={{ stroke: NAVY_SOFT, strokeDasharray: "4 4" }}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke={NAVY}
            strokeWidth={3}
            fill="url(#trendFill)"
            dot={{ r: 4, fill: "#ffffff", stroke: NAVY, strokeWidth: 2.5 }}
            activeDot={{ r: 6, fill: NAVY, stroke: "#ffffff", strokeWidth: 2 }}
            animationDuration={1300}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Radial gauge                                                      */
/* ------------------------------------------------------------------ */
export function Gauge({
  value,
  label,
  sublabel,
}: {
  value: number;
  label: string;
  sublabel: string;
}) {
  const data = [{ name: label, value }];
  return (
    <div className="flex flex-col items-center text-center">
      <div className="relative h-[128px] w-[128px]">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart
            data={data}
            innerRadius="76%"
            outerRadius="100%"
            startAngle={90}
            endAngle={-270}
          >
            <PolarAngleAxis
              type="number"
              domain={[0, 100]}
              angleAxisId={0}
              tick={false}
            />
            <RadialBar
              background={{ fill: RING_BG }}
              dataKey="value"
              cornerRadius={20}
              fill={NAVY}
              angleAxisId={0}
              animationDuration={1300}
            />
          </RadialBarChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-display text-2xl font-bold tracking-tight text-ink tabular-nums">
            {value}%
          </span>
        </div>
      </div>
      <p className="mt-3 text-sm font-semibold text-ink">{label}</p>
      <p className="text-[12px] text-ink-muted">{sublabel}</p>
    </div>
  );
}
