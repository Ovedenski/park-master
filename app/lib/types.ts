export interface Listing {
  id: string
  title: string
  category: string
  location: string
  price: number
  image: string
}

export type PricingMode = "hourly" | "monthly" | "both"
export type ListingStatus = "draft" | "active" | "booked"

export type ListingFormValues = {
  id?: string
  host_id?: string
  title?: string
  description?: string | null
  category?: ListingCategory
  location?: string
  latitude?: number | null
  longitude?: number | null
  pricing_mode?: PricingMode
  price_per_hour?: number | null
  price_per_month?: number | null
  available_from?: string | null
  available_to?: string | null
  available_days?: string[]
  image_path?: string | null
  status?: ListingStatus
  created_at?: string
  updated_at?: string
}

export type MyListing = {
  id: string
  host_id: string
  title: string
  description: string | null
  category: string
  location: string
  latitude: number | null
  longitude: number | null
  pricing_mode: PricingMode
  price_per_hour: number | null
  price_per_month: number | null
  available_from: string | null
  available_to: string | null
  available_days: string[]
  image_path: string | null
  image_url: string | null
  status: ListingStatus
  created_at: string
  updated_at: string
}

export type ListingFormState = {
  success: boolean
  message: string | null
  fieldErrors: Partial<Record<string, string>>
  values: {
    title?: string
    description?: string
    category?: string
    location?: string
    latitude?: string
    longitude?: string
    pricing_mode?: string
    price_per_hour?: string
    price_per_month?: string
    available_from?: string
    available_to?: string
    available_days?: string[]
    status?: string
  }
}

export type ListingCategory = "residential" | "commercial" | "public"

export const LISTING_CATEGORIES: { value: ListingCategory; label: string; slug: string }[] = [
  { value: "residential", label: "Residential", slug: "residential" },
  { value: "commercial", label: "Commercial", slug: "commercial" },
  { value: "public", label: "Public", slug: "public" },
]