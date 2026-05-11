"use client"

export default function AccountError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <main className="mx-auto max-w-2xl px-4 py-16">
      <div className="rounded-3xl border border-border bg-card p-8 shadow-sm">
        <h2 className="text-2xl font-semibold text-card-foreground">
          Something went wrong
        </h2>
        <p className="mt-3 text-sm text-muted-foreground">
          We couldn’t load this account page right now.
        </p>
        <button
          onClick={() => reset()}
          className="mt-6 rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition hover:opacity-90"
        >
          Try again
        </button>
      </div>
    </main>
  )
}