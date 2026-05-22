import Link from "next/link"
import Image from "next/image"
import PageHeader from "@/components/account/page-header"
import SectionCard from "@/components/account/section-card"
import StatusBadge from "@/components/account/status-badge"
import EmptyState from "@/components/account/empty-state"
import StatCard from "@/components/account/stat-card"
import { getMyListings } from "@/lib/data/listings"
import { deleteListing } from "./actions"
import DeleteListingButton from "@/components/account/delete-listing-button"

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My listings",
  description: "Manage your parking spot listings on ParkMaster.",
  robots: { index: false, follow: false },
};

function formatPricing(listing: {
  pricing_mode: "hourly" | "monthly" | "both"
  price_per_hour: number | null
  price_per_month: number | null
}) {
  if (listing.pricing_mode === "hourly") {
    return listing.price_per_hour != null ? `€${listing.price_per_hour}/hour` : "—"
  }

  if (listing.pricing_mode === "monthly") {
    return listing.price_per_month != null ? `€${listing.price_per_month}/month` : "—"
  }

  const parts: string[] = []

  if (listing.price_per_hour != null) {
    parts.push(`€${listing.price_per_hour}/hour`)
  }

  if (listing.price_per_month != null) {
    parts.push(`€${listing.price_per_month}/month`)
  }

  return parts.length ? parts.join(" · ") : "—"
}

function formatAvailability(listing: {
  pricing_mode: "hourly" | "monthly" | "both"
  available_from: string | null
  available_to: string | null
  available_days: string[]
}) {
  if (listing.pricing_mode === "monthly") {
    return "Monthly rental"
  }

  const days =
    listing.available_days?.length > 0
      ? listing.available_days.map((day) => day.slice(0, 3)).join(", ")
      : "No days"

  const hours =
    listing.available_from && listing.available_to
      ? `${listing.available_from.slice(0, 5)}–${listing.available_to.slice(0, 5)}`
      : "No hours"

  return `${days} · ${hours}`
}

export default async function MyListingsPage() {
  const myListings = await getMyListings()
  const hasListings = myListings.length > 0

  const activeCount = myListings.filter((listing) => listing.status === "active").length
  const draftCount = myListings.filter((listing) => listing.status === "draft").length
  const bookedCount = myListings.filter((listing) => listing.status === "booked").length

  return (
    <main className="space-y-8">
      <PageHeader
        eyebrow="Host"
        title="My listings"
        description="Manage your parking spots, pricing, availability, and status."
        actionLabel="Add listing"
        actionHref="/list-spot"
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total listings" value={String(myListings.length)} helper="All parking spots" />
        <StatCard label="Active" value={String(activeCount)} helper="Currently live" />
        <StatCard label="Drafts" value={String(draftCount)} helper="Need completion" />
        <StatCard label="Booked" value={String(bookedCount)} helper="Reserved now" />
      </section>

      {!hasListings ? (
        <EmptyState
          title="No listings yet"
          description="Create your first parking spot listing and it will appear here."
          actionLabel="Create listing"
          actionHref="/list-spot"
        />
      ) : (
        <SectionCard
          title="All listings"
          description="A quick overview of your parking spot inventory."
        >
          <div className="overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-0">
              <thead>
                <tr className="text-left text-sm text-neutral-500">
                  <th className="border-b border-neutral-200 px-4 py-3 font-medium">Listing</th>
                  <th className="border-b border-neutral-200 px-4 py-3 font-medium">Location</th>
                  <th className="border-b border-neutral-200 px-4 py-3 font-medium">Pricing</th>
                  <th className="border-b border-neutral-200 px-4 py-3 font-medium">Availability</th>
                  <th className="border-b border-neutral-200 px-4 py-3 font-medium">Status</th>
                  <th className="border-b border-neutral-200 px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>

              <tbody>
                {myListings.map((listing) => (
                  <tr key={listing.id} className="align-top text-sm text-neutral-700">
                    <td className="border-b border-neutral-200 px-4 py-4">
                      <div className="flex min-w-[260px] gap-3">
                        <div className="relative h-16 w-20 overflow-hidden rounded-md border border-neutral-200 bg-neutral-100">
                          {listing.image_url ? (
                            <Image
                              src={listing.image_url}
                              alt={listing.title}
                              fill
                              className="object-cover"
                              sizes="80px"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-xs text-neutral-500">
                              No image
                            </div>
                          )}
                        </div>

                        <div className="space-y-1">
                          <p className="font-medium text-neutral-900">{listing.title}</p>
                          <p className="text-xs uppercase tracking-wide text-neutral-500">
                            {listing.category}
                          </p>
                          {listing.description ? (
                            <p className="max-w-xs text-sm text-neutral-600 line-clamp-2">
                              {listing.description}
                            </p>
                          ) : null}
                        </div>
                      </div>
                    </td>

                    <td className="border-b border-neutral-200 px-4 py-4">
                      <div className="space-y-1">
                        <p>{listing.location}</p>
                        {listing.latitude != null && listing.longitude != null ? (
                          <p className="text-xs text-neutral-500">
                            {listing.latitude.toFixed(5)}, {listing.longitude.toFixed(5)}
                          </p>
                        ) : null}
                      </div>
                    </td>

                    <td className="border-b border-neutral-200 px-4 py-4">
                      {formatPricing(listing)}
                    </td>

                    <td className="border-b border-neutral-200 px-4 py-4">
                      {formatAvailability(listing)}
                    </td>

                    <td className="border-b border-neutral-200 px-4 py-4">
                      <StatusBadge status={listing.status} />
                    </td>

                    <td className="border-b border-neutral-200 px-4 py-4">
                      <div className="flex flex-wrap gap-2">
                        <Link
                          href={`/account/listings/${listing.id}/edit`}
                          className="rounded-full border border-neutral-200 px-3 py-1.5 text-sm font-medium hover:bg-neutral-100"
                        >
                          Edit
                        </Link>

                        <Link
                          href={`/listings/${listing.id}`}
                          className="rounded-full border border-neutral-200 px-3 py-1.5 text-sm font-medium hover:bg-neutral-100"
                        >
                          View
                        </Link>

                        <form action={deleteListing.bind(null, listing.id, listing.image_path)}>
                          <DeleteListingButton />
                        </form>
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