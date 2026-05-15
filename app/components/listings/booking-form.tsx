// components/listings/booking-form.tsx
"use client";

import { createBookingAction } from "@/listings/[id]/actions";
import type { MyListing } from "@/lib/types";

type BookingFormProps = {
  listing: MyListing;
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

  return (
    <div className="rounded-2xl border border-neutral-200 p-6">
      <h2 className="text-xl font-semibold">Book this spot</h2>

      <form action={createBookingAction} className="mt-5 space-y-5">
        <input type="hidden" name="listing_id" value={listing.id} />

        <div>
          <label className="text-sm font-medium">Your name</label>
          <input
            name="guest_name"
            required
            className="mt-1 w-full rounded-xl border border-neutral-300 px-4 py-2"
          />
        </div>

        {canBookHourly && (
          <div className="space-y-4 rounded-xl border border-neutral-200 p-4">
            <label className="flex items-center gap-2 font-medium">
              <input
                type="radio"
                name="booking_mode"
                value="hourly"
                defaultChecked={!canBookMonthly}
              />
              Hourly booking
            </label>

            <div>
              <label className="text-sm font-medium">Date</label>
              <input
                type="date"
                name="date"
                className="mt-1 w-full rounded-xl border border-neutral-300 px-4 py-2"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium">Start time</label>
                <input
                  type="time"
                  name="start_time"
                  className="mt-1 w-full rounded-xl border border-neutral-300 px-4 py-2"
                />
              </div>

              <div>
                <label className="text-sm font-medium">End time</label>
                <input
                  type="time"
                  name="end_time"
                  className="mt-1 w-full rounded-xl border border-neutral-300 px-4 py-2"
                />
              </div>
            </div>

            <p className="text-sm text-neutral-500">
              ${listing.price_per_hour} per hour
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
                defaultChecked={!canBookHourly}
              />
              Monthly booking
            </label>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium">Check in</label>
                <input
                  type="date"
                  name="check_in"
                  className="mt-1 w-full rounded-xl border border-neutral-300 px-4 py-2"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Check out</label>
                <input
                  type="date"
                  name="check_out"
                  className="mt-1 w-full rounded-xl border border-neutral-300 px-4 py-2"
                />
              </div>
            </div>

            <p className="text-sm text-neutral-500">
              ${listing.price_per_month} per month
            </p>
          </div>
        )}

        <button
          type="submit"
          className="w-full rounded-xl bg-black px-4 py-3 font-medium text-white transition hover:bg-neutral-800"
        >
          Book now
        </button>
      </form>
    </div>
  );
}
