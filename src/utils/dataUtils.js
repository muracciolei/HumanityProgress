const SNAPSHOT_ORDER = [
  "life_expectancy",
  "literacy_rate",
  "extreme_poverty",
  "internet_usage"
];

export function sortSeries(series) {
  return [...series].sort((a, b) => a.year - b.year);
}

export function getValueAtOrBeforeYear(series, year) {
  if (!Array.isArray(series) || series.length === 0) {
    return null;
  }

  const sortedSeries = sortSeries(series);
  let candidate = null;

  for (const item of sortedSeries) {
    if (item.year <= year) {
      candidate = item;
    } else {
      break;
    }
  }

  return candidate;
}

export function getSeriesBounds(series, selectedYear) {
  if (!Array.isArray(series) || series.length === 0) {
    return null;
  }

  const sortedSeries = sortSeries(series);
  const first = sortedSeries[0];
  const eligible = sortedSeries.filter((item) => item.year <= selectedYear);
  const last = eligible.length > 0 ? eligible[eligible.length - 1] : null;

  if (!last) {
    return null;
  }

  return { first, last };
}

export function truncateSeriesToYear(series, selectedYear) {
  if (!Array.isArray(series)) {
    return [];
  }

  return series.filter((point) => point.year <= selectedYear);
}

export function buildSnapshot(metrics, selectedYear) {
  return SNAPSHOT_ORDER.map((metricId) => {
    const metric = metrics.find((item) => item.id === metricId);
    const point = getValueAtOrBeforeYear(metric?.data || [], selectedYear);

    return {
      id: metricId,
      label: metric?.shortTitle || metric?.title || metricId,
      value: point?.value ?? null,
      metric
    };
  });
}

export function mergeSeriesForComparison(seriesA, seriesB, selectedYear) {
  const mergedByYear = new Map();

  for (const point of seriesA || []) {
    if (point.year <= selectedYear) {
      mergedByYear.set(point.year, { year: point.year, a: point.value, b: null });
    }
  }

  for (const point of seriesB || []) {
    if (point.year <= selectedYear) {
      const existing = mergedByYear.get(point.year) || {
        year: point.year,
        a: null,
        b: null
      };
      mergedByYear.set(point.year, { ...existing, b: point.value });
    }
  }

  return [...mergedByYear.values()].sort((left, right) => left.year - right.year);
}
