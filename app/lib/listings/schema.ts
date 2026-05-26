import "server-only";
import { z } from "zod";

// ----- Enums (single source of truth) -----

export const listingCategorySchema = z.enum([
  "residential",
  "commercial",
  "public",
]);
export const pricingModeSchema = z.enum(["hourly", "monthly", "both"]);
export const listingStatusSchema = z.enum(["draft", "active", "booked"]);
export const weekdaySchema = z.enum([
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
]);

// ----- Reusable field helpers -----

/** Trim, then treat empty string as null. */
const optionalTrimmedString = z
  .string()
  .trim()
  .transform((s) => (s === "" ? null : s))
  .nullable();

/** Trim and require non-empty. */
const requiredTrimmedString = (label: string) =>
  z
    .string()
    .trim()
    .min(1, { message: `${label} is required.` });

/** Parse a form string into an optional number with custom validation. */
const optionalNumberFromString = z
  .string()
  .trim()
  .transform((value, ctx) => {
    if (value === "") return null;
    const n = Number(value);
    if (Number.isNaN(n)) {
      ctx.addIssue({ code: "custom", message: "Enter a valid number." });
      return z.NEVER;
    }
    return n;
  });

// ----- The main schema -----

/**
 * Validates the raw FormData payload for create/edit listing.
 * Returns a fully typed `data` object on success, or per-field error messages.
 */
export const listingFormSchema = z
  .object({
    title: requiredTrimmedString("Title"),
    description: optionalTrimmedString,
    category: listingCategorySchema,
    location: requiredTrimmedString("Location"),
    address: requiredTrimmedString("Please select an address."),
    city: optionalTrimmedString,
    district: optionalTrimmedString,
    latitude: optionalNumberFromString.refine(
      (n) => n == null || (n >= -90 && n <= 90),
      { message: "Latitude must be between -90 and 90." },
    ),
    longitude: optionalNumberFromString.refine(
      (n) => n == null || (n >= -180 && n <= 180),
      { message: "Longitude must be between -180 and 180." },
    ),
    pricing_mode: pricingModeSchema,
    price_per_hour: optionalNumberFromString.refine(
      (n) => n == null || n >= 0,
      { message: "Price per hour must be non-negative." },
    ),
    price_per_month: optionalNumberFromString.refine(
      (n) => n == null || n >= 0,
      { message: "Price per month must be non-negative." },
    ),
    available_from: z.string().trim().optional().default(""),
    available_to: z.string().trim().optional().default(""),
    available_days: z.array(weekdaySchema).default([]),
    status: listingStatusSchema,
  })
  .superRefine((data, ctx) => {
    // Cross-field rules tied to pricing_mode
    const needsHourly =
      data.pricing_mode === "hourly" || data.pricing_mode === "both";
    const needsMonthly =
      data.pricing_mode === "monthly" || data.pricing_mode === "both";

    if (needsHourly) {
      if (data.price_per_hour == null) {
        ctx.addIssue({
          code: "custom",
          path: ["price_per_hour"],
          message: "Hourly price is required.",
        });
      }
      if (!data.available_from) {
        ctx.addIssue({
          code: "custom",
          path: ["available_from"],
          message: "Start time is required.",
        });
      }
      if (!data.available_to) {
        ctx.addIssue({
          code: "custom",
          path: ["available_to"],
          message: "End time is required.",
        });
      }
      if (
        data.available_from &&
        data.available_to &&
        data.available_from >= data.available_to
      ) {
        ctx.addIssue({
          code: "custom",
          path: ["available_to"],
          message: "End time must be after start time.",
        });
      }
      if (data.available_days.length === 0) {
        ctx.addIssue({
          code: "custom",
          path: ["available_days"],
          message: "Choose at least one day for hourly rental.",
        });
      }
    }

    if (needsMonthly) {
      if (data.price_per_month == null) {
        ctx.addIssue({
          code: "custom",
          path: ["price_per_month"],
          message: "Monthly price is required.",
        });
      }
    }
  });

/** Inferred output type — use this everywhere you handle validated form data. */
export type ListingFormInput = z.infer<typeof listingFormSchema>;
