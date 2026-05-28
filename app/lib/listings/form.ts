import "server-only";
import { listingFormSchema } from "@/lib/listings/schema";
import type { ListingFormState } from "@/lib/types";
import { validateImageFile } from "@/lib/listings/image-validation";

/**
 * Read raw form values once, kept as strings so we can echo them back to the UI on error.
 * Everything downstream goes through Zod.
 */
function readRawValues(formData: FormData) {
  return {
    title: String(formData.get("title") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
    category: String(formData.get("category") ?? "").trim(),
    location: String(formData.get("location") ?? "").trim(),
    address: String(formData.get("address") ?? "").trim(),
    city: String(formData.get("city") ?? "").trim(),
    district: String(formData.get("district") ?? "").trim(),
    latitude: String(formData.get("latitude") ?? "").trim(),
    longitude: String(formData.get("longitude") ?? "").trim(),
    pricing_mode: String(formData.get("pricing_mode") ?? "hourly").trim(),
    price_per_hour: String(formData.get("price_per_hour") ?? "").trim(),
    price_per_month: String(formData.get("price_per_month") ?? "").trim(),
    available_from: String(formData.get("available_from") ?? "").trim(),
    available_to: String(formData.get("available_to") ?? "").trim(),
    available_days: formData
      .getAll("available_days")
      .map(String)
      .map((s) => s.trim())
      .filter(Boolean),
    status: String(formData.get("status") ?? "draft").trim(),
  };
}

export function parseListingFormData(formData: FormData) {
  const rawValues = readRawValues(formData);
  const result = listingFormSchema.safeParse(rawValues);

  const imageFile = formData.get("image") as File | null;
  const imageError = validateImageFile(imageFile);

  if (!result.success || imageError) {
    const fieldErrors: ListingFormState["fieldErrors"] = {};

    if (!result.success) {
      for (const issue of result.error.issues) {
        const key = issue.path[0];
        if (typeof key === "string" && !fieldErrors[key]) {
          fieldErrors[key] = issue.message;
        }
      }
    }

    if (imageError) {
      fieldErrors.image = imageError;
    }

    return {
      ok: false as const,
      fieldErrors,
      values: rawValues,
    };
  }

  const data = result.data;

  return {
    ok: true as const,
    data: {
      title: data.title,
      description: data.description,
      category: data.category,
      location: data.location,
      address: data.address,
      city: data.city,
      district: data.district,
      latitude: data.latitude,
      longitude: data.longitude,
      pricing_mode: data.pricing_mode,
      price_per_hour: data.price_per_hour,
      price_per_month: data.price_per_month,
      available_from:
        data.pricing_mode === "monthly" ? null : data.available_from || null,
      available_to:
        data.pricing_mode === "monthly" ? null : data.available_to || null,
      available_days:
        data.pricing_mode === "monthly" ? [] : data.available_days,
      status: data.status,
      image: imageFile,
      removeImage: String(formData.get("remove_image") ?? "") === "on",
    },
    values: rawValues,
  };
}
