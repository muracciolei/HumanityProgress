import { getSeriesBounds } from "./dataUtils";
import { formatMetricValue } from "./formatters";

function summarizeChange(metric, selectedYear) {
  const bounds = getSeriesBounds(metric.data || [], selectedYear);
  if (!bounds) {
    return null;
  }

  const { first, last } = bounds;
  if (first.value === 0 || first.value === null || last.value === null) {
    return null;
  }

  const absoluteChange = last.value - first.value;
  const relativeChange = (absoluteChange / first.value) * 100;

  if (metric.id === "life_expectancy" && first.value > 0) {
    const ratio = last.value / first.value;
    return `Average global life expectancy rose from ${formatMetricValue(
      first.value,
      metric
    )} in ${first.year} to ${formatMetricValue(last.value, metric)} in ${
      last.year
    }, about ${ratio.toFixed(2)} times higher.`;
  }

  if (metric.direction === "down") {
    return `${metric.title} declined from ${formatMetricValue(
      first.value,
      metric
    )} in ${first.year} to ${formatMetricValue(last.value, metric)} in ${
      last.year
    } (${Math.abs(relativeChange).toFixed(1)}% reduction).`;
  }

  return `${metric.title} increased from ${formatMetricValue(
    first.value,
    metric
  )} in ${first.year} to ${formatMetricValue(last.value, metric)} in ${
    last.year
  } (${relativeChange.toFixed(1)}% increase).`;
}

export function generateInsights(metrics, selectedYear) {
  const priorityOrder = [
    "life_expectancy",
    "extreme_poverty",
    "child_mortality",
    "literacy_rate",
    "internet_usage",
    "vaccination_coverage"
  ];

  const insights = [];

  for (const metricId of priorityOrder) {
    const metric = metrics.find((item) => item.id === metricId);
    if (!metric || !Array.isArray(metric.data) || metric.data.length < 2) {
      continue;
    }

    const statement = summarizeChange(metric, selectedYear);
    if (statement) {
      insights.push(statement);
    }

    if (insights.length >= 5) {
      break;
    }
  }

  if (insights.length === 0) {
    insights.push("Insights will appear as soon as enough historical data loads.");
  }

  return insights;
}

export function generateDidYouKnowFacts(metrics) {
  const candidates = [
    "literacy_rate",
    "child_mortality",
    "vaccination_coverage",
    "internet_usage",
    "electricity_access",
    "school_enrollment"
  ];

  const facts = [];

  for (const metricId of candidates) {
    const metric = metrics.find((item) => item.id === metricId);
    if (!metric || !metric.data || metric.data.length < 2) {
      continue;
    }

    const first = metric.data[0];
    const last = metric.data[metric.data.length - 1];
    const delta = last.value - first.value;
    const directionWord = delta >= 0 ? "up" : "down";

    facts.push({
      id: metricId,
      text: `${metric.title} is ${directionWord} from ${formatMetricValue(
        first.value,
        metric
      )} (${first.year}) to ${formatMetricValue(last.value, metric)} (${
        last.year
      }).`,
      meta: `${metric.sourceName}`
    });
  }

  if (facts.length === 0) {
    return [
      {
        id: "loading",
        text: "Data-driven facts will appear when the indicator series finish loading.",
        meta: "Fetching datasets..."
      }
    ];
  }

  return facts;
}
