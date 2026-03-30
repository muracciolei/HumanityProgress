import { useEffect, useMemo, useState } from "react";
import ComparisonChart from "../charts/ComparisonChart";
import {
  COMPARISON_METRICS,
  DEFAULT_COMPARISON_COUNTRIES
} from "../data/metricDefinitions";
import { loadComparisonSeries } from "../services/metricsService";
import { mergeSeriesForComparison } from "../utils/dataUtils";

function resolveCountryName(code, countries) {
  return countries.find((country) => country.code === code)?.name || code;
}

function CountryComparison({
  id,
  title,
  countries,
  countriesStatus,
  selectedYear
}) {
  const [metricId, setMetricId] = useState(COMPARISON_METRICS[0].id);
  const [countryA, setCountryA] = useState(DEFAULT_COMPARISON_COUNTRIES.countryA);
  const [countryB, setCountryB] = useState(DEFAULT_COMPARISON_COUNTRIES.countryB);
  const [comparisonState, setComparisonState] = useState({
    status: "idle",
    dataByCountry: {},
    usedFallback: false,
    errorMessage: ""
  });

  const selectedMetric = useMemo(
    () => COMPARISON_METRICS.find((metric) => metric.id === metricId),
    [metricId]
  );

  useEffect(() => {
    if (countries.length === 0) {
      return;
    }

    const hasCountryA = countries.some((country) => country.code === countryA);
    const hasCountryB = countries.some((country) => country.code === countryB);

    if (!hasCountryA) {
      setCountryA(countries[0].code);
    }

    if (!hasCountryB) {
      setCountryB(countries[Math.min(1, countries.length - 1)].code);
    }
  }, [countries, countryA, countryB]);

  useEffect(() => {
    if (countryA !== countryB) {
      return;
    }

    const alternativeCountry = countries.find(
      (country) => country.code !== countryA
    );
    if (alternativeCountry) {
      setCountryB(alternativeCountry.code);
    }
  }, [countryA, countryB, countries]);

  useEffect(() => {
    if (!selectedMetric || !countryA || !countryB) {
      return;
    }

    let isActive = true;
    setComparisonState((previous) => ({
      ...previous,
      status: "loading"
    }));

    loadComparisonSeries(selectedMetric.indicator, [countryA, countryB])
      .then((result) => {
        if (!isActive) {
          return;
        }

        setComparisonState({
          status: "loaded",
          dataByCountry: result.dataByCountry,
          usedFallback: result.usedFallback,
          errorMessage: ""
        });
      })
      .catch((error) => {
        if (!isActive) {
          return;
        }

        setComparisonState({
          status: "error",
          dataByCountry: {},
          usedFallback: false,
          errorMessage: error.message
        });
      });

    return () => {
      isActive = false;
    };
  }, [selectedMetric, countryA, countryB]);

  const countryALabel = resolveCountryName(countryA, countries);
  const countryBLabel = resolveCountryName(countryB, countries);

  const mergedSeries = useMemo(() => {
    const seriesA = comparisonState.dataByCountry[countryA] || [];
    const seriesB = comparisonState.dataByCountry[countryB] || [];
    return mergeSeriesForComparison(seriesA, seriesB, selectedYear);
  }, [comparisonState.dataByCountry, countryA, countryB, selectedYear]);

  return (
    <div aria-labelledby={id}>
      <h2 id={id}>{title}</h2>

      {countriesStatus === "loading" && (
        <div className="status">Loading country catalog...</div>
      )}
      {countriesStatus === "error" && (
        <div className="status error">
          Country list could not be loaded from API. Using local fallback list.
        </div>
      )}

      <div className="comparison-controls">
        <div className="control-group">
          <label htmlFor="comparison-metric">Metric</label>
          <select
            id="comparison-metric"
            value={metricId}
            onChange={(event) => setMetricId(event.target.value)}
            aria-label="Choose comparison metric"
          >
            {COMPARISON_METRICS.map((metric) => (
              <option key={metric.id} value={metric.id}>
                {metric.label}
              </option>
            ))}
          </select>
        </div>

        <div className="control-group">
          <label htmlFor="country-a">Country A</label>
          <select
            id="country-a"
            value={countryA}
            onChange={(event) => setCountryA(event.target.value)}
            aria-label="Select first country"
          >
            {countries.map((country) => (
              <option key={country.code} value={country.code}>
                {country.name}
              </option>
            ))}
          </select>
        </div>

        <div className="control-group">
          <label htmlFor="country-b">Country B</label>
          <select
            id="country-b"
            value={countryB}
            onChange={(event) => setCountryB(event.target.value)}
            aria-label="Select second country"
          >
            {countries.map((country) => (
              <option key={country.code} value={country.code}>
                {country.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {comparisonState.status === "loading" && (
        <div className="status">Loading comparison series...</div>
      )}
      {comparisonState.status === "error" && (
        <div className="status error">
          Comparison data unavailable: {comparisonState.errorMessage}
        </div>
      )}
      {comparisonState.status === "loaded" && (
        <>
          <ComparisonChart
            data={mergedSeries}
            metric={selectedMetric}
            countryALabel={countryALabel}
            countryBLabel={countryBLabel}
          />
          {comparisonState.usedFallback && (
            <div className="metric-meta">
              Local fallback data is currently active for this comparison.
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default CountryComparison;
