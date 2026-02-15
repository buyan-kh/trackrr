"use client";

import { useCallback, useMemo } from "react";
import { AreaClosed, LinePath, Bar } from "@visx/shape";
import { curveMonotoneX } from "@visx/curve";
import { scaleTime, scaleLinear } from "@visx/scale";
import { LinearGradient } from "@visx/gradient";
import {
  withTooltip,
  TooltipWithBounds,
  defaultStyles,
} from "@visx/tooltip";
import { WithTooltipProvidedProps } from "@visx/tooltip/lib/enhancers/withTooltip";
import { localPoint } from "@visx/event";
import { bisector } from "@visx/vendor/d3-array";
import { ParentSize } from "@visx/responsive";
import { DataPoint, ChartColorConfig } from "@/lib/types";

const getDate = (d: DataPoint) => new Date(d.date);
const getValue = (d: DataPoint) => d.value;
const bisectDate = bisector<DataPoint, Date>((d) => new Date(d.date)).left;

const tooltipStyles = {
  ...defaultStyles,
  background: "white",
  border: "none",
  borderRadius: "12px",
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
  padding: "10px 14px",
  fontSize: "13px",
  fontFamily: "'DM Sans', sans-serif",
  color: "#1a1a2e",
};

const margin = { top: 20, right: 0, bottom: 0, left: 0 };

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
  showTooltip,
  hideTooltip,
  tooltipData,
  tooltipTop = 0,
  tooltipLeft = 0,
}: AreaChartInnerProps & WithTooltipProvidedProps<DataPoint>) {
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
      showTooltip({
        tooltipData: d,
        tooltipLeft: dateScale(getDate(d)),
        tooltipTop: valueScale(getValue(d)),
      });
    },
    [showTooltip, dateScale, valueScale, data]
  );

  if (width < 10) return null;

  const allZero = data.every((d) => d.value === 0);

  return (
    <div style={{ position: "relative" }}>
      <svg width={width} height={height}>
        <LinearGradient
          id={`gradient-${colors.id}`}
          from={colors.startColor}
          to={colors.endColor}
          fromOpacity={0.4}
          toOpacity={0.05}
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
            strokeWidth={2}
            strokeOpacity={0.3}
            strokeDasharray="6,4"
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
              strokeWidth={2.5}
              stroke={`url(#line-gradient-${colors.id})`}
              curve={curveMonotoneX}
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
          onMouseLeave={() => hideTooltip()}
        />
        {tooltipData && (
          <g>
            <circle
              cx={tooltipLeft}
              cy={tooltipTop}
              r={5}
              fill={colors.startColor}
              stroke="white"
              strokeWidth={2}
              style={{
                filter: `drop-shadow(0 0 6px ${colors.startColor}40)`,
              }}
            />
          </g>
        )}
      </svg>
      {tooltipData && (
        <TooltipWithBounds
          key={Math.random()}
          top={tooltipTop - 40}
          left={tooltipLeft}
          style={tooltipStyles}
        >
          <div style={{ fontWeight: 600, color: colors.startColor }}>
            {prefix}
            {getValue(tooltipData).toLocaleString(undefined, {
              minimumFractionDigits: 0,
              maximumFractionDigits: 2,
            })}
          </div>
          <div style={{ color: "#999", fontSize: "11px", marginTop: "2px" }}>
            {new Date(tooltipData.date).toLocaleDateString("en-US", {
              month: "short",
              year: "numeric",
            })}
          </div>
        </TooltipWithBounds>
      )}
    </div>
  );
}

const AreaChartWithTooltip = withTooltip<AreaChartInnerProps, DataPoint>(
  AreaChartInner
);

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
        <AreaChartWithTooltip
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
