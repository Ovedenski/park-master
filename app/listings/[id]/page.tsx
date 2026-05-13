import { notFound } from "next/navigation";
import { mockListings } from "@/lib/mock-listings";
import type { Listing, MyListing } from "@/lib/types";
import { getAllListings } from "@/lib/data/listings";

type ListingPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ListingPage({ params }: ListingPageProps) {
  const { id } = await params;
  const listings = await getAllListings()

  const listingData: MyListing | undefined = listings.find(
    (listing) => listing.id === id,
  );

  if (!listingData) {
    notFound();
  }

  return (
    <main className="px-6 py-10">
      <div className="mx-auto max-w-5xl space-y-6">
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
            <p className="text-sm text-neutral-500">Price</p>
            <p className="font-medium">${listingData.price_per_hour}</p>
          </div>
        </div>
      </div>
    </main>
  );
}
