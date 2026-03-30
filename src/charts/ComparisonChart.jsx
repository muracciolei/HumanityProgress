import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { formatMetricValue } from "../utils/formatters";

function ComparisonChart({
  data,
  metric,
  countryALabel,
  countryBLabel
}) {
  if (!data.length) {
    return <div className="status">No comparison data available yet.</div>;
  }

  return (
    <div
      className="comparison-chart-wrap"
      role="img"
      aria-label={`Comparison chart for ${countryALabel} and ${countryBLabel}`}
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 12, right: 12, left: 0, bottom: 8 }}>
          <CartesianGrid strokeDasharray="4 4" stroke="var(--border)" />
          <XAxis dataKey="year" tick={{ fill: "var(--text-muted)", fontSize: 11 }} />
          <YAxis tick={{ fill: "var(--text-muted)", fontSize: 11 }} width={56} />
          <Tooltip
            labelFormatter={(label) => `Year ${label}`}
            formatter={(value, seriesName) => [
              formatMetricValue(value, metric),
              seriesName
            ]}
            contentStyle={{
              border: "1px solid var(--border)",
              borderRadius: "10px",
              background: "var(--bg-elevated)"
            }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="a"
            name={countryALabel}
            stroke="#1f6fb2"
            strokeWidth={2}
            dot={false}
            animationDuration={550}
          />
          <Line
            type="monotone"
            dataKey="b"
            name={countryBLabel}
            stroke="#2f9c67"
            strokeWidth={2}
            dot={false}
            animationDuration={550}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default ComparisonChart;
