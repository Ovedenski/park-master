"use client"

import { useActionState, useMemo, useState, useEffect } from "react"
import type {
  ListingFormState,
  Listing,
  PricingMode,
} from "@/lib/types"
import { LISTING_CATEGORIES } from "@/lib/types"
import AddressPicker from "@/components/listings/address-picker";

type ListingFormProps = {
  action: (
    prevState: ListingFormState,
    formData: FormData,
  ) => Promise<ListingFormState>;
  initialState: ListingFormState;
  submitLabel: string;
  listing?: Partial<Listing>
  currentImageUrl?: string | null;
  userEmail?: string | null;
};

const DAYS = [
  { value: "monday", label: "Mon" },
  { value: "tuesday", label: "Tue" },
  { value: "wednesday", label: "Wed" },
  { value: "thursday", label: "Thu" },
  { value: "friday", label: "Fri" },
  { value: "saturday", label: "Sat" },
  { value: "sunday", label: "Sun" },
] as const

export default function ListingForm({
  action,
  initialState,
  submitLabel,
  listing,
  currentImageUrl,
  userEmail,
}: ListingFormProps) {
  const [state, formAction, isPending] = useActionState(action, initialState)

useEffect(() => {
  const firstErrorField = Object.keys(state.fieldErrors)[0];
  if (!firstErrorField) return;

  // Map error keys to actual DOM ids when they differ
  const idMap: Record<string, string> = {
    address: "address-search",
    latitude: "address-search",
    longitude: "address-search",
  };
  const targetId = idMap[firstErrorField] ?? firstErrorField;

  const el = document.getElementById(targetId);
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "center" });
    // small delay so focus doesn't fight the scroll
    setTimeout(() => (el as HTMLElement).focus({ preventScroll: true }), 300);
  }
  }, [state]);

  const initialPricingMode = (state.values.pricing_mode ??
    listing?.pricing_mode ??
    "hourly") as PricingMode

  const [pricingMode, setPricingMode] = useState<PricingMode>(initialPricingMode)

  const availableDays = useMemo(
    () => state.values.available_days ?? listing?.available_days ?? [],
    [state.values.available_days, listing?.available_days]
  )

  const showHourlyFields = pricingMode === "hourly" || pricingMode === "both"
  const showMonthlyFields = pricingMode === "monthly" || pricingMode === "both"

  return (
    <form
      action={formAction}
      className="space-y-8 rounded-xl border bg-card p-6 shadow-sm"
    >
      {state.message ? (
        <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.message}
        </div>
      ) : null}

      <section className="space-y-4">
        <h2 className="text-lg font-medium">Spot details</h2>

        <div className="space-y-2">
          <label htmlFor="title" className="text-sm font-medium">
            Title
          </label>
          <input
            id="title"
            name="title"
            defaultValue={state.values.title ?? listing?.title ?? ""}
            className="w-full rounded-md border px-3 py-2"
          />
          {state.fieldErrors.title ? (
            <p className="text-sm text-red-600">{state.fieldErrors.title}</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <label htmlFor="description" className="text-sm font-medium">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            defaultValue={
              state.values.description ?? listing?.description ?? ""
            }
            className="w-full rounded-md border px-3 py-2"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="category" className="text-sm font-medium">
            Category
          </label>
          <select
            key={
              state.values.category ?? listing?.category ?? "category-default"
            }
            id="category"
            name="category"
            defaultValue={
              state.values.category ?? listing?.category ?? "residential"
            }
            className="w-full rounded-md border px-3 py-2"
          >
            {LISTING_CATEGORIES.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
          {state.fieldErrors.category ? (
            <p className="text-sm text-red-600">{state.fieldErrors.category}</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <label htmlFor="location" className="text-sm font-medium">
            Area / City
          </label>
          <input
            id="location"
            name="location"
            defaultValue={state.values.location ?? listing?.location ?? ""}
            placeholder="Example: Lozenets, Sofia"
            className="w-full rounded-md border px-3 py-2"
          />
          {state.fieldErrors.location ? (
            <p className="text-sm text-red-600">{state.fieldErrors.location}</p>
          ) : null}
        </div>

        <AddressPicker
          defaultAddress={state.values.address ?? listing?.address ?? ""}
          defaultLatitude={state.values.latitude ?? listing?.latitude ?? ""}
          defaultLongitude={state.values.longitude ?? listing?.longitude ?? ""}
          addressError={state.fieldErrors.address}
          latitudeError={state.fieldErrors.latitude}
          longitudeError={state.fieldErrors.longitude}
        />

        {currentImageUrl ? (
          <div className="space-y-3">
            <p className="text-sm font-medium">Current image</p>
            <div className="overflow-hidden rounded-lg border bg-muted">
              <img
                src={currentImageUrl}
                alt={listing?.title ?? "Current listing image"}
                className="h-48 w-full object-cover"
              />
            </div>

            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="remove_image" />
              <span>Remove current image</span>
            </label>
          </div>
        ) : null}

        <div className="space-y-2">
          <label htmlFor="image" className="text-sm font-medium">
            {currentImageUrl ? "Replace image" : "Upload image"}
          </label>
          <input
            id="image"
            name="image"
            type="file"
            accept="image/*"
            className="w-full rounded-md border px-3 py-2"
          />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-medium">Pricing</h2>

        <div className="space-y-2">
          <label htmlFor="pricing_mode" className="text-sm font-medium">
            Rental mode
          </label>
          <select
            id="pricing_mode"
            name="pricing_mode"
            value={pricingMode}
            onChange={(event) =>
              setPricingMode(event.target.value as PricingMode)
            }
            className="w-full rounded-md border px-3 py-2"
          >
            <option value="hourly">Hourly</option>
            <option value="monthly">Monthly</option>
            {/* <option value="both">Hourly and monthly</option> */}
          </select>
        </div>

        {showHourlyFields ? (
          <div className="space-y-2">
            <label htmlFor="price_per_hour" className="text-sm font-medium">
              Price per hour
            </label>
            <input
              id="price_per_hour"
              name="price_per_hour"
              type="number"
              min="0"
              step="1"
              defaultValue={
                state.values.price_per_hour ?? listing?.price_per_hour ?? ""
              }
              className="w-full rounded-md border px-3 py-2"
            />
            {state.fieldErrors.price_per_hour ? (
              <p className="text-sm text-red-600">
                {state.fieldErrors.price_per_hour}
              </p>
            ) : null}
          </div>
        ) : null}

        {showMonthlyFields ? (
          <div className="space-y-2">
            <label htmlFor="price_per_month" className="text-sm font-medium">
              Price per month
            </label>
            <input
              id="price_per_month"
              name="price_per_month"
              type="number"
              min="0"
              step="1"
              defaultValue={
                state.values.price_per_month ?? listing?.price_per_month ?? ""
              }
              className="w-full rounded-md border px-3 py-2"
            />
            {state.fieldErrors.price_per_month ? (
              <p className="text-sm text-red-600">
                {state.fieldErrors.price_per_month}
              </p>
            ) : null}
          </div>
        ) : null}
      </section>

      {showHourlyFields ? (
        <section className="space-y-4">
          <h2 className="text-lg font-medium">Hourly availability</h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="available_from" className="text-sm font-medium">
                From
              </label>
              <input
                id="available_from"
                name="available_from"
                type="time"
                defaultValue={
                  state.values.available_from ?? listing?.available_from ?? ""
                }
                className="w-full rounded-md border px-3 py-2"
              />
              {state.fieldErrors.available_from ? (
                <p className="text-sm text-red-600">
                  {state.fieldErrors.available_from}
                </p>
              ) : null}
            </div>

            <div className="space-y-2">
              <label htmlFor="available_to" className="text-sm font-medium">
                To
              </label>
              <input
                id="available_to"
                name="available_to"
                type="time"
                defaultValue={
                  state.values.available_to ?? listing?.available_to ?? ""
                }
                className="w-full rounded-md border px-3 py-2"
              />
              {state.fieldErrors.available_to ? (
                <p className="text-sm text-red-600">
                  {state.fieldErrors.available_to}
                </p>
              ) : null}
            </div>
          </div>

          <fieldset className="space-y-3">
            <legend className="text-sm font-medium">Available days</legend>
            <div className="flex flex-wrap gap-3">
              {DAYS.map((day) => (
                <label
                  key={day.value}
                  className="flex items-center gap-2 rounded-md border px-3 py-2 text-sm"
                >
                  <input
                    type="checkbox"
                    name="available_days"
                    value={day.value}
                    defaultChecked={availableDays.includes(day.value)}
                  />
                  <span>{day.label}</span>
                </label>
              ))}
            </div>
            {state.fieldErrors.available_days ? (
              <p className="text-sm text-red-600">
                {state.fieldErrors.available_days}
              </p>
            ) : null}
          </fieldset>
        </section>
      ) : null}

      <section className="space-y-4">
        <h2 className="text-lg font-medium">Publishing</h2>

        <div className="space-y-2">
          <label htmlFor="status" className="text-sm font-medium">
            Status
          </label>
          <select
            id="status"
            name="status"
            defaultValue={state.values.status ?? listing?.status ?? "draft"}
            className="w-full rounded-md border px-3 py-2"
          >
            <option value="draft">Draft</option>
            <option value="active">Active</option>
            <option value="booked">Booked</option>
          </select>
        </div>
      </section>

      <div className="flex items-center justify-between gap-4 border-t pt-6">
        <p className="text-sm text-muted-foreground">
          {userEmail ? `Logged in as ${userEmail}` : "Host dashboard"}
        </p>
        <button
          type="submit"
          disabled={isPending}
          className="rounded-md bg-primary px-4 py-2 text-primary-foreground disabled:opacity-60"
        >
          {isPending ? "Saving..." : submitLabel}
        </button>
      </div>
    </form>
  );
}