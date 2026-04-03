# HUMANITY PROGRESS — Evidence-Based Global Improvement Dashboard

Frontend-only React dashboard that visualizes long-term changes in global human well-being using publicly available datasets.  
The design and narrative are intentionally scientific and neutral: the application focuses on measurable trends, transparent sources, and reproducible calculations.

## Purpose

The dashboard helps users explore how key global indicators have changed over time, including:

- Life expectancy
- Extreme poverty
- Literacy
- Child mortality
- Internet usage
- Access to electricity
- Vaccination coverage
- School enrollment
- Gender equality metric (women in parliament)
- Scientific publication output

All visuals are connected to data services with source links and fallback handling.

## Stack

- React + Vite
- Recharts (interactive visualizations)
- Papa Parse (CSV parsing for OWID datasets)
- No backend

## Project Structure

```text
humanity-progress/
  public/
  src/
    charts/
    components/
    data/
      fallback/
    services/
    utils/
    App.jsx
    main.jsx
  index.html
  package.json
  vite.config.js
```

## Data Sources

Primary source families used in the app:

1. Our World in Data datasets (CSV from OWID GitHub)
2. World Bank API indicators
3. UNESCO-linked data through World Bank education indicators (UIS-backed)
4. WHO/UNICEF-linked data through World Bank immunization indicators

Main source URLs used:

- OWID Life expectancy dataset  
  https://raw.githubusercontent.com/owid/owid-datasets/master/datasets/Life%20expectancy/Life%20expectancy.csv
- OWID Extreme poverty dataset  
  https://raw.githubusercontent.com/owid/owid-datasets/master/datasets/Extreme%20poverty/Extreme%20poverty.csv
- OWID Literacy rate dataset  
  https://raw.githubusercontent.com/owid/owid-datasets/master/datasets/Literacy%20rate/Literacy%20rate.csv
- World Bank Life expectancy indicator  
  https://api.worldbank.org/v2/country/all/indicator/SP.DYN.LE00.IN?format=json
- World Bank Extreme poverty indicator  
  https://api.worldbank.org/v2/country/all/indicator/SI.POV.DDAY?format=json
- World Bank Internet usage indicator  
  https://api.worldbank.org/v2/country/all/indicator/IT.NET.USER.ZS?format=json

Additional indicator endpoints are defined in:

- `src/data/metricDefinitions.js`

## Features Implemented

- Global progress dashboard with multiple indicators
- Historical trend charts with tooltips and animations
- Global time slider (`1800` to present) with synchronized chart updates
- Snapshot panel: "Snapshot of Humanity in YEAR XXXX"
- Country A vs Country B comparison for key metrics
- Dynamically generated insight statements (computed from loaded series)
- Rotating “Did You Know?” facts (derived from data, no static claims)
- Horizontal timeline of major historical milestones
- Local fallback datasets when network/API calls fail
- Source citation badges on indicator cards
- Responsive design for desktop and mobile
- Light/dark theme toggle

## Performance Approach

- Multi-level caching:
  - In-memory cache for current session
  - `localStorage` cache with TTL for repeated visits
- Deferred loading:
  - Priority metrics load first for immediate interactivity
  - Remaining metrics load during browser idle time (`requestIdleCallback`)
- Recharts animated transitions for smooth updates

## Installation

```bash
npm install
npm run dev
```

Local dev server typically runs at:

- `http://localhost:5173`

## Production Build

```bash
npm run build
npm run preview
```

## Deploy to GitHub Pages

This project uses **GitHub Actions** for automatic deployment to GitHub Pages. The deployment is triggered automatically whenever code is pushed to the `main` branch.

### Automatic Deployment

1. **Push to main branch**: The workflow automatically runs on every push to `main`
2. **GitHub Actions builds**: Installs dependencies, builds the project, and deploys to GitHub Pages
3. **Live site**: Available at https://muracciolei.github.io/HumanityProgress/

### Manual Deployment (Alternative)

If you need to deploy manually:

```bash
npm run deploy
```

### GitHub Pages Configuration

In your repository settings:
- **Settings → Pages**
- **Source**: "Deploy from branch"
- **Branch**: `main`
- **Folder**: `/dist`

The GitHub Actions workflow handles the deployment automatically, so manual configuration is not required.

## How to Add a New Indicator

1. Add a metric definition in `src/data/metricDefinitions.js`:
   - `id`, `title`, `description`, `unit`, `direction`
   - fetch configuration:
     - `type: "owid"` with CSV URL and `valueFieldCandidates`
     - or `type: "worldbank"` with indicator code
2. Add fallback series for that metric in `src/data/fallback/globalMetrics.json`.
3. Optional: include the metric in snapshot/insight priority lists.
4. UI cards will render automatically because the dashboard maps over metric definitions.

## Data Transformation Notes

- OWID CSV datasets are parsed in-browser with Papa Parse.
- World series are extracted using entity/code filters (`World`, `OWID_WRL`, or `WLD`).
- All series are normalized to `{ year, value }`, sorted, and deduplicated by year.
- Snapshot and insights use “latest value at or before selected year”.

## Accessibility Notes

- Semantic sectioning and headings
- ARIA labels on key controls
- Live-region behavior for rotating fact updates

## Known Limitations

- Some indicator series do not exist for early years; chart availability depends on source coverage.
- If remote APIs change schema, fallback datasets are used until service mappings are updated.
- Recharts adds a sizable bundle; build warns about chunk size. This does not block deployment but can be optimized further with deeper code-splitting.

## Educational Disclaimer

This dashboard is informational and educational.  
Interpretation should consider data methodology, revisions, uncertainty bands, and differences in source definitions over time.
