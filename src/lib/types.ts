export interface DataPoint {
  date: string;
  value: number;
}

export interface MetricData {
  label: string;
  currentValue: number;
  previousValue: number;
  prefix?: string;
  suffix?: string;
  history: DataPoint[];
}

export interface ChartColorConfig {
  startColor: string;
  endColor: string;
  id: string;
}
