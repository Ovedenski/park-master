// app/listings/[id]/page.tsx
import { notFound } from "next/navigation";
import { getAllListings } from "@/lib/data/listings";
import { createClient } from "@/lib/supabase/server";
import type { MyListing } from "@/lib/types";
import BookingForm from "@/components/listings/booking-form";

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

  const listingData: MyListing | undefined = listings.find(
    (listing) => listing.id === id,
  );

  if (!listingData) {
    notFound();
  }

  const isOwner = user?.id === listingData.host_id;

  return (
    <main className="px-6 py-10">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          <div>
            <p className="text-sm text-neutral-500">Listing</p>
            <h1 className="text-3xl font-semibold">{listingData.title}</h1>
            <p className="text-neutral-600">{listingData.location}</p>
          </div>

          <img
            src={listingData.image_url}
            alt={listingData.title}
            className="h-[420px] w-full rounded-2xl object-cover"
          />

          <div className="grid gap-4 rounded-2xl border border-neutral-200 p-6 md:grid-cols-3">
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
              <p className="mt-3 text-neutral-600">
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

            {listingData.pricing_mode === "monthly" && (
              <p className="mt-3 text-neutral-600">
                Available for monthly rental.
              </p>
            )}
          </div>
        </div>

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