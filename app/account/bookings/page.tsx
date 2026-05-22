import Link from "next/link";
import PageHeader from "@/components/account/page-header";
import SectionCard from "@/components/account/section-card";
import StatusBadge from "@/components/account/status-badge";
import StatCard from "@/components/account/stat-card";
import EmptyState from "@/components/account/empty-state";
import BookingsViewTabs from "@/components/account/bookings-view-tabs";
import {
  getMyBookings,
  getReservationsOnMyListings,
} from "@/lib/data/bookings";
import { cancelBooking } from "./actions";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My bookings",
  description: "View and manage your parking bookings on ParkMaster.",
  robots: { index: false, follow: false },
};

type MyBookingsPageProps = {
  searchParams?: Promise<{
    view?: string;
  }>;
};

export default async function MyBookingsPage({
  searchParams,
}: MyBookingsPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const activeView = resolvedSearchParams?.view === "host" ? "host" : "mine";

  const bookings =
    activeView === "host"
      ? await getReservationsOnMyListings()
      : await getMyBookings();

  const hasBookings = bookings.length > 0;

  const upcomingCount = bookings.filter(
    (booking) => booking.status === "booked" && !booking.isPast,
  ).length;

  const pendingCount = bookings.filter(
    (booking) => booking.status === "pending",
  ).length;

  const cancelledCount = bookings.filter(
    (booking) => booking.status === "cancelled",
  ).length;

  const pastCount = bookings.filter(
    (booking) => booking.status === "booked" && booking.isPast,
  ).length;

  const title =
    activeView === "host" ? "Reservations on my listings" : "My bookings";

  const description =
    activeView === "host"
      ? "Track guest reservations across your listings."
      : "Track your current and past reservations.";

  const emptyTitle =
    activeView === "host" ? "No reservations yet" : "No bookings yet";

  const emptyDescription =
    activeView === "host"
      ? "When someone books one of your listings, the reservation will appear here."
      : "When you reserve a parking spot, your bookings will appear here.";

  return (
    <main className="space-y-8">
      <PageHeader
        eyebrow="Reservations"
        title={title}
        description={description}
      />

      <BookingsViewTabs />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Upcoming"
          value={String(upcomingCount)}
          helper="Confirmed future bookings"
        />
        <StatCard
          label="Pending"
          value={String(pendingCount)}
          helper="Awaiting confirmation"
        />
        <StatCard
          label="Past"
          value={String(pastCount)}
          helper="Completed by date"
        />
        <StatCard
          label="Cancelled"
          value={String(cancelledCount)}
          helper="Cancelled reservations"
        />
      </section>

      {!hasBookings ? (
        <EmptyState title={emptyTitle} description={emptyDescription} />
      ) : (
        <SectionCard
          title={activeView === "host" ? "All reservations" : "All bookings"}
          description={
            activeView === "host"
              ? "A clear view of guest reservations for your listings."
              : "A clear view of your reservations."
          }
        >
          <div className="overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-0">
              <thead>
                <tr className="text-left text-sm text-neutral-500">
                  <th className="border-b border-neutral-200 px-4 py-3 font-medium">
                    Listing
                  </th>
                  <th className="border-b border-neutral-200 px-4 py-3 font-medium">
                    Guest
                  </th>
                  <th className="border-b border-neutral-200 px-4 py-3 font-medium">
                    Dates
                  </th>
                  <th className="border-b border-neutral-200 px-4 py-3 font-medium">
                    Total
                  </th>
                  <th className="border-b border-neutral-200 px-4 py-3 font-medium">
                    Status
                  </th>
                  <th className="border-b border-neutral-200 px-4 py-3 font-medium">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {bookings.map((booking) => {
                  const canCancel =
                    activeView === "mine" &&
                    (booking.status === "pending" ||
                      (booking.status === "booked" && !booking.isPast));

                  const boundCancelBooking = cancelBooking.bind(
                    null,
                    booking.id,
                  );

                  return (
                    <tr key={booking.id} className="text-sm text-neutral-700">
                      <td className="border-b border-neutral-200 px-4 py-4 font-medium">
                        {booking.listingTitle}
                      </td>

                      <td className="border-b border-neutral-200 px-4 py-4">
                        {booking.guestName}
                      </td>

                      <td className="border-b border-neutral-200 px-4 py-4">
                        <div className="flex flex-col">
                          <span>{booking.checkIn}</span>
                          <span className="text-neutral-500">
                            to {booking.checkOut}
                          </span>
                        </div>
                      </td>

                      <td className="border-b border-neutral-200 px-4 py-4">
                        €{booking.total}
                      </td>

                      <td className="border-b border-neutral-200 px-4 py-4">
                        <StatusBadge status={booking.status} />
                      </td>

                      <td className="border-b border-neutral-200 px-4 py-4">
                        <div className="flex flex-wrap gap-2">
                          <Link
                            href={
                              activeView === "host"
                                ? `/account/reservations/${booking.id}`
                                : `/account/bookings/${booking.id}`
                            }
                            className="rounded-full border border-neutral-200 px-3 py-1.5 text-sm font-medium hover:bg-neutral-100"
                          >
                            View
                          </Link>

                          {canCancel ? (
                            <form action={boundCancelBooking}>
                              <button
                                type="submit"
                                className="rounded-full border border-red-200 px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-50"
                              >
                                Cancel
                              </button>
                            </form>
                          ) : null}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </SectionCard>
      )}
    </main>
  );
}
