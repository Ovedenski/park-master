import type {
  Listing,
  ListingCategory,
  PricingMode,
  ListingStatus,
} from "@/lib/types";
import type { Tables } from "@/lib/supabase/types";

type ListingRow = Tables<"listings">;

/**
 * Narrows the plain-string DB columns (category, pricing_mode, status) to
 * their app-level union types. Safe because the DB has CHECK constraints
 * (listings_category_allowed, listings_pricing_mode_allowed,
 * listings_status_allowed) plus the Zod validator at the app boundary —
 * only allowed values can ever land in these columns.
 */
export function narrowListingRow(
  row: ListingRow,
  imageUrl: string | null,
): Listing {
  return {
    ...row,
    category: row.category as ListingCategory,
    pricing_mode: row.pricing_mode as PricingMode,
    status: row.status as ListingStatus,
    image_url: imageUrl,
  };
}
