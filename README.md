# College Town Housing Market Dashboard

An interactive data website for comparing home prices and market activity across 18 U.S. college towns near 11 university campuses.

## Live site

https://yonglisun.github.io/college-town-housing-dashboard/

## Dashboard features

- Median sale price, number of sales, median days on market, and median distance to campus
- City selector covering all 18 markets
- Interactive price and sales comparison charts
- City-level context and data-availability notes
- Responsive layouts for desktop and mobile screens
- Keyboard-accessible chart controls and clear focus states

The site uses plain HTML, CSS, and JavaScript. It has no build step or third-party runtime dependencies, so GitHub Pages can publish the repository root directly.

## Data and calculation rules

The dashboard uses the College-town home sales dataset, version 1.0 (2026), collected in March 2026. The source contains 35,442 completed sale records.

- **Median sale price:** Uses records where `sale_price >= 1000`. Four lower-price records are excluded. High-price outliers are retained because the median is resistant to extreme values.
- **Number of sales:** Counts unique `listing_id` values. Records are not deduplicated by street address because separate units can share an address.
- **Median days on market:** Calculates `contract_date - list_date` only when both dates are present. Missing dates remain missing and are not treated as zero.
- **Median distance to campus:** Uses `miles_to_campus`, a straight-line distance to the nearest assigned university landmark.
- **Time range:** Sale records run from March 27, 2023 through March 25, 2026. The first and last years are partial years.
- **Property type:** `home_type` is not used in the dashboard because its classifications are unreliable.

The five original dataset files in `data/college_town_home_sales.*` remain unchanged.

## Project files

| Path | Purpose |
|---|---|
| `index.html` | Dashboard structure and content |
| `styles.css` | Responsive layout, visual design, and accessibility states |
| `app.js` | Loads summary data and manages filters, metrics, and charts |
| `scripts/build_dashboard_data.py` | Rebuilds dashboard metrics from the source CSV |
| `data/city_market_summary.json` | Generated city-level and overall dashboard metrics |
| `data/college_town_home_sales.csv` | Original source data |
| `docs/data_description_sheet.md` | Source field definitions and data-quality guidance |
| `.github/workflows/pages.yml` | Publishes the repository root to GitHub Pages |

## Run locally

From the repository root, rebuild the summary data when the source data changes:

```bash
python3 scripts/build_dashboard_data.py
```

Start a local web server:

```bash
python3 -m http.server 4173
```

Then open `http://localhost:4173` in a browser. A local server is required because the page loads its JSON data with `fetch()`.

## Verification

The generated JSON should report 35,442 records, 18 cities, and 11 universities. The default dashboard metrics are:

| Metric | All Cities |
|---|---:|
| Median sale price | $410,000 |
| Number of sales | 35,442 |
| Median days on market | 11 days |
| Median distance to campus | 3.4 miles |

These values are independently checked against the supplied SQLite copy of the dataset during development.

## Citation

College-town home sales dataset, version 1.0 (2026). University of Illinois–Deloitte Foundation Center for Business Emerging Technologies. Data collected March 2026.
