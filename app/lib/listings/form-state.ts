import type { ListingFormState } from "@/lib/types"

export const initialListingFormState: ListingFormState = {
  success: false,
  message: null,
  fieldErrors: {},
  values: {},
}