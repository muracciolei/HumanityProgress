export function formatMetricValue(value, metric) {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return "n/a";
  }

  const decimals = metric?.decimals ?? 1;
  const roundedValue = Number(value);

  if (metric?.unit === "%") {
    return `${roundedValue.toFixed(decimals)}%`;
  }

  if (metric?.unit === "articles") {
    return roundedValue.toLocaleString(undefined, {
      maximumFractionDigits: 0
    });
  }

  if (metric?.unit === "per 1,000") {
    return `${roundedValue.toFixed(decimals)} / 1,000`;
  }

  if (metric?.unit === "years") {
    return `${roundedValue.toFixed(decimals)} years`;
  }

  return `${roundedValue.toFixed(decimals)} ${metric?.unit || ""}`.trim();
}

export function formatCompactNumber(value) {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return "n/a";
  }

  return new Intl.NumberFormat(undefined, {
    notation: "compact",
    maximumFractionDigits: 1
  }).format(value);
}

export function formatYear(year) {
  return Number(year).toString();
}
