import "server-only"

export type ListingStatus = "active" | "draft" | "booked"

export type Listing = {
  id: string
  title: string
  category: string
  location: string
  price: number
  image?: string
  status: ListingStatus
}

const mockListings: Listing[] = [
  {
    id: "1",
    title: "Sea View Loft",
    category: "Apartments",
    location: "Varna, Bulgaria",
    price: 145,
    status: "active",
  },
  {
    id: "2",
    title: "Mountain Cabin Retreat",
    category: "Cabins",
    location: "Bansko, Bulgaria",
    price: 190,
    status: "draft",
  },
  {
    id: "3",
    title: "City Studio Escape",
    category: "Studios",
    location: "Sofia, Bulgaria",
    price: 90,
    status: "booked",
  },
]

export async function getMyListings(): Promise<Listing[]> {
  return mockListings
}