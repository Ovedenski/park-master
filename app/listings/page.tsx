// app/listings/page.tsx
import ListingsGrid from "@/components/listings/listings-grid";
import ListingsFilters from "@/components/listings/listings-filters";
import { getAllListings } from "@/lib/data/listings";

type ListingsPageProps = {
  searchParams: Promise<{
    category?: string;
    pricing_mode?: string;
    city?: string;
    district?: string;
    min_price?: string;
    max_price?: string;
  }>;
};

export default async function ListingsPage({
  searchParams,
}: ListingsPageProps) {
  const params = await searchParams;

  const { category, pricing_mode, city, district, min_price, max_price } =
    params;

  const listings = await getAllListings();

  const minPrice = min_price ? Number(min_price) : null;
  const maxPrice = max_price ? Number(max_price) : null;

  const cities = Array.from(
    new Set(
      listings
        .map((listing) => listing.city)
        .filter((value): value is string => Boolean(value)),
    ),
  ).sort();

  const districts = Array.from(
    new Set(
      listings
        .filter((listing) => !city || city === "all" || listing.city === city)
        .map((listing) => listing.district)
        .filter((value): value is string => Boolean(value)),
    ),
  ).sort();

  const prices = listings
    .map((listing) =>
      pricing_mode === "monthly"
        ? listing.price_per_month
        : listing.price_per_hour,
    )
    .filter((value): value is number => typeof value === "number");

  const absoluteMinPrice = prices.length ? Math.min(...prices) : 0;
  const absoluteMaxPrice = prices.length ? Math.max(...prices) : 100;

  const filteredListings = listings.filter((listing) => {
    if (category && category !== "all" && listing.category !== category) {
      return false;
    }

    if (
      pricing_mode &&
      pricing_mode !== "all" &&
      listing.pricing_mode !== pricing_mode
    ) {
      return false;
    }

    if (city && city !== "all" && listing.city !== city) {
      return false;
    }

    if (district && district !== "all" && listing.district !== district) {
      return false;
    }

    if (minPrice !== null || maxPrice !== null) {
      const price =
        pricing_mode === "monthly"
          ? listing.price_per_month
          : listing.price_per_hour;

      if (price == null) {
        return false;
      }

      if (minPrice !== null && price < minPrice) {
        return false;
      }

      if (maxPrice !== null && price > maxPrice) {
        return false;
      }
    }

    return true;
  });

  return (
    <main className="px-6 py-10">
      <div className="mx-auto max-w-6xl space-y-6">
        <div>
          <p className="text-sm text-neutral-500">Listings</p>
          <h1 className="text-3xl font-semibold">All listings</h1>
        </div>

        <ListingsFilters
          category={category}
          pricingMode={pricing_mode}
          city={city}
          district={district}
          minPrice={min_price}
          maxPrice={max_price}
          cities={cities}
          districts={districts}
          absoluteMinPrice={absoluteMinPrice}
          absoluteMaxPrice={absoluteMaxPrice}
        />

        <ListingsGrid listings={filteredListings} />
      </div>
    </main>
  );
}
