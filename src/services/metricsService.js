import Papa from "papaparse";
import { DASHBOARD_METRICS } from "../data/metricDefinitions";
import fallbackGlobalMetrics from "../data/fallback/globalMetrics.json";
import fallbackComparison from "../data/fallback/comparisonCountries.json";
import { setCachedValue, getCachedValue } from "./cache";

const METRICS_BY_ID = Object.fromEntries(
  DASHBOARD_METRICS.map((metric) => [metric.id, metric])
);

function asNumber(value) {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  if (typeof value === "number") {
    return Number.isFinite(value) ? value : null;
  }

  const normalized = String(value).replace(/,/g, "").trim();
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : null;
}

function normalizeSeries(rawSeries) {
  const byYear = new Map();

  for (const row of rawSeries) {
    const year = asNumber(row.year);
    const value = asNumber(row.value);
    if (!year || value === null) {
      continue;
    }

    byYear.set(year, value);
  }

  return [...byYear.entries()]
    .map(([year, value]) => ({ year, value }))
    .sort((a, b) => a.year - b.year);
}

async function fetchCsvRows(url) {
  // API call: fetch raw CSV data directly from OWID-hosted sources.
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch CSV (${response.status})`);
  }

  const text = await response.text();
  const parsed = Papa.parse(text, {
    header: true,
    dynamicTyping: false,
    skipEmptyLines: true
  });

  return parsed.data;
}

function detectField(row, candidates) {
  const rowKeys = Object.keys(row || {});
  const lowerMap = new Map(rowKeys.map((key) => [key.toLowerCase(), key]));
  for (const candidate of candidates) {
    const match = lowerMap.get(candidate.toLowerCase());
    if (match) {
      return match;
    }
  }
  return null;
}

function pickValueFromRow(row, valueFieldCandidates = []) {
  for (const field of valueFieldCandidates) {
    const value = asNumber(row[field]);
    if (value !== null) {
      return value;
    }
  }

  const reserved = new Set([
    "entity",
    "code",
    "year",
    "country",
    "country name",
    "country code",
    "date"
  ]);

  for (const [field, value] of Object.entries(row)) {
    if (reserved.has(field.toLowerCase())) {
      continue;
    }
    const parsed = asNumber(value);
    if (parsed !== null) {
      return parsed;
    }
  }

  return null;
}

function normalizeOwidRows(rows, valueFieldCandidates) {
  if (!rows.length) {
    return [];
  }

  const sample = rows[0];
  const entityField = detectField(sample, ["Entity", "Country", "Location"]);
  const codeField = detectField(sample, ["Code", "Country Code", "ISO3"]);
  const yearField = detectField(sample, ["Year", "Date"]);

  if (!yearField) {
    return [];
  }

  const worldRows = rows.filter((row) => {
    const entity = String(row[entityField] || "").toLowerCase();
    const code = String(row[codeField] || "").toUpperCase();
    return entity === "world" || code === "OWID_WRL" || code === "WLD";
  });

  const selectedRows = worldRows.length > 0 ? worldRows : rows;

  // Transformation step: align different OWID schema variants into { year, value } pairs.
  const rawSeries = selectedRows.map((row) => ({
    year: asNumber(row[yearField]),
    value: pickValueFromRow(row, valueFieldCandidates)
  }));

  return normalizeSeries(rawSeries);
}

async function fetchWorldBankIndicator(indicator, countryCode) {
  const url =
    `https://api.worldbank.org/v2/country/${countryCode}/indicator/${indicator}` +
    "?format=json&per_page=20000";

  // API call: World Bank indicator endpoint returns metadata at index 0 and rows at index 1.
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`World Bank request failed (${response.status})`);
  }

  const json = await response.json();
  const rows = Array.isArray(json) ? json[1] || [] : [];

  const rawSeries = rows.map((row) => ({
    year: asNumber(row.date),
    value: asNumber(row.value)
  }));

  return normalizeSeries(rawSeries);
}

function getMetricById(metricId) {
  const metric = METRICS_BY_ID[metricId];
  if (!metric) {
    throw new Error(`Unknown metric id: ${metricId}`);
  }
  return metric;
}

function fallbackMetricResult(metric) {
  const fallbackSeries = normalizeSeries(fallbackGlobalMetrics[metric.id] || []);

  return {
    metricId: metric.id,
    data: fallbackSeries,
    sourceName: `${metric.sourceName} (fallback sample)`,
    sourceUrl: metric.sourceUrl,
    usedFallback: true
  };
}

export async function loadMetricSeries(metricId) {
  const metric = getMetricById(metricId);
  const cacheKey = `metric-series::${metricId}`;
  const cached = getCachedValue(cacheKey);

  if (cached) {
    return cached;
  }

  try {
    let series = [];

    if (metric.fetch.type === "owid") {
      const csvRows = await fetchCsvRows(metric.fetch.url);
      series = normalizeOwidRows(csvRows, metric.fetch.valueFieldCandidates);
    } else if (metric.fetch.type === "worldbank") {
      series = await fetchWorldBankIndicator(
        metric.fetch.indicator,
        metric.fetch.countryCode || "WLD"
      );
    }

    if (!series || series.length === 0) {
      throw new Error(`No data rows for ${metric.id}`);
    }

    const result = {
      metricId: metric.id,
      data: series,
      sourceName: metric.sourceName,
      sourceUrl: metric.sourceUrl,
      usedFallback: false
    };

    setCachedValue(cacheKey, result);
    return result;
  } catch {
    const result = fallbackMetricResult(metric);
    setCachedValue(cacheKey, result);
    return result;
  }
}

export async function loadCountries() {
  const cacheKey = "countries::worldbank";
  const cached = getCachedValue(cacheKey);
  if (cached) {
    return cached;
  }

  try {
    const response = await fetch(
      "https://api.worldbank.org/v2/country?format=json&per_page=400"
    );
    if (!response.ok) {
      throw new Error("Country list request failed");
    }

    const json = await response.json();
    const rows = Array.isArray(json) ? json[1] || [] : [];

    const countries = rows
      .filter(
        (row) =>
          row.region?.id !== "NA" &&
          row.id &&
          row.name &&
          !String(row.id).toUpperCase().startsWith("X")
      )
      .map((row) => ({
        code: row.id,
        name: row.name
      }))
      .sort((a, b) => a.name.localeCompare(b.name));

    if (countries.length === 0) {
      throw new Error("Country list is empty");
    }

    setCachedValue(cacheKey, countries, 1000 * 60 * 60 * 24);
    return countries;
  } catch {
    const fallbackCountries = [...fallbackComparison.countries].sort((a, b) =>
      a.name.localeCompare(b.name)
    );
    setCachedValue(cacheKey, fallbackCountries, 1000 * 60 * 60 * 24);
    return fallbackCountries;
  }
}

export async function loadComparisonSeries(indicator, countryCodes) {
  const sortedCodes = [...countryCodes].sort();
  const cacheKey = `comparison::${indicator}::${sortedCodes.join("-")}`;
  const cached = getCachedValue(cacheKey);
  if (cached) {
    return cached;
  }

  try {
    const entries = await Promise.all(
      countryCodes.map(async (countryCode) => {
        const series = await fetchWorldBankIndicator(indicator, countryCode);
        return [countryCode, series];
      })
    );

    const result = {
      dataByCountry: Object.fromEntries(entries),
      usedFallback: false
    };

    setCachedValue(cacheKey, result);
    return result;
  } catch {
    const fallbackDataByCountry = {};

    for (const countryCode of countryCodes) {
      fallbackDataByCountry[countryCode] =
        fallbackComparison.series?.[indicator]?.[countryCode] || [];
    }

    const result = {
      dataByCountry: fallbackDataByCountry,
      usedFallback: true
    };

    setCachedValue(cacheKey, result);
    return result;
  }
}
