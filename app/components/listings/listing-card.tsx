import { ListIcon } from "lucide-react"
import Link from "next/link"

interface ListingCardProps {
  listing: {
    id: string
    title: string
    category: string
    location: string
    price: number
    image: string
  }
}

export function ListingCard({ listing }: ListingCardProps) {
  return (
    <Link
      href={`/listings/${listing.id}`}
      className="group overflow-hidden rounded-2xl border bg-background transition hover:shadow-md"
    >
      <div className="aspect-[4/3] overflow-hidden">
        <img
          src={listing.image}
          alt={listing.title}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
        />
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold line-clamp-1">
          {listing.title}
        </h3>

        <p className="mt-1 text-sm text-muted-foreground">
          {listing.location}
        </p>

        <p className="mt-4 text-sm font-medium">
          €{listing.price}
          <span className="text-muted-foreground font-normal"> / rate</span>
        </p>
      </div>
    </Link>
  )
}