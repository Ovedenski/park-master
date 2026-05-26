// Centralized currency + number formatting.
//
// Use these helpers everywhere instead of inline `${value}` / `toFixed` / `€`.
// They guarantee a single source of truth for currency, locale, and decimals,
// and they automatically handle null / NaN safely.

const LOCALE = "bg-BG";
const CURRENCY = "EUR";

// Cached formatters — `Intl.NumberFormat` is expensive to construct.
const currencyFormatter = new Intl.NumberFormat(LOCALE, {
  style: "currency",
  currency: CURRENCY,
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const compactCurrencyFormatter = new Intl.NumberFormat(LOCALE, {
  style: "currency",
  currency: CURRENCY,
  // Drop the cents when the amount is a whole number, keep them otherwise.
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

const numberFormatter = new Intl.NumberFormat(LOCALE, {
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

/**
 * Format a monetary amount as Bulgarian Lev (BGN), always with 2 decimals.
 * `null`, `undefined`, and `NaN` render as an em-dash.
 *
 * Example: `formatPrice(5)` -> `"5,00 лв."`
 */
export function formatPrice(amount: number | null | undefined): string {
  if (amount == null || Number.isNaN(amount)) return "—";
  return currencyFormatter.format(amount);
}

/**
 * Same as `formatPrice` but drops the cents when the amount is a whole number.
 *
 * Example: `formatPriceCompact(5)` -> `"5 лв."`, `formatPriceCompact(5.5)` -> `"5,50 лв."`
 */
export function formatPriceCompact(amount: number | null | undefined): string {
  if (amount == null || Number.isNaN(amount)) return "—";
  return compactCurrencyFormatter.format(amount);
}

/**
 * Format a price together with its per-unit suffix.
 *
 * Example: `formatPricePerUnit(5, "hour")` -> `"5,00 лв. / hour"`
 */
export function formatPricePerUnit(
  amount: number | null | undefined,
  unit: "hour" | "month",
): string {
  return `${formatPrice(amount)} / ${unit}`;
}

/**
 * Format an arbitrary number using the bg-BG locale (comma decimal separator).
 *
 * Example: `formatNumber(1.25)` -> `"1,25"`
 */
export function formatNumber(value: number | null | undefined): string {
  if (value == null || Number.isNaN(value)) return "—";
  return numberFormatter.format(value);
}
