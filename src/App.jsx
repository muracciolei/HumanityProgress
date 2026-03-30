import { useCallback, useEffect, useMemo, useState } from "react";
import Header from "./components/Header";
import TimeSlider from "./components/TimeSlider";
import SnapshotPanel from "./components/SnapshotPanel";
import MetricCard from "./components/MetricCard";
import CountryComparison from "./components/CountryComparison";
import InsightsPanel from "./components/InsightsPanel";
import DidYouKnow from "./components/DidYouKnow";
import TimelineView from "./components/TimelineView";
import {
  DASHBOARD_METRICS,
  SNAPSHOT_METRIC_IDS
} from "./data/metricDefinitions";
import { loadCountries, loadMetricSeries } from "./services/metricsService";
import { buildSnapshot } from "./utils/dataUtils";
import { generateDidYouKnowFacts, generateInsights } from "./utils/insights";

const MIN_YEAR = 1800;
const PRESENT_YEAR = new Date().getFullYear();

function App() {
  const [selectedYear, setSelectedYear] = useState(PRESENT_YEAR);
  const [metricResults, setMetricResults] = useState({});
  const [countries, setCountries] = useState([]);
  const [countriesStatus, setCountriesStatus] = useState("idle");
  const [theme, setTheme] = useState(() => {
    const storedTheme = window.localStorage.getItem("humanity-progress-theme");
    return storedTheme || "light";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    window.localStorage.setItem("humanity-progress-theme", theme);
  }, [theme]);

  const loadMetric = useCallback(async (metricId) => {
    setMetricResults((previous) => ({
      ...previous,
      [metricId]: { ...(previous[metricId] || {}), status: "loading" }
    }));

    try {
      const result = await loadMetricSeries(metricId);
      setMetricResults((previous) => ({
        ...previous,
        [metricId]: { ...result, status: "loaded" }
      }));
    } catch (error) {
      setMetricResults((previous) => ({
        ...previous,
        [metricId]: {
          data: [],
          sourceName: "Unavailable",
          sourceUrl: "",
          usedFallback: false,
          status: "error",
          errorMessage: error.message
        }
      }));
    }
  }, []);

  useEffect(() => {
    const priorityMetrics = [...SNAPSHOT_METRIC_IDS];
    const remainingMetrics = DASHBOARD_METRICS.map((metric) => metric.id).filter(
      (metricId) => !priorityMetrics.includes(metricId)
    );

    priorityMetrics.forEach((metricId) => {
      loadMetric(metricId);
    });

    const deferredLoad = () => {
      remainingMetrics.forEach((metricId) => {
        loadMetric(metricId);
      });
    };

    if ("requestIdleCallback" in window) {
      const callbackId = window.requestIdleCallback(deferredLoad, {
        timeout: 2000
      });
      return () => window.cancelIdleCallback(callbackId);
    }

    const timeoutId = window.setTimeout(deferredLoad, 350);
    return () => window.clearTimeout(timeoutId);
  }, [loadMetric]);

  useEffect(() => {
    let isMounted = true;
    setCountriesStatus("loading");

    loadCountries()
      .then((countryList) => {
        if (isMounted) {
          setCountries(countryList);
          setCountriesStatus("loaded");
        }
      })
      .catch(() => {
        if (isMounted) {
          setCountriesStatus("error");
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const enrichedMetrics = useMemo(
    () =>
      DASHBOARD_METRICS.map((metric) => ({
        ...metric,
        ...(metricResults[metric.id] || {})
      })),
    [metricResults]
  );

  const snapshot = useMemo(
    () => buildSnapshot(enrichedMetrics, selectedYear),
    [enrichedMetrics, selectedYear]
  );

  const insights = useMemo(
    () => generateInsights(enrichedMetrics, selectedYear),
    [enrichedMetrics, selectedYear]
  );

  const didYouKnowFacts = useMemo(
    () => generateDidYouKnowFacts(enrichedMetrics),
    [enrichedMetrics]
  );

  return (
    <div className="app-shell">
      <Header
        title="HUMANITY PROGRESS"
        subtitle="Evidence-Based Global Improvement Dashboard"
        theme={theme}
        onToggleTheme={() =>
          setTheme((currentTheme) =>
            currentTheme === "light" ? "dark" : "light"
          )
        }
      />

      <main className="content">
        <section className="section intro" aria-labelledby="intro-title">
          <h2 id="intro-title">Long-Term Trends in Human Well-Being</h2>
          <p>
            This dashboard visualizes historical global indicators from trusted
            public sources, with transparent citations and methodological notes.
            Values update by year so you can inspect change over time instead of
            relying on isolated snapshots.
          </p>
        </section>

        <section className="section" aria-labelledby="time-slider-title">
          <h2 id="time-slider-title">Global Time Explorer</h2>
          <TimeSlider
            minYear={MIN_YEAR}
            maxYear={PRESENT_YEAR}
            selectedYear={selectedYear}
            onChange={setSelectedYear}
          />
          <SnapshotPanel
            title={`Snapshot of Humanity in YEAR ${selectedYear}`}
            snapshot={snapshot}
          />
        </section>

        <section className="section" aria-labelledby="dashboard-title">
          <h2 id="dashboard-title">Global Progress Dashboard</h2>
          <div className="metric-grid">
            {enrichedMetrics.map((metric) => (
              <MetricCard
                key={metric.id}
                metric={metric}
                selectedYear={selectedYear}
              />
            ))}
          </div>
        </section>

        <section className="section multi-column" aria-labelledby="insights-title">
          <div className="column">
            <InsightsPanel
              id="insights-title"
              title="Progress Insights"
              insights={insights}
            />
          </div>
          <div className="column">
            <DidYouKnow title="Did You Know?" facts={didYouKnowFacts} />
          </div>
        </section>

        <section className="section" aria-labelledby="comparison-title">
          <CountryComparison
            id="comparison-title"
            title="Country Comparison Tool"
            countries={countries}
            countriesStatus={countriesStatus}
            selectedYear={selectedYear}
          />
        </section>

        <section className="section" aria-labelledby="timeline-title">
          <TimelineView id="timeline-title" title="Global Milestones Timeline" />
        </section>
      </main>
    </div>
  );
}

export default App;
