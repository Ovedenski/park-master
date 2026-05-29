import Link from "next/link";
import { notFound } from "next/navigation";
import PageHeader from "@/components/account/page-header";
import SectionCard from "@/components/account/section-card";
import StatusBadge from "@/components/account/status-badge";
import { getReservationOnMyListingById } from "@/lib/data/bookings";
import {
  approveReservation,
  cancelReservation,
  rejectReservation,
} from "../actions";
import { canHostCancel } from "@/lib/bookings/cancellation";
import { formatPrice } from "@/lib/format";

type ReservationDetailsPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ReservationDetailsPage({
  params,
}: ReservationDetailsPageProps) {
  const { id } = await params;
  const reservation = await getReservationOnMyListingById(id);

  if (!reservation) {
    notFound();
  }

  // Approve / reject only apply while the booking is still pending.
  const canReview = reservation.status === "pending";

  // Host-initiated cancellation of an already-approved reservation. The
  // policy helper distinguishes "pending" (rejected via the buttons above)
  // from "booked but not yet started" (cancellable here).
  const hostCancellation = canHostCancel({
    status: reservation.status,
    check_in: reservation.checkInISO
  });

  const showCancelBookedAction =
    reservation.status === "booked" && hostCancellation.allowed;

  const boundApproveReservation = approveReservation.bind(null, reservation.id);
  const boundRejectReservation = rejectReservation.bind(null, reservation.id);
  const boundCancelReservation = cancelReservation.bind(null, reservation.id);

  return (
    <main className="space-y-8">
      <PageHeader
        eyebrow="Reservation"
        title={reservation.listingTitle}
        description="Review and manage this guest reservation."
      />

      <section className="grid gap-6 xl:grid-cols-[2fr_1fr]">
        <SectionCard
          title="Reservation details"
          description="Guest booking information for your listing."
        >
          <dl className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-border p-4">
              <dt className="text-sm text-muted-foreground">Listing</dt>
              <dd className="mt-1 font-medium text-foreground">
                {reservation.listingTitle}
              </dd>
            </div>

            <div className="rounded-2xl border border-border p-4">
              <dt className="text-sm text-muted-foreground">Status</dt>
              <dd className="mt-2">
                <StatusBadge status={reservation.status} />
              </dd>
            </div>

            <div className="rounded-2xl border border-border p-4">
              <dt className="text-sm text-muted-foreground">Guest</dt>
              <dd className="mt-1 font-medium text-foreground">
                {reservation.guestName}
              </dd>
            </div>

            <div className="rounded-2xl border border-border p-4">
              <dt className="text-sm text-muted-foreground">Total</dt>
              <dd className="mt-1 font-medium text-foreground">
                {formatPrice(reservation.total)}
              </dd>
            </div>

            <div className="rounded-2xl border border-border p-4">
              <dt className="text-sm text-muted-foreground">Check-in</dt>
              <dd className="mt-1 font-medium text-foreground">
                {reservation.checkIn}
              </dd>
            </div>

            <div className="rounded-2xl border border-border p-4">
              <dt className="text-sm text-muted-foreground">Check-out</dt>
              <dd className="mt-1 font-medium text-foreground">
                {reservation.checkOut}
              </dd>
            </div>
          </dl>
        </SectionCard>

        <SectionCard title="Actions" description="Manage this reservation.">
          <div className="flex flex-col gap-3">
            <Link
              href={`/listings/${reservation.listingId}`}
              className="inline-flex items-center justify-center rounded-full border border-border px-4 py-2 text-sm font-medium hover:bg-muted"
            >
              View listing
            </Link>

            {canReview ? (
              <>
                <form action={boundApproveReservation}>
                  <button
                    type="submit"
                    className="w-full rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
                  >
                    Approve reservation
                  </button>
                </form>

                <form action={boundRejectReservation}>
                  <button
                    type="submit"
                    className="w-full rounded-full border border-red-200 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50"
                  >
                    Reject reservation
                  </button>
                </form>
              </>
            ) : null}

            {showCancelBookedAction ? (
              <form action={boundCancelReservation}>
                <button
                  type="submit"
                  className="w-full rounded-full border border-red-200 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50"
                >
                  Cancel reservation
                </button>
              </form>
            ) : reservation.status === "booked" && !hostCancellation.allowed ? (
              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">
                <p className="font-medium">Cancellation not available</p>
                <p className="mt-1">{hostCancellation.reason}</p>
              </div>
            ) : null}

            <Link
              href="/account/bookings?view=host"
              className="inline-flex items-center justify-center rounded-full border border-border px-4 py-2 text-sm font-medium hover:bg-muted"
            >
              Back to reservations
            </Link>
          </div>
        </SectionCard>
      </section>
    </main>
  );
}
