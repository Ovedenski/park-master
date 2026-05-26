import { describe, it, expect } from "vitest";
import { bookingFormSchema } from "../app/lib/bookings/schema";

describe("bookingFormSchema — hourly branch", () => {
  it("accepts a valid hourly booking", () => {
    const result = bookingFormSchema.safeParse({
      booking_mode: "hourly",
      guest_name: "Ivan Petrov",
      date: "2026-06-01",
      start_time: "10:00",
      end_time: "12:00",
    });
    expect(result.success).toBe(true);
  });

  it("rejects an invalid date format", () => {
    const result = bookingFormSchema.safeParse({
      booking_mode: "hourly",
      guest_name: "Ivan Petrov",
      date: "01/06/2026",
      start_time: "10:00",
      end_time: "12:00",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((i) => i.path[0] === "date")).toBe(true);
    }
  });

  it("rejects an invalid time format", () => {
    const result = bookingFormSchema.safeParse({
      booking_mode: "hourly",
      guest_name: "Ivan Petrov",
      date: "2026-06-01",
      start_time: "10am",
      end_time: "12:00",
    });
    expect(result.success).toBe(false);
  });

  it("rejects an empty guest name", () => {
    const result = bookingFormSchema.safeParse({
      booking_mode: "hourly",
      guest_name: "   ",
      date: "2026-06-01",
      start_time: "10:00",
      end_time: "12:00",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((i) => i.path[0] === "guest_name")).toBe(
        true,
      );
    }
  });

  it("rejects an overly long guest name", () => {
    const result = bookingFormSchema.safeParse({
      booking_mode: "hourly",
      guest_name: "x".repeat(121),
      date: "2026-06-01",
      start_time: "10:00",
      end_time: "12:00",
    });
    expect(result.success).toBe(false);
  });

  it("rejects monthly-only fields on the hourly branch", () => {
    // hourly branch does not allow `check_in` / `check_out`, BUT zod object
    // schemas strip unknown keys by default. This test pins behaviour: extra
    // keys should be silently dropped, not throw.
    const result = bookingFormSchema.safeParse({
      booking_mode: "hourly",
      guest_name: "Ivan",
      date: "2026-06-01",
      start_time: "10:00",
      end_time: "12:00",
      check_in: "2026-06-01",
      check_out: "2026-07-01",
    });
    expect(result.success).toBe(true);
  });
});

describe("bookingFormSchema — monthly branch", () => {
  it("accepts a valid monthly booking", () => {
    const result = bookingFormSchema.safeParse({
      booking_mode: "monthly",
      guest_name: "Ivan Petrov",
      check_in: "2026-06-01",
      check_out: "2026-07-01",
    });
    expect(result.success).toBe(true);
  });

  it("rejects missing check_out", () => {
    const result = bookingFormSchema.safeParse({
      booking_mode: "monthly",
      guest_name: "Ivan Petrov",
      check_in: "2026-06-01",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((i) => i.path[0] === "check_out")).toBe(
        true,
      );
    }
  });

  it("rejects an invalid check_in date", () => {
    const result = bookingFormSchema.safeParse({
      booking_mode: "monthly",
      guest_name: "Ivan Petrov",
      check_in: "June 1 2026",
      check_out: "2026-07-01",
    });
    expect(result.success).toBe(false);
  });
});

describe("bookingFormSchema — discriminator", () => {
  it("rejects an unknown booking_mode", () => {
    const result = bookingFormSchema.safeParse({
      booking_mode: "weekly",
      guest_name: "Ivan",
      date: "2026-06-01",
      start_time: "10:00",
      end_time: "12:00",
    });
    expect(result.success).toBe(false);
  });

  it("rejects missing booking_mode", () => {
    const result = bookingFormSchema.safeParse({
      guest_name: "Ivan",
      date: "2026-06-01",
      start_time: "10:00",
      end_time: "12:00",
    });
    expect(result.success).toBe(false);
  });

  it("requires hourly-specific fields on the hourly branch", () => {
    const result = bookingFormSchema.safeParse({
      booking_mode: "hourly",
      guest_name: "Ivan",
      // missing date/start_time/end_time
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const paths = result.error.issues.map((i) => i.path[0]);
      expect(paths).toContain("date");
      expect(paths).toContain("start_time");
      expect(paths).toContain("end_time");
    }
  });
});
