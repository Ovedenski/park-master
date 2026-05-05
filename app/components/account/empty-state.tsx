import Link from "next/link"

type EmptyStateProps = {
  title: string
  description: string
  actionLabel?: string
  actionHref?: string
}

export default function EmptyState({
  title,
  description,
  actionLabel,
  actionHref,
}: EmptyStateProps) {
  return (
    <section className="rounded-3xl border bg-background bg-neutral-50 px-6 py-14 text-center">
      <div className="mx-auto max-w-md space-y-3">
        <h2 className="text-xl font-semibold text-neutral-900">{title}</h2>
        <p className="text-sm text-neutral-600">{description}</p>

        {actionLabel && actionHref ? (
          <Link
            href={actionHref}
            className="inline-flex items-center justify-center rounded-full bg-neutral-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-neutral-800"
          >
            {actionLabel}
          </Link>
        ) : null}
      </div>
    </section>
  )
}