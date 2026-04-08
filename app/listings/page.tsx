import { Container } from "@/components/layout/container"
import { ListingsGrid } from "@/components/listings/listings-grid"
import { mockListings } from "@/lib/mock-listings"

export default function ListingsPage() {
  return (
    <main className="py-20">
      <Container>
        <div className="mb-10">
          <h1 className="text-4xl font-bold tracking-tight">
            All Listings
          </h1>
          <p className="mt-3 text-muted-foreground">
            Browse all available parking spaces.
          </p>
        </div>

        <ListingsGrid listings={mockListings} />
      </Container>
    </main>
  )
}