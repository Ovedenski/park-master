import { describe, it, expect } from "vitest";
import { listingFormSchema } from "../app/lib/listings/schema";

/** Helper: a fully-valid hourly listing payload. */
function validHourly() {
  return {
    title: "Garage near Vitosha",
    description: "Covered spot, easy access.",
    category: "residential",
    location: "Sofia center",
    address: "ul. Vitosha 1, Sofia",
    city: "Sofia",
    district: "Center",
    latitude: "42.6977",
    longitude: "23.3219",
    pricing_mode: "hourly",
    price_per_hour: "5",
    price_per_month: "",
    available_from: "08:00",
    available_to: "20:00",
    available_days: ["monday", "tuesday", "wednesday"],
    status: "active",
  };
}

/** Helper: a fully-valid monthly listing payload. */
function validMonthly() {
  return {
    ...validHourly(),
    pricing_mode: "monthly",
    price_per_hour: "",
    price_per_month: "200",
    available_from: "",
    available_to: "",
    available_days: [],
  };
}

describe("listingFormSchema — happy path", () => {
  it("accepts a valid hourly listing", () => {
    const result = listingFormSchema.safeParse(validHourly());
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.price_per_hour).toBe(5);
      expect(result.data.price_per_month).toBeNull();
      expect(result.data.latitude).toBe(42.6977);
    }
  });

  it("accepts a valid monthly listing with no time window", () => {
    const result = listingFormSchema.safeParse(validMonthly());
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.price_per_month).toBe(200);
      expect(result.data.price_per_hour).toBeNull();
    }
  });

  it("accepts pricing_mode 'both' when all fields are present", () => {
    const result = listingFormSchema.safeParse({
      ...validHourly(),
      pricing_mode: "both",
      price_per_month: "150",
    });
    expect(result.success).toBe(true);
  });

  it("treats empty optional strings as null", () => {
    const result = listingFormSchema.safeParse({
      ...validHourly(),
      description: "",
      city: "",
      district: "",
      latitude: "",
      longitude: "",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.description).toBeNull();
      expect(result.data.city).toBeNull();
      expect(result.data.latitude).toBeNull();
    }
  });
});

describe("listingFormSchema — required fields", () => {
  it("rejects empty title", () => {
    const result = listingFormSchema.safeParse({
      ...validHourly(),
      title: "   ",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const issues = result.error.issues.filter((i) => i.path[0] === "title");
      expect(issues.length).toBeGreaterThan(0);
    }
  });

  it("rejects empty address", () => {
    const result = listingFormSchema.safeParse({
      ...validHourly(),
      address: "",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((i) => i.path[0] === "address")).toBe(
        true,
      );
    }
  });

  it("rejects an invalid category", () => {
    const result = listingFormSchema.safeParse({
      ...validHourly(),
      category: "industrial",
    });
    expect(result.success).toBe(false);
  });
});

describe("listingFormSchema — coordinates", () => {
  it("rejects latitude > 90", () => {
    const result = listingFormSchema.safeParse({
      ...validHourly(),
      latitude: "120",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((i) => i.path[0] === "latitude")).toBe(
        true,
      );
    }
  });

  it("rejects longitude < -180", () => {
    const result = listingFormSchema.safeParse({
      ...validHourly(),
      longitude: "-200",
    });
    expect(result.success).toBe(false);
  });

  it("rejects non-numeric latitude", () => {
    const result = listingFormSchema.safeParse({
      ...validHourly(),
      latitude: "not-a-number",
    });
    expect(result.success).toBe(false);
  });
});

describe("listingFormSchema — cross-field rules (hourly)", () => {
  it("requires price_per_hour when pricing_mode is hourly", () => {
    const result = listingFormSchema.safeParse({
      ...validHourly(),
      price_per_hour: "",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(
        result.error.issues.some((i) => i.path[0] === "price_per_hour"),
      ).toBe(true);
    }
  });

  it("requires available_from / available_to", () => {
    const result = listingFormSchema.safeParse({
      ...validHourly(),
      available_from: "",
      available_to: "",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const paths = result.error.issues.map((i) => i.path[0]);
      expect(paths).toContain("available_from");
      expect(paths).toContain("available_to");
    }
  });

  it("rejects available_to <= available_from", () => {
    const result = listingFormSchema.safeParse({
      ...validHourly(),
      available_from: "20:00",
      available_to: "08:00",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(
        result.error.issues.some(
          (i) =>
            i.path[0] === "available_to" && String(i.message).includes("after"),
        ),
      ).toBe(true);
    }
  });

  it("requires at least one available day", () => {
    const result = listingFormSchema.safeParse({
      ...validHourly(),
      available_days: [],
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(
        result.error.issues.some((i) => i.path[0] === "available_days"),
      ).toBe(true);
    }
  });

  it("rejects invalid weekday values", () => {
    const result = listingFormSchema.safeParse({
      ...validHourly(),
      available_days: ["monday", "funday"],
    });
    expect(result.success).toBe(false);
  });

  it("rejects negative hourly price", () => {
    const result = listingFormSchema.safeParse({
      ...validHourly(),
      price_per_hour: "-5",
    });
    expect(result.success).toBe(false);
  });
});

describe("listingFormSchema — cross-field rules (monthly)", () => {
  it("requires price_per_month when pricing_mode is monthly", () => {
    const result = listingFormSchema.safeParse({
      ...validMonthly(),
      price_per_month: "",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(
        result.error.issues.some((i) => i.path[0] === "price_per_month"),
      ).toBe(true);
    }
  });

  it("requires both prices when pricing_mode is 'both'", () => {
    const result = listingFormSchema.safeParse({
      ...validHourly(),
      pricing_mode: "both",
      price_per_hour: "",
      price_per_month: "",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const paths = result.error.issues.map((i) => i.path[0]);
      expect(paths).toContain("price_per_hour");
      expect(paths).toContain("price_per_month");
    }
  });
});
