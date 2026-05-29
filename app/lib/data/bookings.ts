import "server-only";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type BookingStatus = "pending" | "booked" | "cancelled";
export type BookingMode = "hourly" | "monthly";

export type BookingListItem = {
  id: string;
  listingId: string;
  listingTitle: string;
  guestName: string;
  checkIn: string; // formatted, for display
  checkInISO: string; // raw ISO string, for date math   ← add
  checkOut: string; // formatted, for display
  checkOutISO: string; // raw ISO string, for date math   ← add
  bookingMode: BookingMode | null;
  startAt: string | null;
  endAt: string | null;
  total: number;
  status: BookingStatus;
  createdAt: string;
  updatedAt: string | null;
  isPast: boolean;
};

type ListingRelation =
  | {
      title: string | null;
      host_id?: string | null;
    }
  | {
      title: string | null;
      host_id?: string | null;
    }[]
  | null;

type BookingRow = {
  id: string;
  listing_id: string;
  guest_name: string;
  check_in: string;
  check_out: string;
  booking_mode: BookingMode | null;
  start_at: string | null;
  end_at: string | null;
  total: number;
  status: BookingStatus;
  created_at: string;
  updated_at: string | null;
  listings: ListingRelation;
};

function getListingTitle(listings: ListingRelation) {
  if (!listings) return "Untitled listing";

  if (Array.isArray(listings)) {
    return listings[0]?.title ?? "Untitled listing";
  }

  return listings.title ?? "Untitled listing";
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function withPastFlag(checkOut: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const checkOutDate = new Date(checkOut);
  checkOutDate.setHours(0, 0, 0, 0);

  return checkOutDate < today;
}

function mapBookingRow(booking: BookingRow): BookingListItem {
  return {
    id: booking.id,
    listingId: booking.listing_id,
    listingTitle: getListingTitle(booking.listings),
    guestName: booking.guest_name,
    checkIn: formatDate(booking.check_in),
    checkInISO: booking.check_in,
    checkOut: formatDate(booking.check_out),
    checkOutISO: booking.check_out,
    bookingMode: booking.booking_mode,
    startAt: booking.start_at,
    endAt: booking.end_at,
    total: booking.total,
    status: booking.status,
    createdAt: booking.created_at,
    updatedAt: booking.updated_at,
    isPast: withPastFlag(booking.check_out),
  };
}

function mapBookingRows(rows: BookingRow[]): BookingListItem[] {
  return rows.map(mapBookingRow);
}

async function requireUser() {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/login?message=Please log in to view your bookings");
  }

  return { supabase, user };
}

const bookingSelect = `
  id,
  listing_id,
  guest_name,
  check_in,
  check_out,
  booking_mode,
  start_at,
  end_at,
  total,
  status,
  created_at,
  updated_at,
  listings (
    title
  )
`;

const reservationSelect = `
  id,
  listing_id,
  guest_name,
  check_in,
  check_out,
  booking_mode,
  start_at,
  end_at,
  total,
  status,
  created_at,
  updated_at,
  listings!inner (
    title,
    host_id
  )
`;

export async function getMyBookings(): Promise<BookingListItem[]> {
  const { supabase, user } = await requireUser();

  const { data, error } = await supabase
    .from("bookings")
    .select(bookingSelect)
    .eq("user_id", user.id)
    .order("check_in", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return mapBookingRows((data ?? []) as BookingRow[]);
}

export async function getReservationsOnMyListings(): Promise<
  BookingListItem[]
> {
  const { supabase, user } = await requireUser();

  const { data, error } = await supabase
    .from("bookings")
    .select(reservationSelect)
    .eq("listings.host_id", user.id)
    .order("check_in", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return mapBookingRows((data ?? []) as BookingRow[]);
}

export async function getMyBookingById(
  id: string,
): Promise<BookingListItem | null> {
  const { supabase, user } = await requireUser();

  const { data, error } = await supabase
    .from("bookings")
    .select(bookingSelect)
    .eq("id", id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) return null;

  return mapBookingRow(data as BookingRow);
}

export async function getReservationOnMyListingById(
  id: string,
): Promise<BookingListItem | null> {
  const { supabase, user } = await requireUser();

  const { data, error } = await supabase
    .from("bookings")
    .select(reservationSelect)
    .eq("id", id)
    .eq("listings.host_id", user.id)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) return null;

  return mapBookingRow(data as BookingRow);
}
