"use client";

import { ReactNode } from "react";

interface ChartCardProps {
  title: string;
  children: ReactNode;
}

export default function ChartCard({ title, children }: ChartCardProps) {
  return (
    <div className="chart-card">
      <h3 className="text-sm font-semibold tracking-wide uppercase text-gray-400 mb-4 px-1">
        {title}
      </h3>
      <div className="w-full">{children}</div>
    </div>
  );
}
