import TrendChart from "../charts/TrendChart";
import SourceBadge from "./SourceBadge";
import { getValueAtOrBeforeYear } from "../utils/dataUtils";
import { formatMetricValue } from "../utils/formatters";

function MetricCard({ metric, selectedYear }) {
  const {
    title,
    description,
    data = [],
    sourceName,
    sourceUrl,
    usedFallback,
    status,
    errorMessage
  } = metric;

  const valuePoint = getValueAtOrBeforeYear(data, selectedYear);
  const currentValue = formatMetricValue(valuePoint?.value ?? null, metric);

  return (
    <article className="metric-card" aria-labelledby={`${metric.id}-title`}>
      <div className="metric-header">
        <div className="metric-title-wrap">
          <h3 id={`${metric.id}-title`}>{title}</h3>
          <p>{description}</p>
        </div>
        <div className="metric-value">{currentValue}</div>
      </div>

      {status === "loading" && <div className="status">Loading historical series...</div>}
      {status === "error" && (
        <div className="status error">Data load error: {errorMessage || "Unavailable"}</div>
      )}
      {status !== "loading" && status !== "error" && (
        <TrendChart data={data} metric={metric} selectedYear={selectedYear} />
      )}

      {sourceName && sourceUrl && (
        <SourceBadge
          sourceName={sourceName}
          sourceUrl={sourceUrl}
          usedFallback={Boolean(usedFallback)}
        />
      )}

      <div className="metric-meta">
        Showing data up to year {selectedYear}
        {usedFallback ? " (local fallback active)." : "."}
      </div>
    </article>
  );
}

export default MetricCard;
