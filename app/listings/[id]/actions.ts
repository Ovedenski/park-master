"use server";
import { bookingFormSchema } from "@/lib/bookings/schema";

import {
  HOURLY_BOOKING_MAX_HOURS,
  HOURLY_BOOKING_MIN_MINUTES,
  calcHourlyTotal,
  calcMonthlyTotal,
} from "@/lib/billing";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type {
  BookingFormFieldErrors,
  BookingFormState,
  BookingFormValues,
} from "@/lib/types";

function fail(
  values: BookingFormValues,
  fieldErrors: BookingFormFieldErrors,
  message = "Please correct the highlighted fields.",
): BookingFormState {
  return { success: false, message, fieldErrors, values };
}

export async function createBookingAction(
  _prevState: BookingFormState,
  formData: FormData,
): Promise<BookingFormState> {
  const supabase = await createClient();

  // Collect raw values up front so we can re-populate the form on error
  const values: BookingFormValues = {
    guest_name: String(formData.get("guest_name") ?? "").trim(),
    booking_mode:
      (String(formData.get("booking_mode") ?? "") as "hourly" | "monthly") ||
      undefined,
    date: String(formData.get("date") ?? ""),
    start_time: String(formData.get("start_time") ?? ""),
    end_time: String(formData.get("end_time") ?? ""),
    check_in: String(formData.get("check_in") ?? ""),
    check_out: String(formData.get("check_out") ?? ""),
  };

  const listingId = String(formData.get("listing_id") ?? "");
  if (!listingId) {
    return fail(values, {}, "Missing listing.");
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return fail(values, {}, "You must be logged in to book.");
  }

  const { data: listing, error: listingError } = await supabase
    .from("listings")
    .select("*")
    .eq("id", listingId)
    .single();

  if (listingError || !listing) {
    return fail(values, {}, "Listing not found.");
  }

  if (listing.host_id === user.id) {
    return fail(values, {}, "You cannot book your own listing.");
  }

  if (listing.status !== "active") {
    return fail(values, {}, "This listing is not available.");
  }

  // --- Zod validation (shape + required fields per mode) ---
  const parsed = bookingFormSchema.safeParse(values);

  if (!parsed.success) {
    const fieldErrors: BookingFormFieldErrors = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (
        typeof key === "string" &&
        !fieldErrors[key as keyof BookingFormFieldErrors]
      ) {
        fieldErrors[key as keyof BookingFormFieldErrors] = issue.message;
      }
    }
    return fail(values, fieldErrors);
  }

  const data = parsed.data; // ← narrowed: hourly OR monthly, fields guaranteed

  // --- Business-rule validation (needs DB / cross-field math) ---
  const businessErrors: BookingFormFieldErrors = {};

  let checkIn = "";
  let checkOut = "";
  let startAt: string | null = null;
  let endAt: string | null = null;
  let total = 0;

  if (data.booking_mode === "hourly") {
    startAt = `${data.date}T${data.start_time}:00`;
    const startDateObj = new Date(startAt);

    let endDateStr = data.date;
    if (data.end_time <= data.start_time) {
      const nextDay = new Date(startDateObj.getTime() + 24 * 60 * 60 * 1000);
      endDateStr = nextDay.toISOString().slice(0, 10);
    }
    endAt = `${endDateStr}T${data.end_time}:00`;

    const start = new Date(startAt);
    const end = new Date(endAt);
    const rawMinutes = (end.getTime() - start.getTime()) / 1000 / 60;
    const rawHours = rawMinutes / 60;

    if (rawMinutes < HOURLY_BOOKING_MIN_MINUTES) {
      businessErrors.end_time = `Minimum booking is ${HOURLY_BOOKING_MIN_MINUTES} minutes.`;
    } else if (rawHours > HOURLY_BOOKING_MAX_HOURS) {
      businessErrors.end_time = `Hourly bookings cannot exceed ${HOURLY_BOOKING_MAX_HOURS} hours.`;
    } else {
      checkIn = data.date;
      checkOut = endDateStr;
      total = calcHourlyTotal(rawHours, listing.price_per_hour).total;
    }
  } else {
    // monthly — narrowed by Zod, check_in / check_out are guaranteed present
    const start = new Date(data.check_in);
    const end = new Date(data.check_out);
    const days = (end.getTime() - start.getTime()) / 1000 / 60 / 60 / 24;

    if (days <= 0) {
      businessErrors.check_out = "Check-out must be after check-in.";
    } else {
      checkIn = data.check_in;
      checkOut = data.check_out;
      total = calcMonthlyTotal(days, listing.price_per_month).total;
    }
  }

  if (Object.keys(businessErrors).length > 0) {
    return fail(values, businessErrors);
  }

  // Pre-check for overlapping bookings (friendly error before hitting DB)
  const overlapStart =
    values.booking_mode === "hourly" ? startAt! : `${checkIn}T00:00:00`;
  const overlapEnd =
    values.booking_mode === "hourly" ? endAt! : `${checkOut}T00:00:00`;

  const { data: conflicts, error: conflictError } = await supabase
    .from("bookings")
    .select("id")
    .eq("listing_id", listingId)
    .in("status", ["pending", "booked"])
    .or(
      values.booking_mode === "hourly"
        ? `and(start_at.lt.${overlapEnd},end_at.gt.${overlapStart})`
        : `and(check_in.lt.${checkOut},check_out.gt.${checkIn})`,
    )
    .limit(1);

  if (conflictError) {
    return fail(values, {}, conflictError.message);
  }

  if (conflicts && conflicts.length > 0) {
    return fail(
      values,
      {},
      "This spot is already booked for the selected time. Please choose another slot.",
    );
  }

  // Insert booking — DB constraint catches any race that slipped past pre-check
  const { error: bookingError } = await supabase.from("bookings").insert({
    user_id: user.id,
    listing_id: listingId,
    guest_name: data.guest_name,
    check_in: checkIn,
    check_out: checkOut,
    booking_mode: data.booking_mode,
    start_at: startAt,
    end_at: endAt,
    total,
    status: "pending",
  });

  if (bookingError) {
    if (
      bookingError.code === "23P01" ||
      bookingError.message?.includes("bookings_no_overlap")
    ) {
      return fail(
        values,
        {},
        "This spot was just booked by someone else. Please choose another slot.",
      );
    }
    return fail(values, {}, bookingError.message);
  }

  revalidatePath(`/listings/${listingId}`);
  redirect("/account/bookings");
}
