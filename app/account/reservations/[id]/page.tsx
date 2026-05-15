import Link from "next/link";
import { notFound } from "next/navigation";
import PageHeader from "@/components/account/page-header";
import SectionCard from "@/components/account/section-card";
import StatusBadge from "@/components/account/status-badge";
import { getReservationOnMyListingById } from "@/lib/data/bookings";
import { approveReservation, rejectReservation } from "../actions";

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

  const canReview = reservation.status === "pending";
  const boundApproveReservation = approveReservation.bind(null, reservation.id);
  const boundRejectReservation = rejectReservation.bind(null, reservation.id);

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
                €{reservation.total}
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
