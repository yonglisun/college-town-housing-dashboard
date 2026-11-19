#!/usr/bin/env python3
"""Build the compact data file used by the housing dashboard."""

from __future__ import annotations

import csv
import json
from collections import defaultdict
from datetime import date
from pathlib import Path
from statistics import median


ROOT = Path(__file__).resolve().parents[1]
SOURCE_PATH = ROOT / "data" / "college_town_home_sales.csv"
OUTPUT_PATH = ROOT / "data" / "city_market_summary.json"
MINIMUM_VALID_PRICE = 1_000


def parse_date(value: str) -> date | None:
    return date.fromisoformat(value) if value else None


def market_summary(rows: list[dict[str, str]]) -> dict[str, object]:
    """Return dashboard metrics for a collection of sale rows."""
    valid_prices = [
        int(row["sale_price"])
        for row in rows
        if int(row["sale_price"]) >= MINIMUM_VALID_PRICE
    ]
    distances = [float(row["miles_to_campus"]) for row in rows]
    days_on_market: list[int] = []

    for row in rows:
        list_date = parse_date(row["list_date"])
        contract_date = parse_date(row["contract_date"])
        if list_date is not None and contract_date is not None:
            days_on_market.append((contract_date - list_date).days)

    return {
        "number_of_sales": len(rows),
        "median_sale_price": median(valid_prices),
        "valid_price_records": len(valid_prices),
        "excluded_price_records": len(rows) - len(valid_prices),
        "median_days_on_market": median(days_on_market),
        "days_on_market_records": len(days_on_market),
        "median_distance_to_campus": round(median(distances), 1),
    }


def build_dashboard_data() -> dict[str, object]:
    with SOURCE_PATH.open(newline="", encoding="utf-8") as source_file:
        rows = list(csv.DictReader(source_file))

    if len(rows) != 35_442:
        raise ValueError(f"Expected 35,442 rows, found {len(rows):,}")

    listing_ids = {row["listing_id"] for row in rows}
    if len(listing_ids) != len(rows):
        raise ValueError("listing_id must be unique for every sale")

    grouped_rows: dict[tuple[str, str], list[dict[str, str]]] = defaultdict(list)
    for row in rows:
        grouped_rows[(row["city"], row["state"])].append(row)

    sale_dates = [parse_date(row["sale_date"]) for row in rows if row["sale_date"]]
    cities = []
    for (city, state), city_rows in sorted(grouped_rows.items()):
        universities = sorted({row["university"] for row in city_rows})
        if len(universities) != 1:
            raise ValueError(f"Expected one university for {city}, {state}")

        cities.append(
            {
                "id": f"{city}, {state}",
                "city": city,
                "state": state,
                "university": universities[0],
                **market_summary(city_rows),
            }
        )

    if len(cities) != 18:
        raise ValueError(f"Expected 18 cities, found {len(cities)}")

    return {
        "metadata": {
            "source": "College-town home sales dataset, version 1.0 (2026)",
            "source_file": "data/college_town_home_sales.csv",
            "record_count": len(rows),
            "city_count": len(cities),
            "university_count": len({row["university"] for row in rows}),
            "earliest_sale_date": min(sale_dates).isoformat(),
            "latest_sale_date": max(sale_dates).isoformat(),
            "missing_sale_dates": sum(not row["sale_date"] for row in rows),
            "price_minimum": MINIMUM_VALID_PRICE,
        },
        "overall": {
            "id": "all",
            "city": "All Cities",
            **market_summary(rows),
        },
        "cities": cities,
    }


def main() -> None:
    dashboard_data = build_dashboard_data()
    OUTPUT_PATH.write_text(
        json.dumps(dashboard_data, indent=2, ensure_ascii=False) + "\n",
        encoding="utf-8",
    )
    print(
        f"Wrote {OUTPUT_PATH.relative_to(ROOT)} with "
        f"{len(dashboard_data['cities'])} city summaries."
    )


if __name__ == "__main__":
    main()
