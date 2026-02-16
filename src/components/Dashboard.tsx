"use client";

import { useEffect, useState } from "react";
import MetricCard from "./MetricCard";
import ChartCard from "./ChartCard";
import AreaChart from "./AreaChart";
import { DataPoint, ChartColorConfig } from "@/lib/types";
import { getPercentChange } from "@/lib/mock-data";

const CHART_COLORS: Record<string, ChartColorConfig> = {
  mrr: { startColor: "#FF6B6B", endColor: "#EE5A9D", id: "mrr" },
  arr: { startColor: "#5E8BFF", endColor: "#7C6CF0", id: "arr" },
  polymarket: { startColor: "#34C759", endColor: "#30B0C7", id: "polymarket" },
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
      <div className="loading-container">
        <div className="loading-spinner" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="loading-container">
        <p style={{ color: "var(--text-tertiary)", fontSize: 15 }}>
          Failed to load data
        </p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <header style={{ marginBottom: 36 }}>
        <h1 className="header-title">TrackMRR</h1>
        <p className="header-subtitle">Business metrics at a glance</p>
      </header>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        <div className="stagger-1">
          <MetricCard
            label="Monthly Recurring Revenue"
            value={data.mrr.current}
            accentColor={CHART_COLORS.mrr.startColor}
            change={getPercentChange(data.mrr.history)}
            icon="M"
          />
        </div>
        <div className="stagger-2">
          <MetricCard
            label="Annual Recurring Revenue"
            value={data.arr.current}
            accentColor={CHART_COLORS.arr.startColor}
            change={getPercentChange(data.arr.history)}
            icon="A"
          />
        </div>
        <div className="stagger-3">
          <MetricCard
            label="Polymarket Portfolio"
            value={data.polymarket.current}
            accentColor={CHART_COLORS.polymarket.startColor}
            change={getPercentChange(data.polymarket.history)}
            icon="P"
          />
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
        <div className="stagger-4">
          <ChartCard title="MRR Over Time">
            <AreaChart
              data={data.mrr.history}
              colors={CHART_COLORS.mrr}
              height={220}
            />
          </ChartCard>
        </div>
        <div className="stagger-5">
          <ChartCard title="ARR Over Time">
            <AreaChart
              data={data.arr.history}
              colors={CHART_COLORS.arr}
              height={220}
            />
          </ChartCard>
        </div>
      </div>
      <div className="stagger-6">
        <ChartCard
          title="Polymarket Portfolio Value"
          link={{
            href: "https://polymarket.com/@0x200bFa9B0C67b7f626832b799C0cBeD7a2323BCC-1771269176504",
            label: "View on Polymarket →",
          }}
        >
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
