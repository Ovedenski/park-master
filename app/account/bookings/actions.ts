"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { canGuestCancel } from "@/lib/bookings/cancellation";
import type { BookingStatus } from "@/lib/bookings/cancellation";

export async function cancelBooking(bookingId: string) {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/login?message=Please log in to manage your bookings");
  }

  const { data: booking, error: bookingError } = await supabase
    .from("bookings")
    .select("id, user_id, status, check_in")
    .eq("id", bookingId)
    .eq("user_id", user.id)
    .single();

  if (bookingError || !booking) {
    throw new Error("Booking not found.");
  }

  // Policy gate — runs the same rules the UI used to show/hide the button.
  const decision = canGuestCancel({
    status: booking.status as BookingStatus,
    check_in: booking.check_in,
  });

  if (!decision.allowed) {
    throw new Error(decision.reason);
  }

  // Idempotent: if it's already cancelled the policy returns `false` with a
  // friendly reason. We only reach here if the booking is currently pending
  // or booked, so the update is safe.
  const { error } = await supabase
    .from("bookings")
    .update({ status: "cancelled" })
    .eq("id", bookingId)
    .eq("user_id", user.id)
    .in("status", ["pending", "booked"]); // optimistic guard against a race

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/account/bookings");
  revalidatePath(`/account/bookings/${bookingId}`);
  revalidatePath("/listings");
}
