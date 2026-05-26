// app/listings/[id]/page.tsx
import { notFound } from "next/navigation";
import { getAllListings } from "@/lib/data/listings";
import { createClient } from "@/lib/supabase/server";
import type { Listing } from "@/lib/types";
import BookingForm from "@/components/listings/booking-form";
import ListingLocationMap from "@/components/listings/listing-location-map";

import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const listings = await getAllListings();
  const listing = listings.find((l) => l.id === id);

  if (!listing) {
    return { title: "Listing not found" };
  }

  const priceLine =
    listing.pricing_mode === "monthly"
      ? `$${listing.price_per_month}/month`
      : `$${listing.price_per_hour}/hour`;

  return {
    title: listing.title,
    description:
      listing.description ??
      `Rent this parking spot in ${listing.location} for ${priceLine} on ParkMaster.`,
    openGraph: {
      title: `${listing.title} · ParkMaster`,
      description:
        listing.description ??
        `Rent this parking spot in ${listing.location} for ${priceLine}.`,
      images: listing.image_url ? [listing.image_url] : undefined,
    },
  };
}

type ListingPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ListingPage({ params }: ListingPageProps) {
  const { id } = await params;

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const listings = await getAllListings();

  const listingData: Listing | undefined = listings.find(
    (listing) => listing.id === id,
  );

  if (!listingData) {
    notFound();
  }

  const isOwner = user?.id === listingData.host_id;

  return (
    <main className="px-4 py-8 sm:px-6 lg:py-10">
      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-8">
        {/* LEFT COLUMN — all listing info */}
        <div className="space-y-6">
          <header>
            <p className="text-sm text-neutral-500">Listing</p>
            <h1 className="text-2xl font-semibold sm:text-3xl">
              {listingData.title}
            </h1>
            <p className="text-neutral-600">{listingData.location}</p>
          </header>

          <img
            src={listingData.image_url}
            alt={listingData.title}
            className="aspect-[16/10] w-full rounded-2xl object-cover sm:aspect-[16/9] lg:h-[420px] lg:aspect-auto"
          />

          <div className="grid gap-4 rounded-2xl border border-neutral-200 p-6 sm:grid-cols-3">
            <div>
              <p className="text-sm text-neutral-500">Category</p>
              <p className="font-medium">{listingData.category}</p>
            </div>

            <div>
              <p className="text-sm text-neutral-500">Location</p>
              <p className="font-medium">{listingData.location}</p>
            </div>

            <div>
              <p className="text-sm text-neutral-500">Pricing</p>
              <p className="font-medium">
                {listingData.pricing_mode === "hourly" &&
                  `$${listingData.price_per_hour}/hour`}

                {listingData.pricing_mode === "monthly" &&
                  `$${listingData.price_per_month}/month`}

                {listingData.pricing_mode === "both" &&
                  `$${listingData.price_per_hour}/hour or $${listingData.price_per_month}/month`}
              </p>
            </div>
          </div>

          {listingData.description && (
            <div className="rounded-2xl border border-neutral-200 p-6">
              <h2 className="text-xl font-semibold">Description</h2>
              <p className="mt-3 whitespace-pre-line text-neutral-600">
                {listingData.description}
              </p>
            </div>
          )}

          <div className="rounded-2xl border border-neutral-200 p-6">
            <h2 className="text-xl font-semibold">Availability</h2>

            {listingData.pricing_mode !== "monthly" && (
              <div className="mt-3 space-y-2 text-neutral-600">
                <p>
                  Time: {listingData.available_from} -{" "}
                  {listingData.available_to}
                </p>
                <p>
                  Days:{" "}
                  {listingData.available_days?.length
                    ? listingData.available_days.join(", ")
                    : "Not specified"}
                </p>
              </div>
            )}
          </div>

          {listingData.latitude && listingData.longitude && (
            <div className="rounded-2xl border border-neutral-200 p-6">
              <h2 className="text-xl font-semibold">Location</h2>

              <div className="mt-3 space-y-1">
                <p className="font-medium">
                  {listingData.address ?? listingData.location}
                </p>

                {listingData.address && (
                  <p className="text-sm text-neutral-500">
                    {listingData.location}
                  </p>
                )}
              </div>

              <div className="mt-4">
                <ListingLocationMap
                  latitude={listingData.latitude}
                  longitude={listingData.longitude}
                  address={listingData.address ?? listingData.location}
                />
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN — sticky booking sidebar */}
        <aside className="lg:sticky lg:top-8 lg:self-start">
          <BookingForm
            listing={listingData}
            isOwner={isOwner}
            isLoggedIn={Boolean(user)}
          />
        </aside>
      </div>
    </main>
  );
}
