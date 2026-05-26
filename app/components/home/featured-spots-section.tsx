import Link from "next/link";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";
import type { Listing } from "@/lib/types";
import { formatPrice } from "@/lib/format";


export function FeaturedSpotsSection({ listings }: { listings: Listing[] }) {
  if (listings.length === 0) return null;

  return (
    <section className="py-20">
      <Container>
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-semibold md:text-4xl">
              Featured spots
            </h2>
            <p className="mt-3 text-muted-foreground">
              Newest listings available right now.
            </p>
          </div>
          <Link href="/listings">
            <Button variant="ghost">View all →</Button>
          </Link>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {listings.map((listing) => (
            <Link
              key={listing.id}
              href={`/listings/${listing.id}`}
              className="group overflow-hidden rounded-2xl border bg-card transition hover:shadow-md"
            >
              {listing.image_url ? (
                <img
                  src={listing.image_url}
                  alt={listing.title}
                  className="aspect-[16/10] w-full object-cover transition group-hover:scale-105"
                />
              ) : (
                <div className="flex aspect-[16/10] items-center justify-center bg-muted">
                  <MapPin className="size-10 text-muted-foreground" />
                </div>
              )}
              <div className="p-5">
                <h3 className="line-clamp-1 font-semibold">{listing.title}</h3>
                <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="size-3.5" />
                  <span className="line-clamp-1">{listing.location}</span>
                </p>
                <p className="mt-3 text-sm">
                  {listing.pricing_mode === "monthly" ||
                  listing.pricing_mode === "both" ? (
                    <>
                      <span className="font-semibold">
                        {formatPrice(listing.price_per_month)}
                      </span>
                      <span className="font-normal text-muted-foreground">
                        {" "}
                        / month
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="font-semibold">
                        {formatPrice(listing.price_per_hour)}
                      </span>
                      <span className="font-normal text-muted-foreground">
                        {" "}
                        / hour
                      </span>
                    </>
                  )}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
