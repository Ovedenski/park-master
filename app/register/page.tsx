import Link from "next/link"
import { signup } from "./actions"

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create an account",
  description:
    "Sign up for ParkMaster to book parking or list your own parking spot.",
};

type RegisterPageProps = {
  searchParams?: Promise<{
    message?: string
  }>
}

export default async function RegisterPage({ searchParams }: RegisterPageProps) {
  const params = searchParams ? await searchParams : {}
  const message = params?.message

  return (
    <main className="min-h-screen bg-background px-4 py-10">
      <div className="mx-auto flex min-h-[80vh] max-w-md items-center">
        <section className="w-full rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
          <div className="space-y-2 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Create account
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-card-foreground">
              Register
            </h1>
            <p className="text-sm text-muted-foreground">
              Start managing listings, bookings, and your profile.
            </p>
          </div>

          {message ? (
            <div className="mt-6 rounded-2xl border border-border bg-muted px-4 py-3 text-sm text-foreground">
              {message}
            </div>
          ) : null}

          <form action={signup} className="mt-6 space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="firstName" className="text-sm font-medium text-foreground">
                  First name
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  required
                  className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-foreground outline-none transition focus:border-ring"
                  placeholder="First name"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="lastName" className="text-sm font-medium text-foreground">
                  Last name
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  required
                  className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-foreground outline-none transition focus:border-ring"
                  placeholder="Last name"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-foreground">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-foreground outline-none transition focus:border-ring"
                placeholder="you@example.com"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-foreground">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                minLength={6}
                className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-foreground outline-none transition focus:border-ring"
                placeholder="Create a password"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition hover:opacity-90"
            >
              Create account
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-foreground underline underline-offset-4">
              Log in
            </Link>
          </p>
        </section>
      </div>
    </main>
  )
}