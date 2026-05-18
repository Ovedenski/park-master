// components/listings/listings-filters.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { SlidersHorizontal, X } from "lucide-react";
import { LISTING_CATEGORIES } from "@/lib/types";

type ListingsFiltersProps = {
  category?: string;
  pricingMode?: string;
  city?: string;
  district?: string;
  minPrice?: string;
  maxPrice?: string;
  cities: string[];
  districts: string[];
  absoluteMinPrice: number;
  absoluteMaxPrice: number;
};

function hasActiveFilters({
  category,
  pricingMode,
  city,
  district,
  minPrice,
  maxPrice,
}: Pick<
  ListingsFiltersProps,
  "category" | "pricingMode" | "city" | "district" | "minPrice" | "maxPrice"
>) {
  return Boolean(
    (category && category !== "all") ||
    (pricingMode && pricingMode !== "all") ||
    (city && city !== "all") ||
    (district && district !== "all") ||
    minPrice ||
    maxPrice,
  );
}

export default function ListingsFilters({
  category,
  pricingMode,
  city,
  district,
  minPrice,
  maxPrice,
  cities,
  districts,
}: ListingsFiltersProps) {
  const filtersAreActive = hasActiveFilters({
    category,
    pricingMode,
    city,
    district,
    minPrice,
    maxPrice,
  });

  const [isOpen, setIsOpen] = useState(filtersAreActive);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => setIsOpen((current) => !current)}
          className="inline-flex items-center gap-2 rounded-full border bg-background px-4 py-2 text-sm font-medium shadow-sm transition hover:bg-muted"
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filters
          {filtersAreActive ? (
            <span className="ml-1 rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
              Active
            </span>
          ) : null}
        </button>

        {filtersAreActive ? (
          <Link
            href="/listings"
            className="inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-sm text-muted-foreground transition hover:bg-muted hover:text-foreground"
          >
            <X className="h-3.5 w-3.5" />
            Clear filters
          </Link>
        ) : null}
      </div>

      {isOpen ? (
        <form className="rounded-2xl border bg-background p-5 shadow-sm">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className="space-y-2">
              <label htmlFor="category" className="text-sm font-medium">
                Category
              </label>
              <select
                id="category"
                name="category"
                defaultValue={category ?? "all"}
                className="h-11 w-full rounded-xl border bg-background px-3 text-sm"
              >
                <option value="all">All categories</option>
                {LISTING_CATEGORIES.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="pricing_mode" className="text-sm font-medium">
                Rental mode
              </label>
              <select
                id="pricing_mode"
                name="pricing_mode"
                defaultValue={pricingMode ?? "all"}
                className="h-11 w-full rounded-xl border bg-background px-3 text-sm"
              >
                <option value="all">Any mode</option>
                <option value="hourly">Hourly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="city" className="text-sm font-medium">
                City
              </label>
              <select
                id="city"
                name="city"
                defaultValue={city ?? "all"}
                className="h-11 w-full rounded-xl border bg-background px-3 text-sm"
              >
                <option value="all">All cities</option>
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="district" className="text-sm font-medium">
                District / area
              </label>
              <select
                id="district"
                name="district"
                defaultValue={district ?? "all"}
                className="h-11 w-full rounded-xl border bg-background px-3 text-sm"
              >
                <option value="all">All areas</option>
                {districts.map((district) => (
                  <option key={district} value={district}>
                    {district}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-5 rounded-2xl border bg-muted/30 p-4">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Price range</p>
                <p className="text-xs text-muted-foreground">
                  Enter a minimum, maximum, or both.
                </p>
              </div>

              <p className="text-xs text-muted-foreground">
                {pricingMode === "monthly" ? "Monthly price" : "Hourly price"}
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-2">
                <label
                  htmlFor="min_price"
                  className="text-xs font-medium text-muted-foreground"
                >
                  Minimum price
                </label>
                <div className="flex h-11 items-center rounded-xl border bg-background px-3">
                  <span className="mr-2 text-sm text-muted-foreground">€</span>
                  <input
                    id="min_price"
                    name="min_price"
                    type="number"
                    min="0"
                    step="1"
                    defaultValue={minPrice ?? ""}
                    placeholder="No minimum"
                    className="w-full bg-transparent text-sm outline-none"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="max_price"
                  className="text-xs font-medium text-muted-foreground"
                >
                  Maximum price
                </label>
                <div className="flex h-11 items-center rounded-xl border bg-background px-3">
                  <span className="mr-2 text-sm text-muted-foreground">€</span>
                  <input
                    id="max_price"
                    name="max_price"
                    type="number"
                    min="0"
                    step="1"
                    defaultValue={maxPrice ?? ""}
                    placeholder="No maximum"
                    className="w-full bg-transparent text-sm outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-end gap-3 border-t pt-5">
            <Link
              href="/listings"
              className="rounded-xl border px-4 py-2 text-sm font-medium transition hover:bg-muted"
            >
              Reset
            </Link>

            <button
              type="submit"
              className="rounded-xl bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90"
            >
              Apply filters
            </button>
          </div>
        </form>
      ) : null}
    </div>
  );
}
