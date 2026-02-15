"use client";

interface MetricCardProps {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  change?: number;
  accentColor: string;
  icon?: string;
}

export default function MetricCard({
  label,
  value,
  prefix = "$",
  suffix,
  change,
  accentColor,
  icon,
}: MetricCardProps) {
  const formattedValue = value.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

  const changeClass =
    change !== undefined && change > 0
      ? "positive"
      : change !== undefined && change < 0
      ? "negative"
      : "neutral";

  return (
    <div className="glass-panel metric-card">
      <div style={{ position: "relative", zIndex: 2, display: "flex", flexDirection: "column", gap: 10 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span className="metric-label">{label}</span>
          {icon && (
            <div
              className="metric-icon"
              style={{ background: `${accentColor}15`, color: accentColor }}
            >
              <span style={{ fontWeight: 700, fontSize: 14 }}>{icon}</span>
            </div>
          )}
        </div>
        <span className="metric-value">
          {prefix}
          {formattedValue}
          {suffix}
        </span>
        {change !== undefined && (
          <span className={`metric-change ${changeClass}`}>
            {change > 0 ? "\u2191 " : change < 0 ? "\u2193 " : ""}
            {change > 0 ? "+" : ""}
            {change}%
          </span>
        )}
      </div>
    </div>
  );
}
