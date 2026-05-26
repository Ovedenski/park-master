"use client";

import { useActionState, useMemo, useState, useEffect } from "react";
import { createBookingAction } from "@/listings/[id]/actions";
import { emptyBookingFormState } from "@/lib/types";
import type { Listing } from "@/lib/types";
import {
  calcHourlyTotal,
  HOURLY_BOOKING_MAX_HOURS,
  HOURLY_BOOKING_MIN_MINUTES,
} from "@/lib/billing";
import { formatNumber, formatPrice, formatPricePerUnit } from "@/lib/format";

type BookingFormProps = {
  listing: Listing;
  isOwner: boolean;
  isLoggedIn: boolean;
};

export default function BookingForm({
  listing,
  isOwner,
  isLoggedIn,
}: BookingFormProps) {
  const canBookHourly =
    listing.pricing_mode === "hourly" || listing.pricing_mode === "both";

  const canBookMonthly =
    listing.pricing_mode === "monthly" || listing.pricing_mode === "both";

  const [state, formAction, isPending] = useActionState(
    createBookingAction,
    emptyBookingFormState,
  );

  useEffect(() => {
    const firstErrorField = Object.keys(state.fieldErrors)[0];
    if (!firstErrorField) return;
  
    const el = document.querySelector<HTMLElement>(`[name="${firstErrorField}"]`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      // small delay so focus doesn't fight the scroll
      setTimeout(() => (el as HTMLElement).focus({ preventScroll: true }), 300);
    }
    }, [state]);

  const today = new Date().toISOString().slice(0, 10);

  // Local state for live preview — seeded from the action state so values
  // survive a failed submit
  const [date, setDate] = useState(state.values.date ?? today);
  const [startTime, setStartTime] = useState(state.values.start_time ?? "");
  const [endTime, setEndTime] = useState(state.values.end_time ?? "");

  const hourlyPreview = useMemo(() => {
    if (!date || !startTime || !endTime) return null;

    const isOvernight = endTime <= startTime;
    const startAt = new Date(`${date}T${startTime}:00`);
    const endDateObj = isOvernight
      ? new Date(startAt.getTime() + 24 * 60 * 60 * 1000)
      : startAt;
    const endDateStr = endDateObj.toISOString().slice(0, 10);
    const endAt = new Date(`${endDateStr}T${endTime}:00`);

    const rawMinutes = (endAt.getTime() - startAt.getTime()) / 1000 / 60;
    const rawHours = rawMinutes / 60;

    if (
      rawMinutes < HOURLY_BOOKING_MIN_MINUTES ||
      rawHours > HOURLY_BOOKING_MAX_HOURS
    ) {
      return {
        isOvernight,
        hours: rawHours,
        endDateStr,
        invalid: true as const,
      };
    }

    const { billedHours, total } = calcHourlyTotal(
      rawHours,
      listing.price_per_hour,
    );

    return {
      isOvernight,
      hours: rawHours,
      billedHours,
      total,
      endDateStr,
      invalid: false as const,
    };
  }, [date, startTime, endTime, listing.price_per_hour]);

  if (isOwner) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
        <p className="font-medium text-amber-900">This is your listing.</p>
        <p className="mt-1 text-sm text-amber-700">
          You cannot book your own parking spot.
        </p>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="rounded-2xl border border-neutral-200 p-6">
        <p className="font-medium">Log in to book this spot.</p>
      </div>
    );
  }

  const defaultMode: "hourly" | "monthly" =
    state.values.booking_mode ?? (canBookHourly ? "hourly" : "monthly");

  return (
    <div className="rounded-2xl border border-neutral-200 p-6">
      <h2 className="text-xl font-semibold">Book this spot</h2>

      {/* Top-level error message (non-field-specific) */}
      {state.message && !state.success && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {state.message}
        </div>
      )}

      <form action={formAction} className="mt-5 space-y-5">
        <input type="hidden" name="listing_id" value={listing.id} />

        <div>
          <label className="text-sm font-medium">Your name</label>
          <input
            name="guest_name"
            defaultValue={state.values.guest_name ?? ""}
            className="mt-1 w-full rounded-xl border border-neutral-300 px-4 py-2"
          />
          {state.fieldErrors.guest_name && (
            <p className="mt-1 text-sm text-red-600">
              {state.fieldErrors.guest_name}
            </p>
          )}
        </div>

        {state.fieldErrors.booking_mode && (
          <p className="text-sm text-red-600">
            {state.fieldErrors.booking_mode}
          </p>
        )}

        {canBookHourly && (
          <div className="space-y-4 rounded-xl border border-neutral-200 p-4">
            <label className="flex items-center gap-2 font-medium">
              <input
                type="radio"
                name="booking_mode"
                value="hourly"
                defaultChecked={defaultMode === "hourly"}
              />
              Hourly booking
            </label>

            <div>
              <label className="text-sm font-medium">Date</label>
              <input
                type="date"
                name="date"
                min={today}
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="mt-1 w-full rounded-xl border border-neutral-300 px-4 py-2"
              />
              {state.fieldErrors.date && (
                <p className="mt-1 text-sm text-red-600">
                  {state.fieldErrors.date}
                </p>
              )}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium">Start time</label>
                <input
                  type="time"
                  name="start_time"
                  step={900}
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-neutral-300 px-4 py-2"
                />
                {state.fieldErrors.start_time && (
                  <p className="mt-1 text-sm text-red-600">
                    {state.fieldErrors.start_time}
                  </p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium">End time</label>
                <input
                  type="time"
                  name="end_time"
                  step={900}
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-neutral-300 px-4 py-2"
                />
                {state.fieldErrors.end_time && (
                  <p className="mt-1 text-sm text-red-600">
                    {state.fieldErrors.end_time}
                  </p>
                )}
              </div>
            </div>

            <p className="text-xs text-neutral-500">
              Tip: if end time is the same or earlier than start time, the
              booking will roll over to the next day (e.g. 22:00 → 02:00).
            </p>

            {hourlyPreview && (
              <div
                className={`rounded-lg border p-3 text-sm ${
                  hourlyPreview.invalid
                    ? "border-red-200 bg-red-50 text-red-700"
                    : "border-neutral-200 bg-neutral-50 text-neutral-700"
                }`}
              >
                {hourlyPreview.invalid ? (
                  <p>
                    Please pick a valid time range (minimum{" "}
                    {HOURLY_BOOKING_MIN_MINUTES} minutes, maximum{" "}
                    {HOURLY_BOOKING_MAX_HOURS} hours).
                  </p>
                ) : (
                  <>
                    <p>
                      <span className="font-medium">Duration:</span>{" "}
                      {formatNumber(hourlyPreview.hours)} h
                      {Math.abs(
                        hourlyPreview.billedHours - hourlyPreview.hours,
                      ) > 0.001 && (
                        <span className="text-neutral-500">
                          {" "}
                          (billed as {formatNumber(
                            hourlyPreview.billedHours,
                          )}{" "}
                          h,
                        </span>
                      )}
                    </p>
                    {hourlyPreview.isOvernight && (
                      <p className="mt-1 text-amber-700">
                        Overnight booking — ends on {hourlyPreview.endDateStr}.
                      </p>
                    )}
                    <p className="mt-1 font-medium">
                      Total: {formatPrice(hourlyPreview.total)}
                    </p>
                  </>
                )}
              </div>
            )}

            <p className="text-sm text-neutral-500">
              {formatPricePerUnit(listing.price_per_hour, "hour")}
            </p>
          </div>
        )}

        {canBookMonthly && (
          <div className="space-y-4 rounded-xl border border-neutral-200 p-4">
            <label className="flex items-center gap-2 font-medium">
              <input
                type="radio"
                name="booking_mode"
                value="monthly"
                defaultChecked={defaultMode === "monthly"}
              />
              Monthly booking
            </label>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium">Check in</label>
                <input
                  type="date"
                  name="check_in"
                  min={today}
                  defaultValue={state.values.check_in ?? ""}
                  className="mt-1 w-full rounded-xl border border-neutral-300 px-4 py-2"
                />
                {state.fieldErrors.check_in && (
                  <p className="mt-1 text-sm text-red-600">
                    {state.fieldErrors.check_in}
                  </p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium">Check out</label>
                <input
                  type="date"
                  name="check_out"
                  min={today}
                  defaultValue={state.values.check_out ?? ""}
                  className="mt-1 w-full rounded-xl border border-neutral-300 px-4 py-2"
                />
                {state.fieldErrors.check_out && (
                  <p className="mt-1 text-sm text-red-600">
                    {state.fieldErrors.check_out}
                  </p>
                )}
              </div>
            </div>

            <p className="text-sm text-neutral-500">
              {formatPricePerUnit(listing.price_per_month, "month")}
            </p>
          </div>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-xl bg-black px-4 py-3 font-medium text-white transition hover:bg-neutral-800 disabled:opacity-50"
        >
          {isPending ? "Booking..." : "Book now"}
        </button>
      </form>
    </div>
  );
}
