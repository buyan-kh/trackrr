"use client";

import { useEffect, useState } from "react";
import MetricCard from "./MetricCard";
import ChartCard from "./ChartCard";
import AreaChart from "./AreaChart";
import { DataPoint, ChartColorConfig } from "@/lib/types";
import { getPercentChange } from "@/lib/mock-data";

const CHART_COLORS: Record<string, ChartColorConfig> = {
  mrr: { startColor: "#FF6B6B", endColor: "#EE5A9D", id: "mrr" },
  arr: { startColor: "#4F8CFF", endColor: "#6C5CE7", id: "arr" },
  polymarket: { startColor: "#00D2A0", endColor: "#0097A7", id: "polymarket" },
};

interface DashboardData {
  mrr: { current: number; history: DataPoint[] };
  arr: { current: number; history: DataPoint[] };
  polymarket: { current: number; history: DataPoint[] };
}

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [stripeRes, polyRes] = await Promise.all([
          fetch("/api/stripe"),
          fetch("/api/polymarket"),
        ]);
        const stripeData = await stripeRes.json();
        const polyData = await polyRes.json();

        setData({
          mrr: stripeData.mrr,
          arr: stripeData.arr,
          polymarket: polyData.portfolio,
        });
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-gray-300 text-lg font-display">
          Loading...
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-400 text-lg">Failed to load data</div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <header className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 font-display">
          TrackMRR
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          Business metrics at a glance
        </p>
      </header>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        <MetricCard
          label="Monthly Recurring Revenue"
          value={data.mrr.current}
          accentColor={CHART_COLORS.mrr.startColor}
          change={getPercentChange(data.mrr.history)}
        />
        <MetricCard
          label="Annual Recurring Revenue"
          value={data.arr.current}
          accentColor={CHART_COLORS.arr.startColor}
          change={getPercentChange(data.arr.history)}
        />
        <MetricCard
          label="Polymarket Portfolio"
          value={data.polymarket.current}
          accentColor={CHART_COLORS.polymarket.startColor}
          change={getPercentChange(data.polymarket.history)}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <ChartCard title="MRR Over Time">
          <AreaChart
            data={data.mrr.history}
            colors={CHART_COLORS.mrr}
            height={220}
          />
        </ChartCard>
        <ChartCard title="ARR Over Time">
          <AreaChart
            data={data.arr.history}
            colors={CHART_COLORS.arr}
            height={220}
          />
        </ChartCard>
      </div>
      <div className="grid grid-cols-1 gap-6">
        <ChartCard title="Polymarket Portfolio Value">
          <AreaChart
            data={data.polymarket.history}
            colors={CHART_COLORS.polymarket}
            height={260}
          />
        </ChartCard>
      </div>
    </div>
  );
}
