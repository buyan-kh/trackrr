import { DataPoint } from "./types";

function generateMonthlyDates(months: number): string[] {
  const dates: string[] = [];
  const now = new Date();
  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    dates.push(d.toISOString().split("T")[0]);
  }
  return dates;
}

export function generateMRRData(): DataPoint[] {
  const dates = generateMonthlyDates(12);
  return dates.map((date) => ({
    date,
    value: 0,
  }));
}

export function generateARRData(): DataPoint[] {
  return generateMRRData().map((point) => ({
    date: point.date,
    value: point.value * 12,
  }));
}

export function generatePolymarketData(): DataPoint[] {
  const dates = generateMonthlyDates(12);
  // Mock Polymarket portfolio with some realistic fluctuation
  let value = 500;
  return dates.map((date, i) => {
    if (i > 0) {
      const change = (Math.random() - 0.4) * 150;
      value = Math.max(0, value + change);
    }
    return {
      date,
      value: Math.round(value * 100) / 100,
    };
  });
}

export function getCurrentMRR(): number {
  return 0;
}

export function getCurrentARR(): number {
  return 0;
}

export function getCurrentPolymarketValue(data: DataPoint[]): number {
  return data.length > 0 ? data[data.length - 1].value : 0;
}

export function getPercentChange(data: DataPoint[]): number {
  if (data.length < 2) return 0;
  const current = data[data.length - 1].value;
  const previous = data[data.length - 2].value;
  if (previous === 0) return current === 0 ? 0 : 100;
  return Math.round(((current - previous) / previous) * 100 * 10) / 10;
}
