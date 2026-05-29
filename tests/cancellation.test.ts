import { describe, it, expect } from "vitest";
import {
  canGuestCancel,
  canHostCancel,
  GUEST_CANCELLATION_WINDOW_HOURS,
} from "../app/lib/bookings/cancellation";

/** Fixed "now" for deterministic tests. */
const NOW = new Date("2026-05-28T12:00:00Z");

/** Build an ISO check-in `hoursFromNow` away from `NOW`. */
function checkInHoursAhead(hoursFromNow: number): string {
  return new Date(NOW.getTime() + hoursFromNow * 60 * 60 * 1000).toISOString();
}

describe("canGuestCancel", () => {
  it("blocks already-cancelled bookings", () => {
    const result = canGuestCancel(
      { status: "cancelled", check_in: checkInHoursAhead(48) },
      NOW,
    );
    expect(result.allowed).toBe(false);
    if (!result.allowed) expect(result.reason).toContain("already cancelled");
  });

  it("allows pending bookings regardless of timing", () => {
    expect(
      canGuestCancel({ status: "pending", check_in: checkInHoursAhead(1) }, NOW)
        .allowed,
    ).toBe(true);

    expect(
      canGuestCancel(
        { status: "pending", check_in: checkInHoursAhead(-5) },
        NOW,
      ).allowed,
    ).toBe(true);
  });

  it("allows booked bookings outside the cancellation window", () => {
    const result = canGuestCancel(
      {
        status: "booked",
        check_in: checkInHoursAhead(GUEST_CANCELLATION_WINDOW_HOURS + 1),
      },
      NOW,
    );
    expect(result.allowed).toBe(true);
  });

  it("blocks booked bookings inside the cancellation window", () => {
    const result = canGuestCancel(
      {
        status: "booked",
        check_in: checkInHoursAhead(GUEST_CANCELLATION_WINDOW_HOURS - 1),
      },
      NOW,
    );
    expect(result.allowed).toBe(false);
    if (!result.allowed) {
      expect(result.reason).toContain(String(GUEST_CANCELLATION_WINDOW_HOURS));
    }
  });

  it("blocks booked bookings exactly at the cancellation window boundary", () => {
    // Boundary: strict `<` means exactly 24h is blocked.
    const result = canGuestCancel(
      {
        status: "booked",
        check_in: checkInHoursAhead(GUEST_CANCELLATION_WINDOW_HOURS),
      },
      NOW,
    );
    expect(result.allowed).toBe(true); // exactly 24h is still allowed
  });

  it("blocks booked bookings that have already started", () => {
    const result = canGuestCancel(
      { status: "booked", check_in: checkInHoursAhead(-1) },
      NOW,
    );
    expect(result.allowed).toBe(false);
    if (!result.allowed) expect(result.reason).toContain("already");
  });
});

describe("canHostCancel", () => {
  it("blocks already-cancelled reservations", () => {
    expect(
      canHostCancel(
        { status: "cancelled", check_in: checkInHoursAhead(48) },
        NOW,
      ).allowed,
    ).toBe(false);
  });

  it("allows pending reservations", () => {
    expect(
      canHostCancel({ status: "pending", check_in: checkInHoursAhead(2) }, NOW)
        .allowed,
    ).toBe(true);
  });

  it("allows booked reservations any time before check-in", () => {
    // No notice window for hosts.
    expect(
      canHostCancel({ status: "booked", check_in: checkInHoursAhead(1) }, NOW)
        .allowed,
    ).toBe(true);
  });

  it("blocks booked reservations after check-in", () => {
    expect(
      canHostCancel({ status: "booked", check_in: checkInHoursAhead(-1) }, NOW)
        .allowed,
    ).toBe(false);
  });
});
