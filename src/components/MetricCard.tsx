"use client";

interface MetricCardProps {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  change?: number;
  accentColor: string;
}

export default function MetricCard({
  label,
  value,
  prefix = "$",
  suffix,
  change,
  accentColor,
}: MetricCardProps) {
  const formattedValue = value.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

  return (
    <div className="metric-card group">
      <div
        className="metric-accent"
        style={{ background: accentColor }}
      />
      <div className="flex flex-col gap-1">
        <span className="text-xs font-medium tracking-wide uppercase text-gray-400">
          {label}
        </span>
        <span className="text-3xl font-bold tracking-tight text-gray-900 font-display">
          {prefix}
          {formattedValue}
          {suffix}
        </span>
        {change !== undefined && (
          <span
            className={`text-xs font-semibold ${
              change > 0
                ? "text-emerald-500"
                : change < 0
                ? "text-red-400"
                : "text-gray-400"
            }`}
          >
            {change > 0 ? "+" : ""}
            {change}% from last month
          </span>
        )}
      </div>
    </div>
  );
}
