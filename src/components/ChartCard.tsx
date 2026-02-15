"use client";

import { ReactNode } from "react";

interface ChartCardProps {
  title: string;
  children: ReactNode;
}

export default function ChartCard({ title, children }: ChartCardProps) {
  return (
    <div className="glass-panel chart-card">
      <h3 className="chart-title">{title}</h3>
      <div style={{ position: "relative", zIndex: 2, width: "100%" }}>
        {children}
      </div>
    </div>
  );
}
