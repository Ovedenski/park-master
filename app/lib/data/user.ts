export type UserProfile = {
  firstName: string
  lastName: string
  email: string
  phone: string
  bio: string
  country: string
  city: string
  address: string
}

const mockUser: UserProfile = {
  firstName: "Martin",
  lastName: "Dimitrov",
  email: "martin@example.com",
  phone: "+359 88 123 4567",
  bio: "Host and traveler who enjoys clean spaces, good design, and smooth guest experiences.",
  country: "Bulgaria",
  city: "Sofia",
  address: "15 Vitosha Blvd",
}

export async function getCurrentUser(): Promise<UserProfile> {
  return mockUser
}