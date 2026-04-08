import { Container } from "@/components/layout/container"
import { ListingsGrid } from "@/components/listings/listings-grid"
import { mockListings } from "@/lib/mock-listings"
import { notFound } from "next/navigation"

interface CategoryPageProps {
  params: {
    category: string
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await  params

  const filteredListings = mockListings.filter(
    (listing) => listing.category === category
  )

  if (filteredListings.length === 0) {
    notFound()
  }

  return (
    <main className="py-20">
      <Container>
        <div className="mb-10">
          <h1 className="text-4xl font-bold tracking-tight capitalize">
            {category.replace(/-/g, " ")}
          </h1>
          <p className="mt-3 text-muted-foreground">
            Explore available {category.replace(/-/g, " ")} parking spaces.
          </p>
        </div>

        <ListingsGrid listings={filteredListings} />
      </Container>
    </main>
  )
}