export type BookingStatus = "pending" | "booked" | "cancelled"

export type Booking = {
  id: string
  listingTitle: string
  guestName: string
  checkIn: string
  checkOut: string
  total: number
  status: BookingStatus
}

const mockBookings: Booking[] = [
  {
    id: "b1",
    listingTitle: "Sea View Loft",
    guestName: "Emma Wilson",
    checkIn: "12 May 2026",
    checkOut: "15 May 2026",
    total: 435,
    status: "pending",
  },
  {
    id: "b2",
    listingTitle: "Mountain Cabin Retreat",
    guestName: "Ivan Petrov",
    checkIn: "18 May 2026",
    checkOut: "22 May 2026",
    total: 760,
    status: "booked",
  },
  {
    id: "b3",
    listingTitle: "City Studio Escape",
    guestName: "Maria Georgieva",
    checkIn: "02 June 2026",
    checkOut: "04 June 2026",
    total: 180,
    status: "cancelled",
  },
]

export async function getMyBookings(): Promise<Booking[]> {
  return mockBookings
}