// app/listings/[id]/actions.ts
"use server";

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

  // Validate fields
  const fieldErrors: BookingFormFieldErrors = {};

  if (!values.guest_name) {
    fieldErrors.guest_name = "Please enter your name.";
  }

  if (values.booking_mode !== "hourly" && values.booking_mode !== "monthly") {
    fieldErrors.booking_mode = "Please choose a booking mode.";
  }

  let checkIn = "";
  let checkOut = "";
  let startAt: string | null = null;
  let endAt: string | null = null;
  let total = 0;

  if (values.booking_mode === "hourly") {
    if (!values.date) fieldErrors.date = "Please pick a date.";
    if (!values.start_time)
      fieldErrors.start_time = "Please pick a start time.";
    if (!values.end_time) fieldErrors.end_time = "Please pick an end time.";

    if (values.date && values.start_time && values.end_time) {
      startAt = `${values.date}T${values.start_time}:00`;
      const startDateObj = new Date(startAt);

      let endDateStr = values.date;
      if (values.end_time <= values.start_time) {
        const nextDay = new Date(startDateObj.getTime() + 24 * 60 * 60 * 1000);
        endDateStr = nextDay.toISOString().slice(0, 10);
      }
      endAt = `${endDateStr}T${values.end_time}:00`;

      const start = new Date(startAt);
      const end = new Date(endAt);
      const hours = (end.getTime() - start.getTime()) / 1000 / 60 / 60;

      if (hours <= 0) {
        fieldErrors.end_time = "End time must be after start time.";
      } else if (hours > 24) {
        fieldErrors.end_time = "Hourly bookings cannot exceed 24 hours.";
      } else {
        checkIn = values.date;
        checkOut = endDateStr;
        total = Math.ceil(hours) * listing.price_per_hour;
      }
    }
  } else if (values.booking_mode === "monthly") {
    if (!values.check_in) fieldErrors.check_in = "Please pick a check-in date.";
    if (!values.check_out)
      fieldErrors.check_out = "Please pick a check-out date.";

    if (values.check_in && values.check_out) {
      const start = new Date(values.check_in);
      const end = new Date(values.check_out);
      const days = (end.getTime() - start.getTime()) / 1000 / 60 / 60 / 24;

      if (days <= 0) {
        fieldErrors.check_out = "Check-out must be after check-in.";
      } else {
        checkIn = values.check_in;
        checkOut = values.check_out;
        const months = Math.ceil(days / 30);
        total = months * listing.price_per_month;
      }
    }
  }

  if (Object.keys(fieldErrors).length > 0) {
    return fail(values, fieldErrors);
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
    guest_name: values.guest_name,
    check_in: checkIn,
    check_out: checkOut,
    booking_mode: values.booking_mode,
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
