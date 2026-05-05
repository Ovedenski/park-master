import PageHeader from "@/components/account/page-header"
import SectionCard from "@/components/account/section-card"
import StatusBadge from "@/components/account/status-badge"
import StatCard from "@/components/account/stat-card"
import EmptyState from "@/components/account/empty-state"
import { getMyBookings } from "@/lib/data/bookings"

export default async function MyBookingsPage() {
  const myBookings = await getMyBookings()
  const hasBookings = myBookings.length > 0

  const upcomingCount = myBookings.filter(
    (booking) => booking.status === "booked"
  ).length

  const pendingCount = myBookings.filter(
    (booking) => booking.status === "pending"
  ).length

  const cancelledCount = myBookings.filter(
    (booking) => booking.status === "cancelled"
  ).length

  const completedCount = 14

  return (
    <main className="space-y-8">
      <PageHeader
        eyebrow="Reservations"
        title="My bookings"
        description="Track upcoming stays, guest requests, and reservation status."
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Upcoming" value={String(upcomingCount)} helper="Confirmed reservations" />
        <StatCard label="Pending" value={String(pendingCount)} helper="Needs your review" />
        <StatCard label="Completed" value={String(completedCount)} helper="All time" />
        <StatCard label="Cancelled" value={String(cancelledCount)} helper="Current data set" />
      </section>

      {!hasBookings ? (
        <EmptyState
          title="No bookings yet"
          description="When guests book your listings, their reservations will appear here."
        />
      ) : (
        <SectionCard
          title="All reservations"
          description="A clear view of guest stays across your listings."
        >
          <div className="overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-0">
              <thead>
                <tr className="text-left text-sm text-neutral-500">
                  <th className="border-b border-neutral-200 px-4 py-3 font-medium">Property</th>
                  <th className="border-b border-neutral-200 px-4 py-3 font-medium">Guest</th>
                  <th className="border-b border-neutral-200 px-4 py-3 font-medium">Dates</th>
                  <th className="border-b border-neutral-200 px-4 py-3 font-medium">Total</th>
                  <th className="border-b border-neutral-200 px-4 py-3 font-medium">Status</th>
                  <th className="border-b border-neutral-200 px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {myBookings.map((booking) => (
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
                        <span className="text-neutral-500">to {booking.checkOut}</span>
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
                        <button className="rounded-full border border-neutral-200 px-3 py-1.5 text-sm font-medium hover:bg-neutral-100">
                          View
                        </button>
                        <button className="rounded-full border border-neutral-200 px-3 py-1.5 text-sm font-medium hover:bg-neutral-100">
                          Message
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>
      )}
    </main>
  )
}