# ParkMaster

A full-stack parking-space rental platform built with Next.js 16, React 19, TypeScript, and Supabase. Hosts can list parking spots (hourly, monthly, or both); guests can browse, filter by free-text location, view details on an interactive map, and reserve a spot.

This project was developed as a final diploma project at TBS Technology.

---

## Tech stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 16](https://nextjs.org/) (App Router, Server Actions, Turbopack) |
| Language | TypeScript 5.9 |
| UI | React 19, Tailwind CSS 4, [Radix UI](https://www.radix-ui.com/), [lucide-react](https://lucide.dev/) icons |
| Maps | [Leaflet](https://leafletjs.com/) + [react-leaflet](https://react-leaflet.js.org/) |
| Backend / DB | [Supabase](https://supabase.com/) (PostgreSQL, Auth, Storage, RLS) |
| Validation | [Zod 4](https://zod.dev/) (server-side schemas) |
| Tests | [Vitest](https://vitest.dev/) (unit tests for billing + form schemas) |
| Theming | [next-themes](https://github.com/pacocoursey/next-themes) (light/dark mode) |

---

## Features

- **Authentication** — email/password sign-up and sign-in via Supabase Auth, with session-aware middleware protecting `/account`, `/list-spot`, etc.
- **Listings** — hosts can create, edit, and delete parking spots with images uploaded to Supabase Storage.
- **Pricing modes** — hourly, monthly, or both. Hourly listings declare day-of-week availability and a daily time window.
- **Bookings** — guests reserve hourly (15-minute granularity, billing rounded up to the next increment) or monthly (30-day months, rounded up).
- **Overlap protection** — server-side overlap pre-check + Postgres exclusion-constraint fallback (error code `23P01`) prevents double-booking the same spot.
- **Map view** — listing detail page renders the parking spot on an OpenStreetMap-backed Leaflet map.
- **Dark mode** — full theme support via CSS variables and `next-themes`.

---

## Getting started

### Prerequisites

- **Node.js 20+** and **npm 10+**
- A **Supabase** project (free tier is fine). Create one at [supabase.com](https://supabase.com/).

### 1. Clone the repo

```bash
git clone https://github.com/Ovedenski/park-master.git
cd park-master
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Copy the template and fill in your Supabase credentials:

```bash
cp .env.example .env.local
```

Then open `.env.local` and set:

| Variable | Where to find it |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Dashboard → Project Settings → API → Project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase Dashboard → Project Settings → API → Project API keys → `anon` / `publishable` |

### 4. Set up the database

Create the following in your Supabase project:

**Tables** (see `app/lib/supabase/database.types.ts` for full column definitions):

- `profiles` — user profile info, keyed by `auth.users.id`
- `listings` — parking spots (with CHECK constraints on `category`, `pricing_mode`, `status`)
- `bookings` — reservations (with a `tstzrange` exclusion constraint to prevent overlap per listing)

**Storage bucket:** `listings-images` (public read), used for listing photos.

**Row Level Security (RLS):** enable RLS on all tables and add policies allowing:

- Anyone to read `listings` where `status = 'active'`
- Authenticated users to insert/update/delete their own `listings` and `bookings`

> SQL migration files are not committed in this repo (the project uses Supabase's hosted Postgres directly). After any schema change, regenerate types with `npm run supabase:types`.

### 5. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Start the Next.js dev server (Turbopack). |
| `npm run build` | Production build. |
| `npm run start` | Run the production build locally. |
| `npm run lint` | Run ESLint. |
| `npm run lint:fix` | Auto-fix ESLint issues. |
| `npm test` | Run the Vitest test suite once. |
| `npm run test:watch` | Run Vitest in watch mode. |
| `npm run supabase:types` | Regenerate `app/lib/supabase/database.types.ts` from the live Supabase schema. Run this after any database migration. |

---

## Project structure

park-master/
├── app/
│ ├── about/ # About page
│ ├── account/ # Authenticated host area
│ │ ├── bookings/ # Bookings received as host
│ │ ├── listings/ # Manage own listings (incl. [id]/edit)
│ │ ├── profile/ # Profile editor
│ │ └── reservations/ # Bookings made as guest
│ ├── auth/ # Auth callback + sign-out routes
│ ├── components/
│ │ ├── account/ # Account-area UI
│ │ ├── home/ # Hero, featured spots, etc.
│ │ ├── layout/ # Navbar, footer
│ │ ├── listings/ # Listing card, listing form, booking form
│ │ └── ui/ # Reusable primitives (button, input, etc.)
│ ├── lib/
│ │ ├── billing.ts # Pure pricing math (hourly + monthly totals)
│ │ ├── bookings/schema.ts # Zod schema for booking form
│ │ ├── data/listings.ts # Server-side listing queries
│ │ ├── listings/
│ │ │ ├── form.ts # Listing-form server action helpers
│ │ │ ├── normalize.ts # narrowListingRow: DB row → app Listing type
│ │ │ └── schema.ts # Zod schema for listing form
│ │ ├── supabase/
│ │ │ ├── client.ts # Browser Supabase client
│ │ │ ├── server.ts # Server Supabase client
│ │ │ ├── database.types.ts # Generated Supabase types
│ │ │ └── types.ts # Helper aliases (Tables<T>, etc.)
│ │ └── types.ts # App-level types (Listing, BookingFormState, etc.)
│ ├── list-spot/ # Host onboarding (create a new listing)
│ ├── listings/ # Public listing browse + detail
│ │ └── [id]/ # Detail page + booking server action
│ ├── login/ # Sign-in page
│ ├── register/ # Sign-up page
│ ├── globals.css # Tailwind base + CSS-variable theme tokens
│ ├── layout.tsx # Root layout (fonts, theme provider, navbar)
│ └── page.tsx # Home page
├── public/ # Static assets (logos, hero image, favicons)
├── tests/ # Vitest test suite
│ ├── stubs/server-only.ts # Stub for Next.js server-only package
│ ├── billing.test.ts # Pricing math tests
│ ├── bookings-schema.test.ts # Booking-form schema tests
│ └── listings-schema.test.ts # Listing-form schema tests
├── middleware.ts # Auth-aware route protection
├── next.config.ts # Next.js config (incl. Supabase image domain)
├── vitest.config.ts # Vitest config
├── .env.example # Template for required env vars
└── tsconfig.json


---

## Key design decisions

### Server-only validation with Zod

All form validation lives in **`app/lib/listings/schema.ts`** and **`app/lib/bookings/schema.ts`**, marked with `import "server-only"`. Server actions call `schema.safeParse(formData)` and return a `fieldErrors` map via the `useActionState` hook, so the UI shows per-field errors without throwing exceptions.

### Booking form: discriminated union

`bookingFormSchema` is a Zod `discriminatedUnion` on `booking_mode` — `"hourly"` and `"monthly"` are two distinct branches with different required fields. This means the schema can't accidentally accept a half-filled mixed payload.

### Type-safe Supabase access

The Supabase clients (`app/lib/supabase/server.ts` and `client.ts`) are parameterized with `<Database>` from the generated `database.types.ts`. A runtime narrowing helper, **`narrowListingRow`** in `app/lib/listings/normalize.ts`, converts a raw DB row (with `category: string`) to the app's `Listing` type (with `category: ListingCategory`). This is necessary because Postgres CHECK constraints don't propagate to Supabase's TypeScript codegen — only real Postgres `enum` types do.

### Centralized billing math

`app/lib/billing.ts` exports `calcHourlyTotal` and `calcMonthlyTotal` as pure functions, used identically on the server (for the authoritative total stored in the DB) and on the client (for the live preview in the booking form). This guarantees the preview matches the final charge.

---

## Testing

The project ships with a Vitest suite covering the pieces most likely to silently break: **money math** and **input validation**.

```bash
npm test
```

The suite tests:

- `calcHourlyTotal` / `calcMonthlyTotal` — boundary cases (min/max, rounding, floating-point safety)
- `listingFormSchema` — required fields, coordinate ranges, cross-field rules per pricing mode
- `bookingFormSchema` — both branches of the discriminated union, date/time format validation

See `tests/` for the full suite.

---

## Author

Built by **Ivan-Asen Ovedenski** as a final diploma project, Sofia.

- GitHub: [@Ovedenski](https://github.com/Ovedenski)