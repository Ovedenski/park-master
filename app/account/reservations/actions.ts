"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { canHostCancel } from "@/lib/bookings/cancellation";
import type { BookingStatus } from "@/lib/bookings/cancellation";

async function requireHostReservation(bookingId: string) {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/login?message=Please log in to manage reservations");
  }

    const { data: booking, error } = await supabase
      .from("bookings")
      .select(
        `
      id,
      status,
      check_in,
      listing_id,
      listings!inner (
        id,
        host_id
      )
    `,
      )
      .eq("id", bookingId)
      .eq("listings.host_id", user.id)
      .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!booking) {
    throw new Error("Reservation not found.");
  }

  return { supabase, booking };
}

export async function approveReservation(bookingId: string) {
  const { supabase, booking } = await requireHostReservation(bookingId);

  if (booking.status !== "pending") {
    throw new Error("Only pending reservations can be approved.");
  }

  const { data, error } = await supabase
    .from("bookings")
    .update({ status: "booked" })
    .eq("id", bookingId)
    .eq("status", "pending")
    .select("id, status")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    throw new Error("Reservation was not updated.");
  }

  revalidatePath("/account/bookings");
  revalidatePath("/account/reservations");
  revalidatePath(`/account/reservations/${bookingId}`);

  redirect(`/account/reservations/${bookingId}`);
}

export async function rejectReservation(bookingId: string) {
  const { supabase, booking } = await requireHostReservation(bookingId);

  if (booking.status !== "pending") {
    throw new Error("Only pending reservations can be rejected.");
  }

  const { data, error } = await supabase
    .from("bookings")
    .update({ status: "cancelled" })
    .eq("id", bookingId)
    .eq("status", "pending")
    .select("id, status")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    throw new Error("Reservation was not updated.");
  }

  revalidatePath("/account/bookings");
  revalidatePath("/account/reservations");
  revalidatePath(`/account/reservations/${bookingId}`);

  redirect(`/account/reservations/${bookingId}`);
}

/**
 * Host-initiated cancellation of a booking they previously approved.
 *
 * This is distinct from `rejectReservation` (which only operates on
 * `pending` bookings). Use this when the host needs to cancel an already-
 * confirmed reservation — for instance because the spot became unavailable.
 */
export async function cancelReservation(bookingId: string) {
  const { supabase, booking } = await requireHostReservation(bookingId);

  const decision = canHostCancel({
    status: booking.status as BookingStatus,
    check_in: booking.check_in,
  });

  if (!decision.allowed) {
    throw new Error(decision.reason);
  }

  const { data, error } = await supabase
    .from("bookings")
    .update({ status: "cancelled" })
    .eq("id", bookingId)
    .in("status", ["pending", "booked"])
    .select("id, status")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    throw new Error("Reservation was not updated.");
  }

  revalidatePath("/account/bookings");
  revalidatePath("/account/reservations");
  revalidatePath(`/account/reservations/${bookingId}`);

  redirect(`/account/reservations/${bookingId}`);
}