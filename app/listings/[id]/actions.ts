// app/listings/[id]/actions.ts
"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function createBookingAction(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("You must be logged in to book.");
  }

  const listingId = String(formData.get("listing_id"));
  const bookingMode = String(formData.get("booking_mode"));
  const guestName = String(formData.get("guest_name"));

  const { data: listing, error: listingError } = await supabase
    .from("listings")
    .select("*")
    .eq("id", listingId)
    .single();

  if (listingError || !listing) {
    throw new Error("Listing not found.");
  }

  if (listing.host_id === user.id) {
    throw new Error("You cannot book your own listing.");
  }

  if (listing.status !== "active") {
    throw new Error("This listing is not available.");
  }

  let checkIn: string;
  let checkOut: string;
  let startAt: string | null = null;
  let endAt: string | null = null;
  let total = 0;

  if (bookingMode === "hourly") {
    const date = String(formData.get("date"));
    const startTime = String(formData.get("start_time"));
    const endTime = String(formData.get("end_time"));

    if (!date || !startTime || !endTime) {
      throw new Error("Please select date, start time, and end time.");
    }

    startAt = `${date}T${startTime}:00`;
    endAt = `${date}T${endTime}:00`;

    const start = new Date(startAt);
    const end = new Date(endAt);

    const hours = (end.getTime() - start.getTime()) / 1000 / 60 / 60;

    if (hours <= 0) {
      throw new Error("End time must be after start time.");
    }

    checkIn = date;
    checkOut = new Date(start.getTime() + 24 * 60 * 60 * 1000)
      .toISOString()
      .slice(0, 10);

    total = Math.ceil(hours) * listing.price_per_hour;
  } else {
    checkIn = String(formData.get("check_in"));
    checkOut = String(formData.get("check_out"));

    if (!checkIn || !checkOut) {
      throw new Error("Please select check-in and check-out dates.");
    }

    const start = new Date(checkIn);
    const end = new Date(checkOut);

    const days = (end.getTime() - start.getTime()) / 1000 / 60 / 60 / 24;

    if (days <= 0) {
      throw new Error("Check-out must be after check-in.");
    }

    const months = Math.ceil(days / 30);
    total = months * listing.price_per_month;
  }

  const { error: bookingError } = await supabase.from("bookings").insert({
    user_id: user.id,
    listing_id: listingId,
    guest_name: guestName,
    check_in: checkIn,
    check_out: checkOut,
    booking_mode: bookingMode,
    start_at: startAt,
    end_at: endAt,
    total,
    status: "pending",
  });

  if (bookingError) {
    throw new Error(bookingError.message);
  }

  revalidatePath(`/listings/${listingId}`);
  redirect("/account/bookings");
}
