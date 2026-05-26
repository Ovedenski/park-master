import { describe, it, expect } from "vitest";
import {
  roundUpToIncrement,
  calcHourlyTotal,
  calcMonthlyTotal,
  BILLING_INCREMENT_MINUTES,
  HOURLY_BOOKING_MIN_MINUTES,
  HOURLY_BOOKING_MAX_HOURS,
} from "../app/lib/billing";

describe("billing constants", () => {
  it("uses a 15-minute increment", () => {
    expect(BILLING_INCREMENT_MINUTES).toBe(15);
    expect(HOURLY_BOOKING_MIN_MINUTES).toBe(15);
    expect(HOURLY_BOOKING_MAX_HOURS).toBe(24);
  });
});

describe("roundUpToIncrement", () => {
  it("returns 0 for 0 hours", () => {
    expect(roundUpToIncrement(0)).toBe(0);
  });

  it("rounds 0.1 hours (6 min) up to 0.25 (15 min)", () => {
    expect(roundUpToIncrement(0.1)).toBe(0.25);
  });

  it("keeps exact increments unchanged", () => {
    expect(roundUpToIncrement(0.25)).toBe(0.25);
    expect(roundUpToIncrement(0.5)).toBe(0.5);
    expect(roundUpToIncrement(1)).toBe(1);
  });

  it("rounds 1.1 hours up to 1.25", () => {
    expect(roundUpToIncrement(1.1)).toBe(1.25);
  });

  it("rounds 1.26 hours up to 1.5", () => {
    expect(roundUpToIncrement(1.26)).toBe(1.5);
  });
});

describe("calcHourlyTotal", () => {
  it("returns 0 for 0 hours", () => {
    expect(calcHourlyTotal(0, 5)).toEqual({ billedHours: 0, total: 0 });
  });

  it("computes a full hour exactly", () => {
    expect(calcHourlyTotal(1, 5)).toEqual({ billedHours: 1, total: 5 });
  });

  it("rounds partial hours up to the next 15 min", () => {
    // 1h 10m -> billed as 1.25h * 5 BGN = 6.25
    expect(calcHourlyTotal(1 + 10 / 60, 5)).toEqual({
      billedHours: 1.25,
      total: 6.25,
    });
  });

  it("rounds money to two decimals", () => {
    // 1.25h * 4.99 = 6.2375 -> 6.24
    expect(calcHourlyTotal(1.25, 4.99).total).toBe(6.24);
  });

  it("handles 24h (max) correctly", () => {
    expect(calcHourlyTotal(24, 3)).toEqual({ billedHours: 24, total: 72 });
  });

  it("rounds 15-minute increment (min) correctly", () => {
    expect(calcHourlyTotal(15 / 60, 8)).toEqual({
      billedHours: 0.25,
      total: 2,
    });
  });

  it("handles fractional pricePerHour without floating point garbage", () => {
    // 1.5h * 3.33 = 4.995 -> 5.00 (rounded to cents)
    expect(calcHourlyTotal(1.5, 3.33).total).toBe(5);
  });
});

describe("calcMonthlyTotal", () => {
  it("returns 0 for 0 days", () => {
    expect(calcMonthlyTotal(0, 100)).toEqual({ months: 0, total: 0 });
  });

  it("counts 1 day as 1 month (rounded up)", () => {
    expect(calcMonthlyTotal(1, 100)).toEqual({ months: 1, total: 100 });
  });

  it("counts exactly 30 days as 1 month", () => {
    expect(calcMonthlyTotal(30, 100)).toEqual({ months: 1, total: 100 });
  });

  it("counts 31 days as 2 months", () => {
    expect(calcMonthlyTotal(31, 100)).toEqual({ months: 2, total: 200 });
  });

  it("counts 60 days as 2 months", () => {
    expect(calcMonthlyTotal(60, 100)).toEqual({ months: 2, total: 200 });
  });

  it("counts 61 days as 3 months", () => {
    expect(calcMonthlyTotal(61, 100)).toEqual({ months: 3, total: 300 });
  });

  it("rounds money to two decimals", () => {
    // 2 months * 99.999 = 199.998 -> 200.00
    expect(calcMonthlyTotal(45, 99.999).total).toBe(200);
  });
});
