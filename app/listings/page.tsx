// app/listings/page.tsx
import ListingsGrid from "@/components/listings/listings-grid";
import { mockListings } from "@/lib/mock-listings";
import type { Listing } from "@/lib/types";

const ALL_LISTINGS: Listing[] = [...mockListings];

type ListingsPageProps = {
  searchParams: Promise<{
    category?: string;
  }>;
};

export default async function ListingsPage({
  searchParams,
}: ListingsPageProps) {
  const { category } = await searchParams;

  const filteredListings =
    category && category !== "all"
      ? ALL_LISTINGS.filter((listing) => listing.category === category)
      : ALL_LISTINGS;

  return (
    <main className="px-6 py-10">
      <div className="mx-auto max-w-6xl space-y-6">
        <div>
          <p className="text-sm text-neutral-500">Listings</p>
          <h1 className="text-3xl font-semibold">
            {category && category !== "all"
              ? `Category: ${category}`
              : "All listings"}
          </h1>
        </div>

        <ListingsGrid listings={filteredListings} />
      </div>
    </main>
  );
}
