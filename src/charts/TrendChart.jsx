import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { truncateSeriesToYear } from "../utils/dataUtils";
import { formatMetricValue, formatYear } from "../utils/formatters";

function tooltipFormatter(value, _, item, metric) {
  return [formatMetricValue(value, metric), item?.payload?.year];
}

function TrendChart({ data, metric, selectedYear }) {
  const visibleData = truncateSeriesToYear(data || [], selectedYear);

  if (!visibleData.length) {
    return <div className="status">No data available for this year range yet.</div>;
  }

  return (
    <div className="chart-shell" role="img" aria-label={`${metric.title} trend chart`}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={visibleData} margin={{ top: 12, right: 8, left: 4, bottom: 6 }}>
          <CartesianGrid strokeDasharray="4 4" stroke="var(--border)" />
          <XAxis
            dataKey="year"
            tickFormatter={formatYear}
            tick={{ fill: "var(--text-muted)", fontSize: 11 }}
          />
          <YAxis tick={{ fill: "var(--text-muted)", fontSize: 11 }} width={55} />
          <Tooltip
            cursor={{ stroke: "var(--accent)", strokeWidth: 1 }}
            formatter={(value, name, item) =>
              tooltipFormatter(value, name, item, metric)
            }
            labelFormatter={(label) => `Year ${label}`}
            contentStyle={{
              border: "1px solid var(--border)",
              borderRadius: "10px",
              background: "var(--bg-elevated)"
            }}
          />
          <ReferenceLine x={selectedYear} stroke="var(--accent)" strokeOpacity={0.25} />
          {/* Visualization logic: animate line transitions for smooth year-by-year exploration. */}
          <Line
            type="monotone"
            dataKey="value"
            stroke="var(--accent)"
            strokeWidth={2.1}
            dot={false}
            activeDot={{ r: 4, strokeWidth: 0, fill: "var(--accent-2)" }}
            animationDuration={500}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default TrendChart;
