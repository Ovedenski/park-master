import Link from "next/link"
import { notFound } from "next/navigation"
import PageHeader from "@/components/account/page-header"
import SectionCard from "@/components/account/section-card"
import StatusBadge from "@/components/account/status-badge"
import { getMyBookingById } from "@/lib/data/bookings"
import { cancelBooking } from "../actions"
import { canGuestCancel } from "@/lib/bookings/cancellation";

type BookingDetailsPageProps = {
  params: Promise<{ id: string }>
}

export default async function BookingDetailsPage({ params }: BookingDetailsPageProps) {
  const { id } = await params
  const booking = await getMyBookingById(id)

  if (!booking) {
    notFound()
  }

    const cancellation = canGuestCancel({
      status: booking.status,
      check_in: booking.checkInISO,
    });

  const boundCancelBooking = cancelBooking.bind(null, booking.id)

  return (
    <main className="space-y-8">
      <PageHeader
        eyebrow="Reservation"
        title={booking.listingTitle}
        description="Review booking details, status, and next actions."
      />

      <section className="grid gap-6 xl:grid-cols-[2fr_1fr]">
        <SectionCard
          title="Booking details"
          description="Information about your reservation."
        >
          <dl className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-border p-4">
              <dt className="text-sm text-muted-foreground">Listing</dt>
              <dd className="mt-1 font-medium text-foreground">
                {booking.listingTitle}
              </dd>
            </div>

            <div className="rounded-2xl border border-border p-4">
              <dt className="text-sm text-muted-foreground">Status</dt>
              <dd className="mt-2">
                <StatusBadge status={booking.status} />
              </dd>
            </div>

            <div className="rounded-2xl border border-border p-4">
              <dt className="text-sm text-muted-foreground">Check-in</dt>
              <dd className="mt-1 font-medium text-foreground">
                {booking.checkIn}
              </dd>
            </div>

            <div className="rounded-2xl border border-border p-4">
              <dt className="text-sm text-muted-foreground">Check-out</dt>
              <dd className="mt-1 font-medium text-foreground">
                {booking.checkOut}
              </dd>
            </div>

            <div className="rounded-2xl border border-border p-4">
              <dt className="text-sm text-muted-foreground">Guest name</dt>
              <dd className="mt-1 font-medium text-foreground">
                {booking.guestName}
              </dd>
            </div>

            <div className="rounded-2xl border border-border p-4">
              <dt className="text-sm text-muted-foreground">Total</dt>
              <dd className="mt-1 font-medium text-foreground">
                €{booking.total}
              </dd>
            </div>
          </dl>
        </SectionCard>

        <SectionCard title="Actions" description="Manage this reservation.">
          <div className="flex flex-col gap-3">
            <Link
              href={`/listings/${booking.listingId}`}
              className="inline-flex items-center justify-center rounded-full border border-border px-4 py-2 text-sm font-medium hover:bg-muted"
            >
              View listing
            </Link>

            {cancellation.allowed ? (
              <form action={boundCancelBooking}>
                <button
                  type="submit"
                  className="w-full rounded-full border border-red-200 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50"
                >
                  Cancel booking
                </button>
              </form>
            ) : booking.status !== "cancelled" ? (
              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">
                <p className="font-medium">Cancellation not available</p>
                <p className="mt-1">{cancellation.reason}</p>
              </div>
            ) : null}

            <Link
              href="/account/bookings"
              className="inline-flex items-center justify-center rounded-full border border-border px-4 py-2 text-sm font-medium hover:bg-muted"
            >
              Back to bookings
            </Link>
          </div>
        </SectionCard>
      </section>
    </main>
  );
}