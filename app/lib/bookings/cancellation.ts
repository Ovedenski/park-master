// Centralized cancellation rules. The same module is consumed by:
//   - Guest server action  (app/account/bookings/actions.ts)
//   - Host server action   (app/account/reservations/actions.ts)
//   - UI guards            (any page that renders a "Cancel" button)
//
// Keeping the logic in one place means the button you see and the action that
// runs can never disagree.

/** Minimum hours of notice required to cancel an already-approved booking. */
export const GUEST_CANCELLATION_WINDOW_HOURS = 24;

export type BookingStatus = "pending" | "booked" | "cancelled";

/**
 * Shape of the data this module needs about a booking. Designed to be a
 * subset of both `BookingListItem` and the raw DB row so any caller can
 * supply a value without remapping.
 */
export type CancellableBooking = {
  status: BookingStatus;
  /** The check-in date, ISO string (YYYY-MM-DD or full ISO). */
  check_in: string;
};

export type CancellationDecision = {
  allowed: boolean;
  reason: string;
};

/** Hours between `from` and `to`. May be negative if `to` is in the past. */
function hoursBetween(from: Date, to: Date): number {
  return (to.getTime() - from.getTime()) / (1000 * 60 * 60);
}

/**
 * Decide whether a guest is allowed to cancel one of their own bookings.
 *
 * @param booking  status + check_in
 * @param now      override for testability — defaults to `new Date()`
 */
export function canGuestCancel(
  booking: CancellableBooking,
  now: Date = new Date(),
): CancellationDecision {
  if (booking.status === "cancelled") {
    return { allowed: false, reason: "This booking is already cancelled." };
  }

  const checkIn = new Date(booking.check_in);
  const hoursUntilCheckIn = hoursBetween(now, checkIn);

  // `pending` bookings haven't been approved yet — guests can always back out.
  if (booking.status === "pending") {
    return { allowed: true, reason:"" };
  }

  // `booked` bookings: must give enough notice and not be in the past.
  if (hoursUntilCheckIn <= 0) {
    return {
      allowed: false,
      reason: "This booking has already started or finished.",
    };
  }

  if (hoursUntilCheckIn < GUEST_CANCELLATION_WINDOW_HOURS) {
    return {
      allowed: false,
      reason: `Bookings can only be cancelled at least ${GUEST_CANCELLATION_WINDOW_HOURS} hours before check-in.`,
    };
  }

  return { allowed: true, reason: "" };
}

/**
 * Decide whether a host is allowed to cancel a booking on their own listing.
 * Hosts have slightly different rules:
 *   - `pending`: always cancellable (this is the "reject" path)
 *   - `booked`:  cancellable until check-in (no notice window — hosts may
 *                have an emergency; the policy puts the user-impact on them
 *                rather than on the guest)
 */
export function canHostCancel(
  booking: CancellableBooking,
  now: Date = new Date(),
): CancellationDecision {
  if (booking.status === "cancelled") {
    return { allowed: false, reason: "This reservation is already cancelled." };
  }

  if (booking.status === "pending") {
    return { allowed: true, reason: "" };
  }

  // booked
  const checkIn = new Date(booking.check_in);
  const hoursUntilCheckIn = hoursBetween(now, checkIn);

  if (hoursUntilCheckIn <= 0) {
    return {
      allowed: false,
      reason: "This reservation has already started or finished.",
    };
  }

  return { allowed: true, reason: "" };
}
