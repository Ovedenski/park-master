import { ListingCard } from "@/components/listings/listing-card";
import type { Listing, MyListing } from "@/lib/types";


interface ListingsGridProps {
  listings: MyListing[];
}

export default function ListingsGrid({ listings }: ListingsGridProps) {
  if (listings.length === 0) {
    return (
      <div className="py-20 text-center">
        <h2 className="text-2xl font-semibold">No listings found</h2>
        <p className="mt-2 text-muted-foreground">
          Try another category or come back later.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {listings.map((listing) => (
        <ListingCard key={listing.id} listing={listing} />
      ))}
    </div>
  );
}
