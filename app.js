"use strict";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});
const numberFormatter = new Intl.NumberFormat("en-US");

const elements = {
  citySelect: document.querySelector("#city-select"),
  selectionTitle: document.querySelector("#selection-title"),
  selectionDescription: document.querySelector("#selection-description"),
  medianPrice: document.querySelector("#median-price"),
  numberSales: document.querySelector("#number-sales"),
  medianDays: document.querySelector("#median-days"),
  medianDistance: document.querySelector("#median-distance"),
  priceNote: document.querySelector("#price-note"),
  daysNote: document.querySelector("#days-note"),
  priceChart: document.querySelector("#price-chart"),
  salesChart: document.querySelector("#sales-chart"),
  errorBanner: document.querySelector("#error-banner"),
};

let dashboardData;
let selectedMarketId = "all";

function percent(part, total) {
  return Math.round((part / total) * 100);
}

function formatCompactCurrency(value) {
  if (value >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(value % 1_000_000 === 0 ? 0 : 1)}M`;
  }
  return `$${Math.round(value / 1_000)}K`;
}

function selectedMarket() {
  if (selectedMarketId === "all") return dashboardData.overall;
  return dashboardData.cities.find((market) => market.id === selectedMarketId);
}

function marketDescription(market) {
  if (market.id === "all") {
    return `A combined view of ${dashboardData.metadata.city_count} markets near ${dashboardData.metadata.university_count} university campuses.`;
  }

  const coverage = percent(market.days_on_market_records, market.number_of_sales);
  return `${numberFormatter.format(market.number_of_sales)} sales near ${market.university}. Days on market is available for ${coverage}% of records.`;
}

function renderMetrics() {
  const market = selectedMarket();
  elements.selectionTitle.textContent = market.id === "all" ? "All Cities" : market.id;
  elements.selectionDescription.textContent = marketDescription(market);
  elements.medianPrice.textContent = currencyFormatter.format(market.median_sale_price);
  elements.numberSales.textContent = numberFormatter.format(market.number_of_sales);
  elements.medianDays.textContent = `${numberFormatter.format(market.median_days_on_market)} days`;
  elements.medianDistance.textContent = `${market.median_distance_to_campus.toFixed(1)} mi`;

  elements.priceNote.textContent = market.excluded_price_records
    ? `${numberFormatter.format(market.excluded_price_records)} price ${market.excluded_price_records === 1 ? "record" : "records"} below $1,000 excluded`
    : "All price records meet the $1,000 threshold";
  elements.daysNote.textContent = `${numberFormatter.format(market.days_on_market_records)} valid listing-to-contract records`;
}

function createBarRow(market, value, maximum, formattedValue) {
  const row = document.createElement("button");
  row.className = "bar-row";
  row.type = "button";
  row.dataset.marketId = market.id;
  row.setAttribute("aria-pressed", String(market.id === selectedMarketId));
  row.setAttribute("aria-label", `${market.id}: ${formattedValue}`);
  row.style.setProperty("--bar-width", `${Math.max(2, (value / maximum) * 100)}%`);

  const label = document.createElement("span");
  label.className = "bar-label";
  label.textContent = market.id;

  const track = document.createElement("span");
  track.className = "bar-track";
  track.setAttribute("aria-hidden", "true");
  const fill = document.createElement("span");
  fill.className = "bar-fill";
  track.append(fill);

  const valueLabel = document.createElement("span");
  valueLabel.className = "bar-value";
  valueLabel.textContent = formattedValue;

  row.append(label, track, valueLabel);
  row.addEventListener("click", () => selectMarket(market.id));
  return row;
}

function renderChart(container, property, formatter, extraClass = "") {
  const markets = [...dashboardData.cities].sort((a, b) => b[property] - a[property]);
  const maximum = markets[0][property];
  const fragment = document.createDocumentFragment();

  markets.forEach((market) => {
    fragment.append(createBarRow(market, market[property], maximum, formatter(market[property])));
  });

  container.className = `bar-chart ${extraClass}`.trim();
  container.replaceChildren(fragment);
}

function renderCharts() {
  renderChart(elements.priceChart, "median_sale_price", formatCompactCurrency, "price-bars");
  renderChart(elements.salesChart, "number_of_sales", (value) => numberFormatter.format(value), "sales-bars");
}

function selectMarket(marketId) {
  selectedMarketId = marketId;
  elements.citySelect.value = marketId;
  renderMetrics();
  renderCharts();
}

function populateSelect() {
  const fragment = document.createDocumentFragment();
  const allOption = document.createElement("option");
  allOption.value = "all";
  allOption.textContent = "All Cities";
  fragment.append(allOption);

  dashboardData.cities.forEach((market) => {
    const option = document.createElement("option");
    option.value = market.id;
    option.textContent = market.id;
    fragment.append(option);
  });

  elements.citySelect.replaceChildren(fragment);
  elements.citySelect.disabled = false;
  elements.citySelect.addEventListener("change", (event) => selectMarket(event.target.value));
}

async function initializeDashboard() {
  try {
    dashboardData = window.COLLEGE_TOWN_HOUSING_DATA;
    if (!dashboardData) {
      const response = await fetch("data/city_market_summary.json");
      if (!response.ok) throw new Error(`Data request failed with status ${response.status}`);
      dashboardData = await response.json();
    }
    populateSelect();
    renderMetrics();
    renderCharts();
  } catch (error) {
    console.error(error);
    elements.errorBanner.hidden = false;
    elements.selectionDescription.textContent = "Market data is temporarily unavailable.";
  }
}

initializeDashboard();
