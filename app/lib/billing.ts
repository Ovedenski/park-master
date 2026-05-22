// Centralized billing math. Keep this on the server AND mirror the result
// in any client preview by importing the helpers below.

export const BILLING_INCREMENT_MINUTES = 15;
export const HOURLY_BOOKING_MIN_MINUTES = 15;
export const HOURLY_BOOKING_MAX_HOURS = 24;

/**
 * Round a raw duration up to the next billing increment.
 * Returns billable hours (e.g. 1.25, 1.5, 1.75, 2.0).
 */
export function roundUpToIncrement(rawHours: number): number {
  const totalMinutes = rawHours * 60;
  const increments = Math.ceil(totalMinutes / BILLING_INCREMENT_MINUTES);
  return (increments * BILLING_INCREMENT_MINUTES) / 60;
}

/**
 * Compute total price for an hourly booking, rounded up to the next
 * billing increment.
 */
export function calcHourlyTotal(
  rawHours: number,
  pricePerHour: number,
): { billedHours: number; total: number } {
  const billedHours = roundUpToIncrement(rawHours);
  // Round to cents to avoid floating-point garbage like 6.2500000001
  const total = Math.round(billedHours * pricePerHour * 100) / 100;
  return { billedHours, total };
}

/**
 * Compute total price for a monthly booking.
 * Days are converted to months (30 days = 1 month) and rounded up.
 */
export function calcMonthlyTotal(
  days: number,
  pricePerMonth: number,
): { months: number; total: number } {
  const months = Math.ceil(days / 30);
  const total = Math.round(months * pricePerMonth * 100) / 100;
  return { months, total };
}
