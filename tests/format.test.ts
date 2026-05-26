import { describe, it, expect } from "vitest";
import {
  formatPrice,
  formatPriceCompact,
  formatPricePerUnit,
  formatNumber,
} from "../app/lib/format";

/**
 * Note: Intl output uses a non-breaking space (U+00A0) between the amount and
 * the currency symbol, so we normalise spaces before comparing.
 */
function normalise(s: string) {
  return s.replace(/\u00A0/g, " ");
}

describe("formatPrice", () => {
  it("formats a whole number with 2 decimals and €", () => {
    expect(normalise(formatPrice(5))).toBe("5,00 €");
  });

  it("formats a decimal value", () => {
    expect(normalise(formatPrice(5.5))).toBe("5,50 €");
  });

  it("rounds to 2 decimals", () => {
    expect(normalise(formatPrice(5.999))).toBe("6,00 €");
  });

  it("returns an em-dash for null", () => {
    expect(formatPrice(null)).toBe("—");
  });

  it("returns an em-dash for undefined", () => {
    expect(formatPrice(undefined)).toBe("—");
  });

  it("returns an em-dash for NaN", () => {
    expect(formatPrice(Number.NaN)).toBe("—");
  });
});

describe("formatPriceCompact", () => {
  it("drops cents on whole numbers", () => {
    expect(normalise(formatPriceCompact(5))).toBe("5 €");
  });

  it("keeps the minimum needed digits on decimal values", () => {
    expect(normalise(formatPriceCompact(5.5))).toBe("5,5 €");
  });

  it("keeps both cents when needed", () => {
    expect(normalise(formatPriceCompact(5.55))).toBe("5,55 €");
  });

  it("rounds to 2 decimals max", () => {
    expect(normalise(formatPriceCompact(5.999))).toBe("6 €");
  });
});

describe("formatPricePerUnit", () => {
  it("appends ' / hour'", () => {
    expect(normalise(formatPricePerUnit(5, "hour"))).toBe("5,00 € / hour");
  });

  it("appends ' / month'", () => {
    expect(normalise(formatPricePerUnit(200, "month"))).toBe(
      "200,00 € / month",
    );
  });

  it("falls back to '— / hour' for null", () => {
    expect(formatPricePerUnit(null, "hour")).toBe("— / hour");
  });
});

describe("formatNumber", () => {
  it("uses comma as decimal separator", () => {
    expect(formatNumber(1.25)).toBe("1,25");
  });

  it("returns em-dash for null", () => {
    expect(formatNumber(null)).toBe("—");
  });
});