import "server-only";
import type {
  ListingFormState,
  ListingCategory,
  PricingMode,
  ListingStatus,
} from "@/lib/types";

const ALLOWED_CATEGORIES: ListingCategory[] = [
  "residential",
  "commercial",
  "public",
];
const ALLOWED_PRICING_MODES: PricingMode[] = ["hourly", "monthly", "both"];
const ALLOWED_STATUSES: ListingStatus[] = ["draft", "active", "booked"];
const ALLOWED_DAYS = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
] as const;
type Weekday = (typeof ALLOWED_DAYS)[number];

function getString(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function getOptionalNumber(
  value: string,
  fieldName: keyof ListingFormState["fieldErrors"],
  fieldErrors: ListingFormState["fieldErrors"],
) {
  if (!value) return null;

  const numberValue = Number(value);
  if (Number.isNaN(numberValue)) {
    fieldErrors[fieldName] = "Enter a valid number.";
    return null;
  }

  return numberValue;
}

export function parseListingFormData(formData: FormData) {
  // Raw, untrusted strings — keep separately so we can echo them back on error.
  const values = {
    title: getString(formData, "title"),
    description: getString(formData, "description"),
    category: getString(formData, "category"),
    location: getString(formData, "location"),
    address: getString(formData, "address"),
    city: getString(formData, "city"),
    district: getString(formData, "district"),
    latitude: getString(formData, "latitude"),
    longitude: getString(formData, "longitude"),
    pricing_mode: getString(formData, "pricing_mode") || "hourly",
    price_per_hour: getString(formData, "price_per_hour"),
    price_per_month: getString(formData, "price_per_month"),
    available_from: getString(formData, "available_from"),
    available_to: getString(formData, "available_to"),
    available_days: formData
      .getAll("available_days")
      .map(String)
      .map((s) => s.trim())
      .filter(Boolean),
    status: getString(formData, "status") || "draft",
  };

  const fieldErrors: ListingFormState["fieldErrors"] = {};

  // --- Required strings ---
  if (!values.title) {
    fieldErrors.title = "Title is required.";
  }
  if (!values.location) {
    fieldErrors.location = "Location is required.";
  }
  if (!values.address) {
    fieldErrors.address = "Please select an address.";
  }

  // --- Enum-style fields: validate against allow-list, narrow on success ---
  let category: ListingCategory | null = null;
  if (!values.category) {
    fieldErrors.category = "Category is required.";
  } else if (!ALLOWED_CATEGORIES.includes(values.category as ListingCategory)) {
    fieldErrors.category = "Choose a valid category.";
  } else {
    category = values.category as ListingCategory;
  }

  let pricingMode: PricingMode | null = null;
  if (!ALLOWED_PRICING_MODES.includes(values.pricing_mode as PricingMode)) {
    fieldErrors.pricing_mode = "Choose a valid pricing mode.";
  } else {
    pricingMode = values.pricing_mode as PricingMode;
  }

  let status: ListingStatus | null = null;
  if (!ALLOWED_STATUSES.includes(values.status as ListingStatus)) {
    fieldErrors.status = "Choose a valid status.";
  } else {
    status = values.status as ListingStatus;
  }

  // --- Numbers ---
  const latitude = getOptionalNumber(values.latitude, "latitude", fieldErrors);
  const longitude = getOptionalNumber(
    values.longitude,
    "longitude",
    fieldErrors,
  );
  const pricePerHour = getOptionalNumber(
    values.price_per_hour,
    "price_per_hour",
    fieldErrors,
  );
  const pricePerMonth = getOptionalNumber(
    values.price_per_month,
    "price_per_month",
    fieldErrors,
  );

  if (latitude != null && (latitude < -90 || latitude > 90)) {
    fieldErrors.latitude = "Latitude must be between -90 and 90.";
  }
  if (longitude != null && (longitude < -180 || longitude > 180)) {
    fieldErrors.longitude = "Longitude must be between -180 and 180.";
  }

  if (pricePerHour != null && pricePerHour < 0) {
    fieldErrors.price_per_hour = "Price per hour must be non-negative.";
  }
  if (pricePerMonth != null && pricePerMonth < 0) {
    fieldErrors.price_per_month = "Price per month must be non-negative.";
  }

  // --- Available days: keep only known weekday strings ---
  const availableDays = values.available_days.filter((d): d is Weekday =>
    (ALLOWED_DAYS as readonly string[]).includes(d),
  );

  // --- Conditional rules tied to pricing mode ---
  if (pricingMode === "hourly" || pricingMode === "both") {
    if (pricePerHour == null) {
      fieldErrors.price_per_hour = "Hourly price is required.";
    }
    if (!values.available_from) {
      fieldErrors.available_from = "Start time is required.";
    }
    if (!values.available_to) {
      fieldErrors.available_to = "End time is required.";
    }
    if (
      values.available_from &&
      values.available_to &&
      values.available_from >= values.available_to
    ) {
      fieldErrors.available_to = "End time must be after start time.";
    }
    if (availableDays.length === 0) {
      fieldErrors.available_days = "Choose at least one day for hourly rental.";
    }
  }

  if (pricingMode === "monthly" || pricingMode === "both") {
    if (pricePerMonth == null) {
      fieldErrors.price_per_month = "Monthly price is required.";
    }
  }

  const hasErrors = Object.keys(fieldErrors).length > 0;

  if (hasErrors || !category || !pricingMode || !status) {
    return {
      ok: false as const,
      fieldErrors,
      values,
    };
  }

  return {
    ok: true as const,
    data: {
      title: values.title,
      description: values.description || null,
      category, // ← narrowed to ListingCategory
      location: values.location,
      address: values.address,
      city: values.city || null,
      district: values.district || null,
      latitude,
      longitude,
      pricing_mode: pricingMode, // ← narrowed to PricingMode
      price_per_hour: pricePerHour,
      price_per_month: pricePerMonth,
      available_from:
        pricingMode === "monthly" ? null : values.available_from || null,
      available_to:
        pricingMode === "monthly" ? null : values.available_to || null,
      available_days: pricingMode === "monthly" ? [] : availableDays,
      status, // ← narrowed to ListingStatus
      image: formData.get("image") as File | null,
      removeImage: String(formData.get("remove_image") ?? "") === "on",
    },
    values,
  };
}
