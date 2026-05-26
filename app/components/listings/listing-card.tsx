import Link from "next/link";
import { formatPricePerUnit } from "@/lib/format";
import type { ListingCardData } from "@/lib/types";

interface ListingCardProps {
  listing: ListingCardData;
}

export function ListingCard({ listing }: ListingCardProps) {
  const isMonthly = listing.pricing_mode === "monthly";
  const amount = isMonthly ? listing.price_per_month : listing.price_per_hour;
  const unit = isMonthly ? "month" : "hour";

  return (
    <Link
      href={`/listings/${listing.id}`}
      className="group overflow-hidden rounded-2xl border bg-background transition hover:shadow-md"
    >
      <div className="aspect-[4/3] overflow-hidden">
        <img
          src={listing.image_url}
          alt={listing.title}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
        />
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold line-clamp-1">{listing.title}</h3>

        <p className="mt-1 text-sm text-muted-foreground">{listing.location}</p>

        <p className="mt-4 text-sm font-medium">
          {formatPricePerUnit(amount, unit)}
        </p>
      </div>
    </Link>
  );
}
