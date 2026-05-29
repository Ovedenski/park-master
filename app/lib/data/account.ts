import "server-only";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type AccountOverview = {
  /** Number of active listings the user hosts. */
  activeListingCount: number;
  /** Number of approved future bookings on the user's listings. */
  upcomingReservationCount: number;
  /** Number of bookings on the user's listings awaiting approval. */
  pendingReservationCount: number;
  /** Number of approved future bookings made by the user as a guest. */
  upcomingBookingCount: number;

  /** Most recent activity (last 5 bookings touching the user, host or guest). */
  recentActivity: AccountActivityItem[];
};

export type AccountActivityItem = {
  id: string;
  /** "host" if user owns the listing, "guest" if user made the booking. */
  role: "host" | "guest";
  listingTitle: string;
  guestName: string;
  status: "pending" | "booked" | "cancelled";
  checkIn: string; // ISO
  createdAt: string; // ISO
};

/**
 * Builds the dashboard overview for the currently-authenticated user.
 * All counts are real database aggregates — no mock data.
 */
export async function getAccountOverview(): Promise<AccountOverview> {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/login?message=Please log in to view your account");
  }

  // `today` formatted as YYYY-MM-DD so it can be compared against the
  // `check_in` `date` column without time-zone surprises.
  const today = new Date().toISOString().slice(0, 10);

  // Use Supabase's `count: "exact", head: true` trick to fetch only the
  // count, not the rows. Cheap and explicit.
  const [
    activeListings,
    upcomingReservations,
    pendingReservations,
    upcomingBookings,
    recentReservationsRes,
    recentBookingsRes,
  ] = await Promise.all([
    supabase
      .from("listings")
      .select("id", { count: "exact", head: true })
      .eq("host_id", user.id)
      .eq("status", "active"),

    supabase
      .from("bookings")
      .select("id, listings!inner(host_id)", {
        count: "exact",
        head: true,
      })
      .eq("listings.host_id", user.id)
      .eq("status", "booked")
      .gte("check_in", today),

    supabase
      .from("bookings")
      .select("id, listings!inner(host_id)", {
        count: "exact",
        head: true,
      })
      .eq("listings.host_id", user.id)
      .eq("status", "pending"),

    supabase
      .from("bookings")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("status", "booked")
      .gte("check_in", today),

    // Latest 5 bookings on listings this user hosts.
    supabase
      .from("bookings")
      .select(
        `id, guest_name, status, check_in, created_at,
         listings!inner(id, title, host_id)`,
      )
      .eq("listings.host_id", user.id)
      .order("created_at", { ascending: false })
      .limit(5),

    // Latest 5 bookings this user has made as a guest.
    supabase
      .from("bookings")
      .select(
        `id, guest_name, status, check_in, created_at,
         listings(id, title)`,
      )
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  // Merge host + guest activity, sort by created_at desc, keep top 5.
  type RawRow = {
    id: string;
    guest_name: string;
    status: "pending" | "booked" | "cancelled";
    check_in: string;
    created_at: string;
    listings:
      | { id: string; title: string | null; host_id?: string | null }
      | { id: string; title: string | null; host_id?: string | null }[]
      | null;
  };

  const pickTitle = (l: RawRow["listings"]): string => {
    if (!l) return "Listing";
    if (Array.isArray(l)) return l[0]?.title ?? "Listing";
    return l.title ?? "Listing";
  };

  const asHost: AccountActivityItem[] = (
    (recentReservationsRes.data ?? []) as RawRow[]
  ).map((r) => ({
    id: r.id,
    role: "host" as const,
    listingTitle: pickTitle(r.listings),
    guestName: r.guest_name,
    status: r.status,
    checkIn: r.check_in,
    createdAt: r.created_at,
  }));

  const asGuest: AccountActivityItem[] = (
    (recentBookingsRes.data ?? []) as RawRow[]
  ).map((r) => ({
    id: r.id,
    role: "guest" as const,
    listingTitle: pickTitle(r.listings),
    guestName: r.guest_name,
    status: r.status,
    checkIn: r.check_in,
    createdAt: r.created_at,
  }));

  const recentActivity = [...asHost, ...asGuest]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 5);

  return {
    activeListingCount: activeListings.count ?? 0,
    upcomingReservationCount: upcomingReservations.count ?? 0,
    pendingReservationCount: pendingReservations.count ?? 0,
    upcomingBookingCount: upcomingBookings.count ?? 0,
    recentActivity,
  };
}
