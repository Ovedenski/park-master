import PageHeader from "@/components/account/page-header"
import SectionCard from "@/components/account/section-card"
import StatusBadge from "@/components/account/status-badge"
import EmptyState from "@/components/account/empty-state"
import StatCard from "@/components/account/stat-card"
import { getMyListings } from "@/lib/data/listings"

export default async function MyListingsPage() {
  const myListings = await getMyListings()
  const hasListings = myListings.length > 0

  const activeCount = myListings.filter(
    (listing) => listing.status === "active"
  ).length

  const draftCount = myListings.filter(
    (listing) => listing.status === "draft"
  ).length

  const bookedCount = myListings.filter(
    (listing) => listing.status === "booked"
  ).length

  return (
    <main className="space-y-8">
      <PageHeader
        eyebrow="Host"
        title="My listings"
        description="Manage your properties, update details, and track status."
        actionLabel="Add listing"
        actionHref="/become-a-host"
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total listings" value={String(myListings.length)} helper="All properties" />
        <StatCard label="Active" value={String(activeCount)} helper="Currently live" />
        <StatCard label="Drafts" value={String(draftCount)} helper="Need completion" />
        <StatCard label="Booked" value={String(bookedCount)} helper="Reserved now" />
      </section>

      {!hasListings ? (
        <EmptyState
          title="No listings yet"
          description="Start by creating your first listing and it will appear here."
          actionLabel="Create listing"
          actionHref="/become-a-host"
        />
      ) : (
        <SectionCard
          title="All listings"
          description="A quick overview of your current properties."
        >
          <div className="overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-0">
              <thead>
                <tr className="text-left text-sm text-neutral-500">
                  <th className="border-b border-neutral-200 px-4 py-3 font-medium">Listing</th>
                  <th className="border-b border-neutral-200 px-4 py-3 font-medium">Category</th>
                  <th className="border-b border-neutral-200 px-4 py-3 font-medium">Location</th>
                  <th className="border-b border-neutral-200 px-4 py-3 font-medium">Price</th>
                  <th className="border-b border-neutral-200 px-4 py-3 font-medium">Status</th>
                  <th className="border-b border-neutral-200 px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {myListings.map((listing) => (
                  <tr key={listing.id} className="text-sm text-neutral-700">
                    <td className="border-b border-neutral-200 px-4 py-4 font-medium">
                      {listing.title}
                    </td>
                    <td className="border-b border-neutral-200 px-4 py-4">
                      {listing.category}
                    </td>
                    <td className="border-b border-neutral-200 px-4 py-4">
                      {listing.location}
                    </td>
                    <td className="border-b border-neutral-200 px-4 py-4">
                      €{listing.price}/night
                    </td>
                    <td className="border-b border-neutral-200 px-4 py-4">
                      <StatusBadge status={listing.status} />
                    </td>
                    <td className="border-b border-neutral-200 px-4 py-4">
                      <div className="flex flex-wrap gap-2">
                        <button className="rounded-full border border-neutral-200 px-3 py-1.5 text-sm font-medium hover:bg-neutral-100">
                          Edit
                        </button>
                        <button className="rounded-full border border-neutral-200 px-3 py-1.5 text-sm font-medium hover:bg-neutral-100">
                          View
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