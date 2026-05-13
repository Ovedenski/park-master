import "server-only"
import type { ListingFormState, ListingCategory, PricingMode } from "@/lib/types"

const ALLOWED_CATEGORIES: ListingCategory[] = ["residential", "commercial", "public"]

function getString(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim()
}

function getOptionalNumber(
  value: string,
  fieldName: keyof ListingFormState["fieldErrors"],
  fieldErrors: ListingFormState["fieldErrors"]
) {
  if (!value) return null

  const numberValue = Number(value)
  if (Number.isNaN(numberValue)) {
    fieldErrors[fieldName] = "Enter a valid number."
    return null
  }

  return numberValue
}

export function parseListingFormData(formData: FormData) {
  const values = {
    title: getString(formData, "title"),
    description: getString(formData, "description"),
    category: getString(formData, "category"),
    location: getString(formData, "location"),
    latitude: getString(formData, "latitude"),
    longitude: getString(formData, "longitude"),
    pricing_mode: (getString(formData, "pricing_mode") || "hourly") as PricingMode,
    price_per_hour: getString(formData, "price_per_hour"),
    price_per_month: getString(formData, "price_per_month"),
    available_from: getString(formData, "available_from"),
    available_to: getString(formData, "available_to"),
    available_days: formData.getAll("available_days").map(String).filter(Boolean),
    status: getString(formData, "status") || "draft",
  }

  const fieldErrors: ListingFormState["fieldErrors"] = {}

  if (!values.title) {
    fieldErrors.title = "Title is required."
  }

  if (!values.category) {
    fieldErrors.category = "Category is required."
  } else if (!ALLOWED_CATEGORIES.includes(values.category as ListingCategory)) {
    fieldErrors.category = "Choose a valid category."
  }

  if (!values.location) {
    fieldErrors.location = "Location is required."
  }

  const latitude = getOptionalNumber(values.latitude, "latitude", fieldErrors)
  const longitude = getOptionalNumber(values.longitude, "longitude", fieldErrors)
  const pricePerHour = getOptionalNumber(values.price_per_hour, "price_per_hour", fieldErrors)
  const pricePerMonth = getOptionalNumber(values.price_per_month, "price_per_month", fieldErrors)

  if (pricePerHour != null && pricePerHour < 0) {
    fieldErrors.price_per_hour = "Price per hour must be non-negative."
  }

  if (pricePerMonth != null && pricePerMonth < 0) {
    fieldErrors.price_per_month = "Price per month must be non-negative."
  }

  if (values.pricing_mode === "hourly" || values.pricing_mode === "both") {
    if (pricePerHour == null) {
      fieldErrors.price_per_hour = "Hourly price is required."
    }

    if (!values.available_from) {
      fieldErrors.available_from = "Start time is required."
    }

    if (!values.available_to) {
      fieldErrors.available_to = "End time is required."
    }

    if (
      values.available_from &&
      values.available_to &&
      values.available_from >= values.available_to
    ) {
      fieldErrors.available_to = "End time must be after start time."
    }

    if (values.available_days.length === 0) {
      fieldErrors.available_days = "Choose at least one day for hourly rental."
    }
  }

  if (values.pricing_mode === "monthly" || values.pricing_mode === "both") {
    if (pricePerMonth == null) {
      fieldErrors.price_per_month = "Monthly price is required."
    }
  }

  const hasErrors = Object.keys(fieldErrors).length > 0

  if (hasErrors) {
    return {
      ok: false as const,
      fieldErrors,
      values,
    }
  }

  return {
    ok: true as const,
    data: {
      title: values.title,
      description: values.description || null,
      category: values.category as ListingCategory,
      location: values.location,
      latitude,
      longitude,
      pricing_mode: values.pricing_mode,
      price_per_hour: pricePerHour,
      price_per_month: pricePerMonth,
      available_from: values.pricing_mode === "monthly" ? null : values.available_from || null,
      available_to: values.pricing_mode === "monthly" ? null : values.available_to || null,
      available_days: values.pricing_mode === "monthly" ? [] : values.available_days,
      status: values.status,
      image: formData.get("image") as File | null,
      removeImage: String(formData.get("remove_image") ?? "") === "on",
    },
    values,
  }
}