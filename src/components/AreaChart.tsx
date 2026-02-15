"use client";

import { useCallback, useMemo, useState } from "react";
import { AreaClosed, LinePath, Bar } from "@visx/shape";
import { curveMonotoneX } from "@visx/curve";
import { scaleTime, scaleLinear } from "@visx/scale";
import { LinearGradient } from "@visx/gradient";
import { localPoint } from "@visx/event";
import { bisector } from "@visx/vendor/d3-array";
import { ParentSize } from "@visx/responsive";
import { DataPoint, ChartColorConfig } from "@/lib/types";

const getDate = (d: DataPoint) => new Date(d.date);
const getValue = (d: DataPoint) => d.value;
const bisectDate = bisector<DataPoint, Date>((d) => new Date(d.date)).left;

const margin = { top: 40, right: 0, bottom: 0, left: 0 };

interface AreaChartInnerProps {
  data: DataPoint[];
  colors: ChartColorConfig;
  width: number;
  height: number;
  prefix?: string;
}

function AreaChartInner({
  data,
  colors,
  width,
  height,
  prefix = "$",
}: AreaChartInnerProps) {
  const [hovered, setHovered] = useState<DataPoint | null>(null);
  const [hoverX, setHoverX] = useState(0);
  const [hoverY, setHoverY] = useState(0);

  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const dateScale = useMemo(
    () =>
      scaleTime<number>({
        range: [margin.left, innerWidth + margin.left],
        domain: [
          Math.min(...data.map((d) => getDate(d).valueOf())),
          Math.max(...data.map((d) => getDate(d).valueOf())),
        ],
      }),
    [data, innerWidth]
  );

  const valueScale = useMemo(
    () =>
      scaleLinear<number>({
        range: [innerHeight + margin.top, margin.top],
        domain: [0, Math.max(...data.map(getValue), 1)],
        nice: true,
      }),
    [data, innerHeight]
  );

  const handleTooltip = useCallback(
    (
      event:
        | React.TouchEvent<SVGRectElement>
        | React.MouseEvent<SVGRectElement>
    ) => {
      const { x } = localPoint(event) || { x: 0 };
      const x0 = dateScale.invert(x);
      const index = bisectDate(data, x0, 1);
      const d0 = data[index - 1];
      const d1 = data[index];
      let d = d0;
      if (d1 && getDate(d1)) {
        d =
          x0.valueOf() - getDate(d0).valueOf() >
          getDate(d1).valueOf() - x0.valueOf()
            ? d1
            : d0;
      }
      setHovered(d);
      setHoverX(dateScale(getDate(d)));
      setHoverY(valueScale(getValue(d)));
    },
    [dateScale, valueScale, data]
  );

  if (width < 10) return null;

  const allZero = data.every((d) => d.value === 0);

  const displayValue = hovered
    ? `${prefix}${getValue(hovered).toLocaleString(undefined, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      })}`
    : null;

  const displayDate = hovered
    ? new Date(hovered.date).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      })
    : null;

  return (
    <div style={{ position: "relative", width, height }}>
      {/* Top label — Apple Stocks style */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 4,
          zIndex: 2,
          height: margin.top,
          display: "flex",
          alignItems: "center",
          gap: 8,
          opacity: hovered ? 1 : 0,
          transition: "opacity 0.15s ease",
          pointerEvents: "none",
        }}
      >
        <span
          style={{
            fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, system-ui, sans-serif',
            fontSize: 20,
            fontWeight: 700,
            letterSpacing: "-0.03em",
            color: colors.startColor,
          }}
        >
          {displayValue}
        </span>
        <span
          style={{
            fontSize: 13,
            fontWeight: 500,
            color: "rgba(0,0,0,0.3)",
            letterSpacing: "-0.01em",
          }}
        >
          {displayDate}
        </span>
      </div>

      <svg width={width} height={height}>
        <LinearGradient
          id={`gradient-${colors.id}`}
          from={colors.startColor}
          to={colors.endColor}
          fromOpacity={0.3}
          toOpacity={0.02}
        />
        <LinearGradient
          id={`line-gradient-${colors.id}`}
          from={colors.startColor}
          to={colors.endColor}
        />
        {allZero ? (
          <line
            x1={margin.left}
            y1={innerHeight + margin.top}
            x2={innerWidth + margin.left}
            y2={innerHeight + margin.top}
            stroke={colors.startColor}
            strokeWidth={1.5}
            strokeOpacity={0.25}
            strokeDasharray="6,5"
          />
        ) : (
          <>
            <AreaClosed<DataPoint>
              data={data}
              x={(d) => dateScale(getDate(d)) ?? 0}
              y={(d) => valueScale(getValue(d)) ?? 0}
              yScale={valueScale}
              strokeWidth={0}
              fill={`url(#gradient-${colors.id})`}
              curve={curveMonotoneX}
            />
            <LinePath<DataPoint>
              data={data}
              x={(d) => dateScale(getDate(d)) ?? 0}
              y={(d) => valueScale(getValue(d)) ?? 0}
              strokeWidth={2}
              stroke={`url(#line-gradient-${colors.id})`}
              curve={curveMonotoneX}
              strokeLinecap="round"
            />
          </>
        )}
        <Bar
          x={margin.left}
          y={margin.top}
          width={innerWidth}
          height={innerHeight}
          fill="transparent"
          onTouchStart={handleTooltip}
          onTouchMove={handleTooltip}
          onMouseMove={handleTooltip}
          onMouseLeave={() => setHovered(null)}
        />
        {hovered && (
          <g>
            {/* Vertical scrub line */}
            <line
              x1={hoverX}
              y1={margin.top}
              x2={hoverX}
              y2={innerHeight + margin.top}
              stroke={colors.startColor}
              strokeWidth={1}
              strokeOpacity={0.15}
            />
            {/* Glow */}
            <circle
              cx={hoverX}
              cy={hoverY}
              r={12}
              fill={colors.startColor}
              opacity={0.08}
            />
            {/* Outer ring */}
            <circle
              cx={hoverX}
              cy={hoverY}
              r={5.5}
              fill="white"
              stroke={colors.startColor}
              strokeWidth={2}
              style={{ filter: "drop-shadow(0 1px 3px rgba(0,0,0,0.1))" }}
            />
            {/* Inner dot */}
            <circle
              cx={hoverX}
              cy={hoverY}
              r={2}
              fill={colors.startColor}
            />
          </g>
        )}
      </svg>
    </div>
  );
}

interface AreaChartProps {
  data: DataPoint[];
  colors: ChartColorConfig;
  height?: number;
  prefix?: string;
}

export default function AreaChart({
  data,
  colors,
  height = 200,
  prefix,
}: AreaChartProps) {
  return (
    <ParentSize>
      {({ width }) => (
        <AreaChartInner
          data={data}
          colors={colors}
          width={width}
          height={height}
          prefix={prefix}
        />
      )}
    </ParentSize>
  );
}
