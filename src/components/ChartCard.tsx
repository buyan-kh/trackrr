"use client";

import { ReactNode } from "react";

interface ChartCardProps {
  title: string;
  children: ReactNode;
  link?: { href: string; label?: string };
}

export default function ChartCard({ title, children, link }: ChartCardProps) {
  return (
    <div className="glass-panel chart-card">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 12 }}>
        <h3 className="chart-title">{title}</h3>
        {link && (
          <a
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="chart-link"
            style={{
              fontSize: 13,
              color: "#30B0C7",
              textDecoration: "none",
              fontWeight: 500,
              whiteSpace: "nowrap",
            }}
          >
            {link.label ?? "View →"}
          </a>
        )}
      </div>
      <div style={{ position: "relative", zIndex: 2, width: "100%" }}>
        {children}
      </div>
    </div>
  );
}
